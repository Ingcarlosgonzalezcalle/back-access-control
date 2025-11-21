

import Machine from '../../../models/machine.js'

const get = async (idFind) => {
  try {
    const model = await Machine.findOne(
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
    const result = await Machine.findAndCountAll({
      attributes: ['id', 'name', 'state', 'description'], // Campos específicos
      order: [['name', 'ASC']], // Ordenar por nombre
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
    description: body.description
  }

  const findModel = await Machine.findOne( { where : {name:model.name}});
  if(findModel!=null){
    return { success:false,message: 'Nombre ya existe', status:202};
  }
  
  try {
    var res = await Machine.create(model)
    return {success:true, message: 'Realizado', status: 200};
  } catch (err) {
    return {success:false, message: "error", status: 500, error: err, data: null };
  }
}

const update = async (body) => {
  try {    
    const machine = {
      id:body.id,
      name:body.name,
      state:body.state,
      description: body.description
    }    
    const model = await Machine.findOne( { where : {id:machine.id}});
    if(model==null){
      return { message: 'Recurso no existe: '+idFind, status:400 };
    }
    else{
      await Machine.update(machine,{ where: { id: machine.id } }     )
      return {success:true, message: 'Recurso actualizada', status:200 };
    } 
  } catch (err) {
    return {success:false, message: "error", status: 500, error: err, data: null };
  }
}





const getActiveList = async (body) => {
  try {    
    console.log("Machine service: getActiveList")
    const list = await Machine.findAll({ 
      where: {state:true},
      attributes: { exclude: ['createdAt', 'updatedAt'] },      
      order: [['name', 'ASC']], // Ordenar por nombre
    });
    return {success:true, message: "success", status: 200, data: list, error: null };
  } catch (err) {
    console.error("Error:", err);
    return {success:false, message: "error", status: 500, error: err, data: null };
  }
};




export default {
  get,
  getList,
  insert,
  update,
  getActiveList
};