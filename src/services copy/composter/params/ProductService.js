

import Product from '../../../models/product.js'
import { sequelize } from '../../../config/db.js';


//{ where: { id: clientId } }

const getAllList = async () => {
  try {    
    console.log("Product service: getAllList")
    const list = await Product.findAll(
      { 
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }
    );
    return {success:true, message: "success", status: 200, data: list, error: null };
  } catch (err) {
    console.error("Error:", err);
    return {success:false, message: "error", status: 500, error: err, data: null };
  }
};



const get = async (idFind) => {
  try {
    const model = await Product.findOne(
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
    const result = await Product.findAndCountAll({
      attributes: ['id', 'name', 'state', 'description', 'type'], // Campos específicos
      order: [['id', 'ASC']], // Ordenar por nombre
      limit: parseInt(limit), // Límite de registros por página
      offset: parseInt(offset), // Desplazamiento para la paginación
    });
    const list = result.rows
    const totalPages = Math.ceil(result.count / limit)
    return {success:true, message: "success", status: 200, data: list, total: result.count, page: page, totalPages, error: null };
  } catch (err) {
    console.error("Error:", err);
    return {success:false, message: "error", status: 500, error: err, data: null };
  }
};

const insert = async (body) => {
  const model = {
    name:body.name,
    state:body.state,
    type:body.type,
    description: body.description
  }

  const findModel = await Product.findOne( { where : {name:model.name}});
  if(findModel!=null){
    return { success:false,message: 'Nombre ya existe', status:202};
  }
  
  try {
    var res = await Product.create(model)
    syncBalances()
    return {success:true, message: 'Realizado', status: 200};
  } catch (err) {
    return {success:false, message: "error", status: 500, error: err, data: null };
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
    const product = {
      id:body.id,
      name:body.name,
      state:body.state,
      type:body.type,
      description: body.description
    }    
    const model = await Product.findOne( { where : {id:product.id}});
    if(model==null){
      return { message: 'Bodega no existe: '+idFind, status:400 };
    }
    else{
      await Product.update(product,{ where: { id: product.id } }     )
      return {success:true, message: 'Bodega actualizada', status:200 };
    } 
  } catch (err) {
    return {success:false, message: "error", status: 500, error: err, data: null };
  }
}

export default {
  get,
  getList,
  insert,
  update,
  getAllList
};