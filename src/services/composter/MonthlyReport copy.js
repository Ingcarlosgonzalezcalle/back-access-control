


import { Op } from "sequelize";

import Liquidation from '../../models/liquidations.js'
import Store from '../../models/store.js'


const getMonthlyReport = async (body) => {
  const { startDate, endDate } = body



  try {
    const report = await Liquidation.findAll({
      where: { date: { [Op.between]: ["2025-09-01 00:00:00", "2025-09-30 23:59:59"] } },
      include: [
        {
          model: Store,
          as: 'store',   // relación principal
          attributes: ['name']
        }
      ],
      attributes: ['id', 'input', 'output'],
      order: [['id', 'ASC']]
    });

    return { success: true, message: "success", status: 200, data: report, total: 10, page: 1, totalPages:1, error: "kokoo" };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};


export default getMonthlyReport