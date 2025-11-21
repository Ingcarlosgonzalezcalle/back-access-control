


import Liquidation from '../../models/liquidations.js'
import Movement from '../../models/movement.js'
import { Op, fn, col } from "sequelize";





const getLastLiquidationDate = async () => {
  
  const lastLiquidation = await Liquidation.findOne({
    order: [['date', 'DESC']]
  });
  console.log("lastLiquidation:::", lastLiquidation)

  if (lastLiquidation) {
    const date = lastLiquidation.date
    return { success: true, status: 200, date };
  }
  else {
    const date = null
    return { success: true, status: 200, date };
  }
};



export default getLastLiquidationDate