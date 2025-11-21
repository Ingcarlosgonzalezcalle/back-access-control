


import { Op } from "sequelize";
import Balance from '../../../models/balance.js'
import Store from '../../../models/store.js'
import Product from '../../../models/product.js'


const ReportProduct = async (body) => {
  const { type, product } = body

  console.log(body)
  const { page = 1, limit = 10 } = body;
  const offset = (page - 1) * limit;





  try {

    const match = { balance: { [Op.gt]: 0 } }
    //const match = {}
    if (product != 0 && product != null && product != undefined) {
      match.productId = { [Op.eq]: product }
    }

    const include = [
      {
        model: Store,
        attributes: ['id','name']
      },
      {
        model: Product,
        attributes: ['id','name', 'type'],
      }
    ];

    if (type != 0 && type != null && type != undefined) {
      include[1].where = { type: { [Op.eq]: type } };
    }

    const report = await Balance.findAndCountAll({
      where: match,
      include,
      attributes: ['balance'],
      order: [['id', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    let totalBalance = 0


    const reportTow = await Balance.findAll({
      where: match,
      include,
      attributes: ['balance']
    });

    //obtengo la sumatoria de los saldos
    reportTow.map(item => {
      console.log(item.balance)
      if(item.balance)
        totalBalance = totalBalance+item.balance
    }
    )

    if (totalBalance == null) totalBalance = 0

    const list = report.rows
    const totalPages = Math.ceil(report.count / limit)


    return { success: true, message: "success", status: 200, data: list, total: report.count, page: page, totalPages, error: "nok", totalBalance };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};









export default ReportProduct