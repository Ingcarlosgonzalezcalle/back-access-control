


import Liquidation from '../../models/liquidations.js'
import Movement from '../../models/movement.js'
import { Op, fn, col } from "sequelize";




const getPreviousDate = (dateLiquidation) => {
  const [year, month, day] = dateLiquidation.split("-").map(Number);
  const date = new Date(year, month - 1, day); // <-- crea fecha local
  date.setDate(date.getDate() - 1);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};





const verifyLiquidationDate = async (dateLiquidation) => {


  let message = "";

  ///LO PRIMERO ES SABER SI EXISTEN MOVIMIENTOS A LA FECHA
  const existBeforeMovement = await Movement.findOne({
    where: {
      date: { [Op.lte]: dateLiquidation }
    },
    order: [['date', 'DESC']]
  });



  ///busco ultima liquidacion realizada antes de la fecha dateLiquidation
  ///no se puede liquidar una fecha si hay movimientos antes de dicha fecha
  const lastLiquidation = await Liquidation.findOne({
    where: {
      date: { [Op.lte]: dateLiquidation }
    },
    order: [['date', 'DESC']]
  });
  console.log("lastLiquidation:::", lastLiquidation)




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
      return { success: false, message: `FALLIDA:\n El primer movimiento \ndesde: ${dateLiquidation} \ncorresponde a: ${firstMovement.date} `, status: 201 };
    }
    else {
      return { success: false, message: `FALLIDA\n: No existen movimientos a la fecha   ${dateLiquidation} `, status: 201 };
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


  // Paso 1: obtengo la fecha del dia anterior
  const yesterday = getPreviousDate(dateLiquidation);


  if (lastLiquidation) {

    if (lastLiquidation.date == yesterday) {
      message = "EXITO:\n Es posible realizar \nuna nueva liquidación"
    }
    else if (lastLiquidation.date == dateLiquidation) {
      message = "EXITO:\n Es posible sobreescribir \nla liquidación"
    }
    else {
      return { success: false, message: `FALLIDO:\n Ultima liquidacion:\n ${lastLiquidation.date}  `, status: 201 };
    }

  }
  else {
    message = `SUCCESS: Primera liquidación \nantes de: ${dateLiquidation}  `
  }




  return { success: true, message, status: 200 };
};



export default verifyLiquidationDate