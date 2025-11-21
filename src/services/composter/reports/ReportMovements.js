


import { Op } from "sequelize";

import Movement from '../../../models/movement.js'
import Store from '../../../models/store.js'
import Activity from '../../../models/operationType.js'


const getReportMovements = async (body) => {
  const { startDate, endDate } = body

  console.log(body)
  const { page = 1, limit = 10 } = body;
  const offset = (page - 1) * limit;




  try {
    const report = await Movement.findAndCountAll({
      where: { date: { [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"] } },
      include: [
        {
          model: Activity,
          attributes: ['name']
        },
        {
          model: Store,
          as: 'store',   // relación principal
          attributes: ['name']
        }
      ],
      attributes: ['id', 'quantity', 'date', 'cycles', 'bags', 'presentation', 'productName'],
      order: [['createdAt', 'DESC']], // Ordenar por fecha de creación
      limit: parseInt(limit), // Límite de registros por página
      offset: parseInt(offset) // Para la paginación
    });

    const list = report.rows
    const totalPages = Math.ceil(report.count / limit)


    return { success: true, message: "success", status: 200, data: list, total: report.count, page: page, totalPages, error: "kokoo" };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};









export default getReportMovements