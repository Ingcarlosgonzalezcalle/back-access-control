


import Store from '../../../models/store.js'
import Liquidation from '../../../models/liquidations.js'
import Balance from '../../../models/balance.js'
import Movement from '../../../models/movement.js'
import MovementDetail from '../../../models/movementDetail.js'
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2'
import { Op, fn, col } from "sequelize";



const deleteMovement = async (movementId) => {

  console.log("inicia todo")
  const transaction = await Movement.sequelize.transaction(); // Iniciar transacción

  try {
    // Buscar el movimiento
    const model = await Movement.findOne({ where: { id: movementId }, transaction });
    if (!model) {
      await transaction.rollback();
      return { message: "Movimiento no encontrado", status: 404 };
    }

    const { storeId, quantity, type } = model;
    console.log(`${storeId} - ${quantity} - ${type} -`);

    // Buscar el Storee relacionado
    const store = await Store.findOne({ where: { id: storeId }, transaction });
    if (!Store) {
      console.log("el Storee no existe")
      await transaction.rollback();
      return { message: "Storee no existe: " + storeId, status: 400 };
    }

    console.log("el Storee si existe")



    console.log("Store", store)
    if (type === 2 || type === 5 || type === 4) { // 1:salida , 5:despacho o 4:ajuste negativo >>> Incrementar saldo
      store.balance += quantity;
      const balance = store.balance
      //si es un ajuste negativo y el saldo es 0, se debe cambiar el estado del Storee a false
      if (type === 4 & balance == 0) {
        store.state = false;
      }

    } else if (type === 1 || type === 3) { // Entrada o ajuste positivo >>> Disminuir saldo
      store.balance -= quantity;
    }
    else {
    }

    await store.save({ transaction });
    await MovementDetail.destroy({ where: { movementId }, transaction });
    await Movement.destroy({ where: { id: movementId }, transaction });
    await transaction.commit();

    return { message: "Éxito", success: true, status: 200, error: null };

  } catch (error) {
    console.log("error:", error)
    await transaction.rollback();
    return { message: "Error", success: false, status: 500, error };
  }
};



const get = async (idFind) => {
  const model = await Movement.findOne(
    { where: { id: idFind } },
    { attributes: { exclude: ['createdAt', 'updatedAt'] } }
  );
  return model
}

const getList = async () => {
  try {
    const list = await Movement.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } });
    return { list: list, status: 200 };
  } catch (err) {
    return { list: null, status: 500, error: err };
  }
}


const insert = async (body) => {
  try {
    const movement = body.movement
    const movementDetails = body.movementDetails
    await Movement.create(movement)
    if (movementDetails != undefined && movementDetails != null && movementDetails != "") {
      if (movementDetails.length > 0)
        await MovementDetail.bulkCreate(movementDetails);

    }

    //ACTUALIZO EL SALDO DEL PRODUCTO EN BODEGA
    const storeId = movement.storeId
    const productId = movement.productId
    const record = await Balance.findOne({ where: { storeId, productId } });
    const type = movement.operationType
    if ([2, 4, 5, 7].includes(type)) // 1:salida , 4:ajuste negativo, 5:despacho, 7:mezclado
    {
      console.log(`1:salida , 4:ajuste negativo o  5:despacho (${type})`)
      record.balance -= movement.quantity;
      record.save()
    }
    else if ([1, 3, 8, 6].includes(type)) { // 1:Entrada o 3:ajuste positivo 8 : conformacion materia prima, aireación
      console.log(`1:Entrada o 3:ajuste positivo (${type})`)
      record.balance += movement.quantity;
      record.save()
    }


    return { message: 'Realizado!', status: 200 };
  } catch (err) {
    return { message: 'Error en el servidor', status: 500, error: err };
  }
}







const getDataLiquidation = async (body) => {

  const {storeId, dateLiquidation,productId} = body
  console.log("getDataLiquidation")
  //const initial_balance = 0;

  console.log(`${storeId}   ${dateLiquidation}  ${productId}`)

  const previousDate = getPreviousDate(dateLiquidation);

  // buscar en LiquidationDetails el final_balance del día anterior
  const previousDay = await Liquidation.findOne({
    where: { storeId, date: previousDate },
    attributes: ["finalBalance"],
    order: [["createdAt", "DESC"]] // por si hubiera más de un registro
  });

  const initial_balance = previousDay ? previousDay.finalBalance : 0;

  // === PRIMERA CONSULTA: SUMAS GENERALES ===
  const results = await Movement.findAll({
    attributes: [
      "storeId",
      "operationType",
      "storeName",
      "productName",
      [fn("SUM", col("quantity")), "totalQuantity"],
      [fn("SUM", col("bags")), "totalBags"]
    ],
    where: {
      storeId,
      productId,
      date: {
        [Op.eq]: dateLiquidation
      }
    },
    group: ["storeId", "operationType","productName","storeName"],
    raw: true
  });

  let storeName = "";
  let productName = "0";
  let input = 0;
  let output = 0;
  let positive = 0;
  let negative = 0;
  let dispatch = 0;  
  let aeration = 0;
  let consumption = 0;
  let conformation = 0;
  ///generation es la suma de las aireaciones y de las conformaciones
  let generation = 0;
  let bags = 0;

  results.forEach(r => {
    productName= r.productName;
    storeName= r.storeName;
    bags += parseInt(r.totalBags);
    switch (r.operationType) {
      case 1:
        input = parseInt(r.totalQuantity);
        break;
      case 2:
        output = parseInt(r.totalQuantity);
        break;
      case 3:
        positive = parseInt(r.totalQuantity);
        break;
      case 4:
        negative = parseInt(r.totalQuantity);
        break;
      case 6:
        aeration = parseInt(r.totalQuantity);
        break;
      case 7:
        consumption = parseInt(r.totalQuantity);
        break;
      case 8:
        conformation = parseInt(r.totalQuantity);
        break;
    }
  });

  const final_balance = initial_balance + input - output + positive  + aeration - consumption +conformation;
  generation = aeration+conformation



  // === RESPUESTA FINAL ===
  const data = {
    input,
    output,
    dispatch,
    positive,
    negative,
    consumption,
    aeration,
    conformation,
    generation,
    bags,
    initial_balance,
    final_balance,
    previousDate,
    storeName,
    productName
  };

  return data;
};





const getPreviousDate = (dateLiquidation) => {
  const date = new Date(dateLiquidation);   // "2025-09-19"
  date.setDate(date.getDate() - 1);         // restamos 1 día
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};



export default {
  get,
  getList,
  insert,
  deleteMovement,
  getDataLiquidation
};