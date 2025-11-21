import { Op, fn, col, literal } from "sequelize";
import Liquidation from '../../models/liquidations.js'
import Store from '../../models/store.js'
import Product from '../../models/product.js'

const getMonthlyReport = async (query) => {



  const fecha = query.startDate
  const filter = query.filter
  const productId = query.productId
  let havingCondition = null;
  if (filter=='true') { // showAll es tu parámetro (por ejemplo req.query.showAll)
    havingCondition = literal(`
    SUM(input) <> 0 OR
    SUM(output) <> 0 OR
    SUM(consumption) <> 0 OR
    SUM(positive) <> 0 OR
    SUM(negative) <> 0 OR
    SUM(dispatch) <> 0 OR
    SUM(generation) <> 0 OR
    SUM(bags) <> 0
  `);
  }


  const [year, month] = fecha.split("-");
  console.log(year);  // "2025"
  console.log(month); // "10"

  // armar rango del mes
  const startOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
  const endOfMonth = new Date(year, month, 0); // último día del mes
  const endOfMonthStr = endOfMonth.toISOString().split("T")[0];


  const match = {date: { [Op.between]: [startOfMonth, endOfMonthStr] }}
  if (productId != 0 ) {
   match.productId = productId
  }
    



  const monthly = await Liquidation.findAll({
    include: [
      { model: Store, as: 'store', attributes: ['name'] },
      { model: Product, as: 'product', attributes: ['name'] }
    ],
    attributes: [
      'storeId',
      'productId',
      // initialBalance: valor del registro con la fecha mínima en el periodo
      [literal(`
      (
        SELECT l2.initialBalance
        FROM liquidations l2
        WHERE l2.storeId = liquidations.storeId
          AND l2.productId = liquidations.productId
          AND l2.date = (
            SELECT MIN(l3.date)
            FROM liquidations l3
            WHERE l3.storeId = liquidations.storeId
              AND l3.productId = liquidations.productId
              AND l3.date BETWEEN '${startOfMonth}' AND '${endOfMonthStr}'
          )
        LIMIT 1
      )
    `), 'initialBalance'],
      [fn('SUM', col('input')), 'input'],
      [fn('SUM', col('output')), 'output'],
      [fn('SUM', col('consumption')), 'consumption'],
      [fn('SUM', col('positive')), 'positive'],
      [fn('SUM', col('negative')), 'negative'],
      [fn('SUM', col('bags')), 'bags'],
      [fn('SUM', col('dispatch')), 'dispatch'],
      [fn('SUM', col('generation')), 'generation'],
      // finalBalance: valor del registro con la fecha máxima en el periodo
      [literal(`
      (
        SELECT l4.finalBalance
        FROM liquidations l4
        WHERE l4.storeId = liquidations.storeId
          AND l4.productId = liquidations.productId
          AND l4.date = (
            SELECT MAX(l5.date)
            FROM liquidations l5
            WHERE l5.storeId = liquidations.storeId
              AND l5.productId = liquidations.productId
              AND l5.date BETWEEN '${startOfMonth}' AND '${endOfMonthStr}'
          )
        LIMIT 1
      )
    `), 'finalBalance']
    ],
    where: match,
    group: ['storeId', 'productId'],
    ...(havingCondition ? { having: havingCondition } : {}),
    raw: true
  });

  console.log("match:::",match)
  return monthly;
};



export default getMonthlyReport;