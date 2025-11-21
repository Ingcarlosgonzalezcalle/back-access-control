

import Barrio from '../../models/barrio.js'
import { Op } from "sequelize";
import { sequelize } from '../../config/db.js';






const get = async (idFind) => {
  try {
    const model = await Barrio.findOne(
      { where: { id: idFind } }
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
    const result = await Barrio.findAndCountAll({
      attributes: ['id', 'nombre', 'departamento', 'latitud', 'longitud'], // Campos específicos
      order: [['nombre', 'ASC']],
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
    departamento: body.departamento,
    municipio: body.municipio,
    latitud: body.latitud,
    longitud: body.longitud,
    longitud: body.inicial
  }

  const findModel = await Barrio.findOne({ where: { nombre: model.nombre } });
  if (findModel != null) {
    return { success: false, message: 'Nombre ya existe', status: 202 };
  }

  try {
    var res = await Barrio.create(model)
    return { success: true, message: 'Realizado', status: 200 };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}


const update = async (body) => {
  try {
    const barrio = {
      id: body.id,
      nombre: body.nombre,
      departamento: body.departamento,
      municipio: body.municipio,
      latitud: body.latitud,
      longitud: body.longitud
    }
    const model = await Barrio.findOne({ where: { id: barrio.id } });
    if (model == null) {
      return { message: 'Barrio no existe: ' + idFind, status: 400 };
    }
    else {
      await Barrio.update(barrio, { where: { id: barrio.id } })
      return { success: true, message: 'Barrio actualizada', status: 200 };
    }
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}

const getListAll = async (body) => {
  try {
    const result = await Barrio.findAll({
      attributes: ['id', 'nombre', 'departamento', 'municipio'], // Campos específicos
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