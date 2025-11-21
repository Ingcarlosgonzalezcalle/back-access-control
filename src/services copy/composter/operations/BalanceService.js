

import Balance from '../../../models/balance.js'


const get = async (body) => {
  const { storeId, productId } = body;
  try {
    const model = await Balance.findOne(
      { where: { storeId, productId } },
      { attributes: { exclude: ['createdAt', 'updatedAt'] } }
    );

    if (model) {
      return { message: "success: existe un saldo para el producto en la bodega", status: 200, balance: model.balance, error: null };
    }
    else {
      return { message: "success: no existe el saldo ", status: 200, balance: 0, error: null };
    }
  } catch (err) {
    return { message: "error", status: 500, error: err, data: null };
  }
}


const getList = async (body) => {
  try {
    const { page = 1, limit = 10 } = body;
    console.log(page)
    console.log(limit)
    const offset = (page - 1) * limit;
    const result = await Balance.findAndCountAll({
      attributes: ['id', 'storeId', 'productId'], // Campos específicos
      order: [['id', 'ASC']], // Ordenar por nombre
      limit: parseInt(limit), // Límite de registros por página
      offset: parseInt(offset), // Desplazamiento para la paginación
    });
    const list = result.rows
    const totalPages = Math.ceil(result.count / limit)
    return { success: true, message: "success", status: 200, data: list, total: result.count, page: page, totalPages, error: null };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};


const update = async (body) => {
  try {

    const { storeId, productId, balance } = body;
    const balanceModel = {
      storeId: body.storeId,
      productId: body.productId,
      balance: body.balance
    }
    const model = await Balance.findOne({ where: { storeId, productId } });
    if (model == null) {
      //el registro no existe voy a crearlo
      const result = await insert(body)
      console.log("se creo el balance???:", result)
      return { success: true, message: 'Saldo creado', status: 200 };
    }
    else {
      await Balance.update(balanceModel, { where: { storeId, productId } })
      return { success: true, message: 'Saldo actualizado', status: 200 };
    }
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}



const insert = async (body) => {
  const model = {
    storeId: body.storeId,
    productId: body.productId,
    balance: body.balance
  }
  try {
    var res = await Balance.create(model)
    return true;
  } catch (err) {
    return false;
  }
}



export default {
  get,
  getList,
  update
};