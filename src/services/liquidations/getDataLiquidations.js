


import Liquidation from '../../models/liquidations.js'
import Movement from '../../models/movement.js'
import { Op, fn, col } from "sequelize";







const getDataLiquidation = async (storeId, dateLiquidation, yesterday) => {
  //const initial_balance = 0;

  let message = "";
  ////TRAIGO LA LIQUIDACION DEL DIA ANTERIOR
  const yesterDayLiquidation = await Liquidation.findOne({
    where: { storeId, date: yesterday }
  });
  let initial_balance = 0;
  if (yesterDayLiquidation) {
    console.log("Hay una liquidacion del dia anterior")
    message = `SUCCESS: Habia una liquidación del día anterior: ${yesterDayLiquidation.date}`
    initial_balance = yesterDayLiquidation.finalBalance;
    console.log("Hay una liquidacion del dia anterior con initial_balance:", initial_balance)
  } else {
    message = `SUCCESS: se reliquida el día: ${dateLiquidation}`
    console.log("no Hay una liquidacion del dia anterior, de seguro es una del dia actual")
  }

  // === PRIMERA CONSULTA: SUMAS GENERALES ===
  const results = await Movement.findAll({
    attributes: [
      "storeId",
      "type",
      [fn("SUM", col("quantity")), "totalQuantity"],
      [fn("SUM", col("bags")), "totalBags"],
      [fn("SUM", col("balance")), "totalBalance"]
    ],
    where: {
      storeId,
      date: {
        [Op.eq]: dateLiquidation
      }
    },
    group: ["storeId", "type"],
    raw: true
  });

  let input = 0;
  let output = 0;
  let dispatch = 0;
  let positive = 0;
  let negative = 0;
  let bags = 0;

  results.forEach(r => {
    bags += parseInt(r.totalBags);
    switch (r.type) {
      case 2:
        input = parseInt(r.totalQuantity);
        break;
      case 3:
        output = parseInt(r.totalQuantity);
        break;
      case 4:
        dispatch = parseInt(r.totalQuantity);
        break;
      case 5:
        positive = parseInt(r.totalQuantity);
        break;
      case 6:
        negative = parseInt(r.totalQuantity);
        break;
    }
  });

  const final_balance = initial_balance + input - dispatch - output + positive - negative;

  // === SEGUNDA CONSULTA: DESPACHOS POR DÍAS ===
  const dispatchByDays = await Movement.findAll({
    attributes: [
      "days",
      [fn("SUM", col("quantity")), "totalQuantity"]
    ],
    where: {
      storeId,
      type: 4,
      date: {
        [Op.eq]: dateLiquidation
      }
    },
    group: ["days"],
    raw: true
  });

  // Inicializar variables por días
  let dispatch_80 = 0;
  let dispatch_100 = 0;
  let dispatch_120 = 0;
  let dispatch_150 = 0;

  dispatchByDays.forEach(r => {
    switch (r.days) {
      case 80:
        dispatch_80 = parseInt(r.totalQuantity);
        break;
      case 100:
        dispatch_100 = parseInt(r.totalQuantity);
        break;
      case 120:
        dispatch_120 = parseInt(r.totalQuantity);
        break;
      case 150:
        dispatch_150 = parseInt(r.totalQuantity);
        break;
    }
  });

  // === RESPUESTA FINAL ===
  const data = {
    input,
    output,
    dispatch,
    positive,
    negative,
    bags,
    initialBalance: initial_balance,
    finalBalance: final_balance,
    dispatch_80,
    dispatch_100,
    dispatch_120,
    dispatch_150,
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


export default getDataLiquidation