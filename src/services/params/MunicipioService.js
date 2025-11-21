

import Municipio from '../../models/municipio.js'
import { Op } from "sequelize";
import { sequelize } from '../../config/db.js';






const get = async (idFind) => {
  try {
    const model = await Municipio.findOne(
      { where: { id: idFind } }
    );
    return { message: "success", status: 200, data: model, error: null };
  } catch (err) {
    return { message: "error", status: 500, error: err, data: null };
  }
}


const getList = async (body) => {
  try {
    const { page = 1, limit = 10, name="" } = body;
    console.log(page)
    console.log(limit)
    console.log(name)
    const offset = (page - 1) * limit;

    
    //
    //const match = { date: { [Op.between]: [startOfMonth, endOfMonthStr] } }

    const result = await Municipio.findAndCountAll({
      attributes: ['id', 'nombre', 'departamento', 'latitud', 'longitud'], // Campos específicos
      order: [['nombre', 'ASC']],
      where:{nombre:{[Op.like]:`%${name}%`}},
      limit: parseInt(limit),
      offset: parseInt(offset),
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
    nombre: body.nombre,
    codigo: body.codigo,
    departamento: body.departamento,
    latitud: body.latitud,
    longitud: body.longitud
  }

  const findModel = await Municipio.findOne({ where: { nombre: model.nombre } });
  if (findModel != null) {
    return { success: false, message: 'Nombre ya existe', status: 202 };
  }

  try {
    var res = await Municipio.create(model)
    return { success: true, message: 'Realizado', status: 200 };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}


const update = async (body) => {
  try {
    const municipio = {
      id: body.id,
      nombre: body.nombre,
      codigo: body.codigo,
      departamento: body.departamento,
      latitud: body.latitud,
      longitud: body.longitud
    }
    const model = await Municipio.findOne({ where: { id: municipio.id } });
    if (model == null) {
      return { message: 'Municipio no existe: ' + idFind, status: 400 };
    }
    else {
      await Municipio.update(municipio, { where: { id: municipio.id } })
      return { success: true, message: 'Municipio actualizada', status: 200 };
    }
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}

const getListAll = async (body) => {
  try {
    const result = await Municipio.findAll({
      attributes: ['id', 'nombre', 'departamento'], // Campos específicos
      order: [['nombre', 'ASC']]
    });
    const list = result
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
  getListAll
};