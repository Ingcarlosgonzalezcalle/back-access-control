


import { Op } from "sequelize";
import MovementDetail from '../../../models/movementDetail.js'
import Movement from '../../../models/movement.js'
import Store from '../../../models/store.js'
import Activity from '../../../models/operationType.js'
import Product from '../../../models/product.js'
import OperationType from '../../../models/operationType.js'


const getReportMovementDetails = async (body) => {
  const { startDate, endDate, machine } = body

  console.log(body)
  const { page = 1, limit = 10 } = body;
  const offset = (page - 1) * limit;

  const match = { date: { [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"] } }
  if (machine == 0 || machine == null || machine == undefined) {
    //match =  {date: { [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"] }}
  }
  else
    match.machineId = machine


  try {
    const report = await MovementDetail.findAndCountAll({
      where: match,
      attributes: ['description', 'machineName', 'time', 'machineId'],
      include: [
        {
          model: Movement,
          attributes: ['date', 'quantity', 'description',  'ticket'],
          where: {
            date: { [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"] }
          },
          include: [
            {
              model: Store,
              as: 'store',
              attributes: ['name']
            },
            {
              model: Product,
              attributes: ['name']
            },
            {
              model: OperationType,
              attributes: ['name']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    const list = report.rows



    let totalTime = await MovementDetail.sum('time', {
      where: match,
    });



    /*const totalTime = list.reduce((acc, item) => {
      return acc + (item.time || 0); // asegúrate de manejar nulos
    }, 0);*/

    const totalMinutes = totalTime; // por ejemplo 150
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // 👉 formato "2:30 horas"
    const formatted = `${hours}:${minutes.toString().padStart(2, '0')} horas`;

    console.log(formatted); // "2:30 horas"



    const totalPages = Math.ceil(report.count / limit)

    return { success: true, message: "success", status: 200, data: list, total: report.count, page: page, totalPages, error: "kokoo", hours: formatted };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};









export default getReportMovementDetails 