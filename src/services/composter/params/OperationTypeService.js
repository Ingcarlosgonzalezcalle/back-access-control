

import OperationType from '../../../models/operationType.js'

const get = async (idFind) => {
  try {
    const model = await OperationType.findOne(
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
    const result = await OperationType.findAndCountAll({
      attributes: ['id', 'name', 'status', 'description', 'type'], // Campos específicos
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
    type: body.type,
    description: body.description
  }

  const findModel = await OperationType.findOne({ where: { name: model.name } });
  if (findModel != null) {
    return { success: false, message: 'Nombre ya existe', status: 202 };
  }

  try {
    var res = await OperationType.create(model)
    return { success: true, message: 'Realizado', status: 200 };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}

const update = async (body) => {
  try {
    const activity = {
      id: body.id,
      name: body.name,
      status: body.status,
      type: body.type,
      description: body.description
    }
    const model = await OperationType.findOne({ where: { id: activity.id } });
    if (model == null) {
      return { message: 'actividad no existe: ' + idFind, status: 400 };
    }
    else {
      await OperationType.update(activity, { where: { id: activity.id } })
      return { success: true, message: 'actividad actualizada', status: 200 };
    }
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}





const getActiveList = async (body) => {
  try {
    console.log("operation type service: getActiveList")
    const list = await OperationType.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
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
  getActiveList
};