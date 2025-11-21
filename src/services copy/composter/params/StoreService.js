

import Store from '../../../models/store.js'
import { Op } from "sequelize";
import { sequelize } from '../../../config/db.js';






const get = async (idFind) => {
  try {
    const model = await Store.findOne(
      { where: { id: idFind } },
      { attributes: { exclude: ['createdAt', 'updatedAt'] } }
    );
    return { message: "success", status: 200, data: model, error: null };
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
    const result = await Store.findAndCountAll({
      attributes: ['id', 'name', 'status', 'description','type'], // Campos específicos
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

const insert = async (body) => {
  const model = {
    name: body.name,
    status: body.status,
    description: body.description,
    type: body.type
  }

  const findModel = await Store.findOne({ where: { name: model.name } });
  if (findModel != null) {
    return { success: false, message: 'Nombre ya existe', status: 202 };
  }

  try {
    var res = await Store.create(model)
    syncBalances()
    return { success: true, message: 'Realizado', status: 200 };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}



const syncBalances = async ()=>{
  await sequelize.query(`
    INSERT INTO balances (storeId, productId, balance, createdAt, updatedAt)
    SELECT 
      s.id AS storeId,
      p.id AS productId,
      0 AS balance,
      NOW() AS createdAt,
      NOW() AS updatedAt
    FROM stores s
    CROSS JOIN products p
    LEFT JOIN balances b
      ON b.storeId = s.id AND b.productId = p.id
    WHERE b.id IS NULL;
  `, { type: sequelize.QueryTypes.INSERT });
}

const update = async (body) => {
  try {
    const store = {
      id: body.id,
      name: body.name,
      status: body.status,
      description: body.description,
      type: body.type
    }
    const model = await Store.findOne({ where: { id: store.id } });
    if (model == null) {
      return { message: 'Bodega no existe: ' + idFind, status: 400 };
    }
    else {
      await Store.update(store, { where: { id: store.id } })
      return { success: true, message: 'Bodega actualizada', status: 200 };
    }
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}



const getProductiveStores = async (body) => {
  try {
    const list = await Store.findAll({
      where: { status: true, type:1 },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['id', 'ASC']],
    });
    return { success: true, message: "success", status: 200, data: list, error: null };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};



const getStoreWithInventory = async (body) => {
  try {   
    //debe venir de mi tabla de saldos 
    const match = { balance: { [Op.gt]: 0 }}
    const list = await Store.findAll({
      where: match,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['name', 'ASC']],
    });
    return { success: true, message: "success", status: 200, data: list, error: null };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};



const getAllList = async (body) => {
  try {     
    //debe venir de mi tabla de saldos
    const match = { balance: { [Op.gt]: 0 }}
    const list = await Store.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['id', 'ASC']],
    });
    return { success: true, message: "success", status: 200, data: list, error: null };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};



const getTransferList = async (body) => {
  try {    
    //debe venir de mi tabla de saldos
    console.log("get transfer list 1")
    const match = { balance: { [Op.gt]: 0 }}
    const list = await Store.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where : {type: { [Op.lte]: 2 } },
      order: [['id', 'ASC']],
    });
    return { success: true, message: "success", status: 200, data: list, error: null };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};




const getActiveList = async (body) => {
  try {     
    //debe venir de mi tabla de saldos
    const list = await Store.findAll({
      where:{status:1},
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['id', 'ASC']],
    });
    return { success: true, message: "success", status: 200, data: list, error: null };
  } catch (err) {
    console.error("Error:", err);
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};





export default {
  get,
  getList,
  insert,
  update,
  getAllList,
  getProductiveStores,
  getStoreWithInventory,
  getTransferList,
  getActiveList
};