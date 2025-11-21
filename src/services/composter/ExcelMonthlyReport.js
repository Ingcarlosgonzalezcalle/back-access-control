import { Op, fn, col, literal } from "sequelize";
import Liquidation from '../../models/liquidations.js'
import Store from '../../models/store.js'
import ExcelJS from 'exceljs';
import Product from '../../models/product.js'


const getExcelMonthlyReport = async (req, res) => {

  const fecha = req.query.startDate
  const filter = req.query.filter
  const productId = req.query.productId


  let havingCondition = null;
  if (filter == 'true') { // showAll es tu parámetro (por ejemplo req.query.showAll)
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

  const match = { date: { [Op.between]: [startOfMonth, endOfMonthStr] } }
  if (productId != 0) {
    match.productId = productId
  }
  console.log(match)

  try {
    // 1. Traer sumatorias de cada store
    const report = await Liquidation.findAll({
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

    console.log("bien 1")

    const workbook = new ExcelJS.Workbook();

    console.log("bien 2")
    const worksheet = workbook.addWorksheet('Movements');

    console.log("bien 3")
    worksheet.columns = [
      { header: 'Bodega', key: 'store.name', width: 15 },
      { header: 'Producto', key: 'product.name', width: 18 },
      { header: 'Saldo inicial', key: 'initialBalance', width: 12 },
      { header: 'Traslados entrada', key: 'input', width: 16 },
      { header: 'Traslado salida', key: 'output', width: 16 },
      { header: 'Despacho', key: 'dispatch', width: 10 },
      { header: 'Sacos', key: 'bags', width: 10 },
      { header: 'Ajuste -', key: 'negative', width: 10 },
      { header: 'Ajuste +', key: 'positive', width: 10 },
      { header: 'Consumo', key: 'consumption', width: 10 },
      { header: 'Generacion', key: 'generation', width: 10 },
      { header: 'Saldo final', key: 'finalBalance', width: 12 }
    ];


    console.log(111111)
    worksheet.addRows(report);

    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });


    console.log(22222)
    res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');



    console.log(3333)
    // Enviar el archivo al cliente usando stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al generar el Excellll:", error);
    res.status(500).send("Error al generar el archivo Excellll");
  }

};



export default getExcelMonthlyReport;