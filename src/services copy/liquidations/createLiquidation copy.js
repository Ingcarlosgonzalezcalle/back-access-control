


import Store from '../../models/store.js'
import Liquidation from '../../models/liquidations.js'
import Movement from '../../models/movement.js'
import MovementDetail from '../../models/movementDetail.js'
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2'
import { Op, fn, col } from "sequelize";



const createLiquidation = async (body) => {


  ///las liquidaciones se hacen por producto
  let message = "";
  const dateLiquidation = body.date

  ///LO PRIMERO ES SABER SI EXISTEN MOVIMIENTOS A LA FECHA
  const existBeforeMovement = await Movement.findOne({
    where: {
      date: { [Op.lte]: dateLiquidation }
    },
    order: [['date', 'DESC']]
  });



  ////SI NO HAY MOVIMIENTOS ANTES O IGUALES A LA FECHA
  if (!existBeforeMovement) {
    console.log("NO HAY MOVIMIENTOS ANTES O IGUALES A LA FECHA")
    const firstMovement = await Movement.findOne({
      where: {
        date: { [Op.gt]: dateLiquidation }
      },
      order: [['date', 'ASC']]
    });

    if (firstMovement) {
      return { success: false, message: `El primer movimiento desde ${dateLiquidation} es de: ${firstMovement.date} `, status: 201 };
    }
    else {
      return { success: false, message: `No existen movimientos a la fecha   ${dateLiquidation} `, status: 201 };
    }
  }
  else {
    console.log("SI HAY MOVIMIENTOS ANTES O IGUALES A LA FECHA")
  }


  // Paso 1: obtengo la fecha del dia anterior
  const yesterday = getPreviousDate(dateLiquidation);
  ///busco ultima liquidacion realizada antes de la fecha dateLiquidation
  const lastLiquidation = await Liquidation.findOne({
    where: {
      date: { [Op.lte]: dateLiquidation }
    },
    order: [['date', 'DESC']]
  });
  console.log("lastLiquidation:::", lastLiquidation)

  if (lastLiquidation) {

    if (lastLiquidation.date == yesterday) {
      console.log("SUCCESS: Es posible realizar la liquidación")
    }
    else if (lastLiquidation.date == dateLiquidation) {
      console.log("SUCCESS: Es posible realizar la re-liquidación")
    }
    else {
      return { success: false, message: `ERROR: Ultima liquidacion: ${lastLiquidation.date}  `, status: 201 };
    }

  }
  else {
    if (!lastLiquidation) {
      const beforeMovement = await Movement.findOne({
        where: {
          date: { [Op.lt]: dateLiquidation }
        },
        order: [['date', 'DESC']]
      });

      if (beforeMovement) {
        console.log("si no hay liquidaciones y hay movimientos antes de la fecha, no se puede liquidar")
        return { success: false, message: `hay movimientos previos a:\n ${dateLiquidation}\n sin liquidar  `, status: 201 };
      }
    }
    console.log("SI HAY MOVIMIENTOS ANTES O IGUALES A LA FECHA")
  }






  const liquidationStores = await Store.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: { type: { [Op.lte]: 2 } },
    order: [['id', 'ASC']],
  });



  await Promise.all(
    liquidationStores.map(async (element) => {

      for (let i = 1; i <= 8; i++) {
        const productId = i
        const storeId = element.id
        const data = await getDataLiquidation(storeId, dateLiquidation, yesterday, productId);

        message = data.message;

        await Liquidation.destroy({
          where: {
            storeId,
            productId,
            date: { [Op.gte]: dateLiquidation }
          }
        });

        await Liquidation.upsert({
          storeId,
          productId,
          date: dateLiquidation,
          ...data
        });

      }




    })
  );






  return { success: true, message, status: 200 };
};






const getDataLiquidation = async (storeId, dateLiquidation, yesterday, productId) => {
  //const initial_balance = 0;

  let message = "";
  ////TRAIGO LA LIQUIDACION DEL DIA ANTERIOR
  const yesterDayLiquidation = await Liquidation.findOne({
    where: { storeId, date: yesterday }
  });
  let initial_balance = 0;
  if (yesterDayLiquidation) {
    console.log("Hay una liquidacion del dia anterior")
    message = `SUCCESS: Liquidación exitosa`
    initial_balance = yesterDayLiquidation.finalBalance;
    console.log("Hay una liquidacion del dia anterior con initial_balance:", initial_balance)
  } else {
    message = `SUCCESS: se reliquida el día: ${dateLiquidation}`
    console.log("no Hay una liquidacion del dia anterior, de seguro es una del dia actual")
  }

  const results = await Movement.findAll({
    attributes: [
      "storeId",
      "operationType",
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
    group: ["storeId", "operationType"],
    raw: true
  });

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

  const final_balance = initial_balance + input - output + positive + aeration - consumption + conformation;
  generation = aeration + conformation

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
    initialBalance: initial_balance,
    finalBalance: final_balance,
    message
  };

  return data;
};




const getPreviousDate = (dateLiquidation) => {
  const [year, month, day] = dateLiquidation.split("-").map(Number);
  const date = new Date(year, month - 1, day); // <-- crea fecha local
  date.setDate(date.getDate() - 1);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};


export default createLiquidation