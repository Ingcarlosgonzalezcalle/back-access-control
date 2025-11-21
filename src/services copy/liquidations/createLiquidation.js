import Store from '../../models/store.js';
import Liquidation from '../../models/liquidations.js';
import Movement from '../../models/movement.js';
import Product from '../../models/product.js';
import { Op, fn, col, where } from "sequelize";

const createLiquidation = async (body) => {
  const dateLiquidation = body.date;
  let message = "";

  // Validar existencia de movimientos
  const existBeforeMovement = await Movement.findOne({
    where: { date: { [Op.lte]: dateLiquidation } },
    order: [['date', 'DESC']]
  });

  if (!existBeforeMovement) {
    const firstMovement = await Movement.findOne({
      where: { date: { [Op.gt]: dateLiquidation } },
      order: [['date', 'ASC']]
    });
    return {
      success: false,
      message: firstMovement
        ? `El primer movimiento desde ${dateLiquidation} es de: ${firstMovement.date}`
        : `No existen movimientos a la fecha ${dateLiquidation}`,
      status: 201
    };
  }

  const yesterday = getPreviousDate(dateLiquidation);

  // 🔹 Verificar última liquidación
  const lastLiquidation = await Liquidation.findOne({
    where: { date: { [Op.lte]: dateLiquidation } },
    order: [['date', 'DESC']]
  });

  if (lastLiquidation && lastLiquidation.date !== yesterday && lastLiquidation.date !== dateLiquidation) {
    return {
      success: false,
      message: `ERROR: Última liquidación: ${lastLiquidation.date}`,
      status: 201
    };
  }

  // =======================
  //  Movimientos del día
  // =======================
  const movements = await Movement.findAll({
    attributes: [
      'storeId',
      'productId',
      'operationType',
      [fn('SUM', col('quantity')), 'totalQuantity'],
      [fn('SUM', col('bags')), 'totalBags']
    ],
    where: { date: { [Op.eq]: dateLiquidation } },
    group: ['storeId', 'productId', 'operationType'],
    raw: true
  });

  // =======================
  // Liquidaciones del día anterior
  // =======================
  const yesterdayLiquidations = await Liquidation.findAll({
    where: { date: yesterday },
    attributes: ['storeId', 'productId', 'finalBalance'],
    raw: true
  });

  const previousMap = new Map();
  yesterdayLiquidations.forEach(l => {
    previousMap.set(`${l.storeId}-${l.productId}`, l.finalBalance);
  });

  // =======================
  // Obtener todas las combinaciones posibles
  // =======================
  const stores = await Store.findAll({ attributes: ['id'], where:{type: { [Op.lte]: 2 }}, raw: true });
  const products = await Product.findAll({ attributes: ['id'], raw: true });

  const allCombos = [];
  for (const s of stores) {
    for (const p of products) {
      allCombos.push({ storeId: s.id, productId: p.id });
    }
  }

  // =======================
  //  Agrupar movimientos por bodega + producto
  // =======================
  const grouped = {};

  for (const m of movements) {
    const key = `${m.storeId}-${m.productId}`;
    if (!grouped[key]) {
      grouped[key] = {
        storeId: m.storeId,
        productId: m.productId,
        input: 0, output: 0, positive: 0, negative: 0,
        aeration: 0, consumption: 0, conformation: 0, bags: 0
      };
    }

    const qty = parseInt(m.totalQuantity || 0);
    grouped[key].bags += parseInt(m.totalBags || 0);

    switch (m.operationType) {
      case 1: grouped[key].input += qty; break;
      case 2: grouped[key].output += qty; break;
      case 3: grouped[key].positive += qty; break;
      case 4: grouped[key].negative += qty; break;
      case 6: grouped[key].aeration += qty; break;
      case 7: grouped[key].consumption += qty; break;
      case 8: grouped[key].conformation += qty; break;
    }
  }

  // =======================
  // 5️⃣ Generar liquidaciones completas (TODOS los productos)
  // =======================
  const newLiquidations = [];

  for (const combo of allCombos) {
    const key = `${combo.storeId}-${combo.productId}`;
    const mov = grouped[key] || {};
    const prev = previousMap.get(key) || 0;

    const input = mov.input || 0;
    const output = mov.output || 0;
    const positive = mov.positive || 0;
    const negative = mov.negative || 0;
    const consumption = mov.consumption || 0;
    const aeration = mov.aeration || 0;
    const conformation = mov.conformation || 0;
    const generation = aeration + conformation;
    const bags = mov.bags || 0;

    const final_balance =
      prev + input - output + positive - negative - consumption + generation;

    newLiquidations.push({
      storeId: combo.storeId,
      productId: combo.productId,
      date: dateLiquidation,
      input,
      output,
      positive,
      negative,
      consumption,
      aeration,
      conformation,
      generation,
      bags,
      initialBalance: prev,
      finalBalance: final_balance
    });
  }

  // =======================
  // 6️⃣ Guardar en bloque
  // =======================
  await Liquidation.bulkCreate(newLiquidations, {
    updateOnDuplicate: [
      'input', 'output', 'positive', 'negative', 'consumption',
      'aeration', 'conformation', 'generation', 'bags',
      'initialBalance', 'finalBalance', 'date'
    ]
  });

  message = `SUCCESS: Liquidación generada (${newLiquidations.length} registros, incluyendo sin movimiento)`;

  return { success: true, message, status: 200 };
};

// =======================
// FUNCION UTIL
// =======================
const getPreviousDate = (dateLiquidation) => {
  const [year, month, day] = dateLiquidation.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default createLiquidation;
