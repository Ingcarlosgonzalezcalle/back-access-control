


import Store from '../../models/store.js'
import Liquidation from '../../models/liquidations.js'
import Movement from '../../models/movement.js'
import MovementDetail from '../../models/movementDetail.js'
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2'
import { Op, fn, col } from "sequelize";

const deleteLiquidation = async (body) => {
  let message = "";
  const dateLiquidation = body.date
  await Liquidation.destroy({
      where: {
        date: { [Op.gte]: dateLiquidation }
      }
    });
  return { success: true, message, status: 200 };
};

export default deleteLiquidation