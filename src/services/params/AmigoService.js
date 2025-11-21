

import Departamento from '../../models/departamento.js'
import Municipio from '../../models/municipio.js'
import Amigo from '../../models/amigo.js'
import Barrio from '../../models/barrio.js'
import { Op } from "sequelize";
import { sequelize } from '../../config/db.js';






const get = async (idFind) => {
  try {
    const model = await Amigo.findOne(
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
    const result = await Amigo.findAndCountAll({
      include: [
        { model: Departamento, as: 'tabla_departamento', attributes: ['nombre'] },
        { model: Municipio, as: 'tabla_municipio', attributes: ['nombre'] },
        { model: Barrio, as: 'tabla_barrio', attributes: ['nombre'] }
      ],
      attributes: ['id', 'nombre', 'departamento', 'cedula', 'celular', 'compromiso'], // Campos específicos
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
  const model = {...body}

  const findModel = await Amigo.findOne({ where: { cedula: model.cedula } });
  if (findModel != null) {
    return { success: false, message: 'Cedula ya existe', status: 202 };
  }

  try {
    var res = await Amigo.create(model)
    return { success: true, message: 'Realizado', status: 200 };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}


const update = async (body) => {
  try {
    
     const amigo = {...body}
    const model = await Amigo.findOne({ where: { id: amigo.id } });
    if (model == null) {
      return { message: 'Amigo no existe: ' + idFind, status: 400 };
    }
    else {
      await Amigo.update(amigo, { where: { id: amigo.id } })
      return { success: true, message: 'Amigo actualizada', status: 200 };
    }
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}

const getListAll = async (body) => {
  try {
    const result = await Amigo.findAll({
      include: [
        { model: Departamento, as: 'tabla_departamento', attributes: ['nombre'] },
        { model: Municipio, as: 'tabla_municipio', attributes: ['nombre'] }
      ],
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