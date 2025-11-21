

import Departamento from '../../models/departamento.js'
import { Op } from "sequelize";
import { sequelize } from '../../config/db.js';






const get = async (idFind) => {
  try {
    const model = await Departamento.findOne(
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
    const offset = (page - 1) * limit;
    const result = await Departamento.findAndCountAll({
      attributes: ['id', 'nombre', 'latitud', 'longitud'], // Campos específicos
      where:{nombre:{[Op.like]:`%${name}%`}},
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
    latitud: body.latitud,
    longitud: body.longitud
  }

  const findModel = await Departamento.findOne({ where: { nombre: model.nombre } });
  if (findModel != null) {
    return { success: false, message: 'Nombre ya existe', status: 202 };
  }

  try {
    var res = await Departamento.create(model)
    return { success: true, message: 'Realizado', status: 200 };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}


const update = async (body) => {
  try {
    const departamento = {
      id: body.id,
      nombre: body.nombre,
      latitud: body.latitud,
      longitud: body.longitud
    }
    const model = await Departamento.findOne({ where: { id: departamento.id } });
    if (model == null) {
      return { message: 'Departamento no existe: ' + idFind, status: 400 };
    }
    else {
      await Departamento.update(departamento, { where: { id: departamento.id } })
      return { success: true, message: 'Departamento actualizada', status: 200 };
    }
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}


const getListAll = async (body) => {
  try {
    const result = await Departamento.findAll({
      attributes: ['id', 'nombre'], // Campos específicos
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