


import { Op ,fn, col} from "sequelize";
import Liquidation from '../../models/liquidations.js'
import Product from '../../models/product.js'





const getLiquidationList = async (body) => {
  try {
    const { page = 1, limit = 10 } = body;
    const offset = (page - 1) * limit;

    const rows = await Liquidation.findAll({
      attributes: [
        "date",
        [fn("MIN", col("id")), "id"], 
        [fn("COUNT", col("id")), "count"], 
      ],
      group: ["date"],
      order: [["date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      raw: true,
    });

    const totalDates = await Liquidation.count({
      distinct: true,
      col: "date",
    });

    const totalPages = Math.ceil(totalDates / limit);

    return {
      success: true,
      message: "success",
      status: 200,
      data: rows,
      total: totalDates,
      page,
      totalPages,
      error: null,
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      success: false,
      message: "error",
      status: 500,
      error: err,
      data: null,
    };
  }
};


export default getLiquidationList