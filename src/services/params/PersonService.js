

import Person from '../../models/person.js'
import { Op } from "sequelize";
import { sequelize } from '../../config/db.js';






const get = async (idFind) => {
  try {
    const model = await Person.findOne(
      { where: { id: idFind } }
    );
    return { message: "success", status: 200, data: model, error: null };
  } catch (err) {
    return { message: "error", status: 500, error: err, data: null };
  }
}


const getList = async (body) => {
  try {
    const { page = 1, limit = 10, name = "" } = body;
    console.log(page)
    console.log(limit)
    const offset = (page - 1) * limit;
    const result = await Person.findAndCountAll({
      attributes: ['id', 'identification', 'name', 'type'], // Campos específicos
      where: { name: { [Op.like]: `%${name}%` } },
      order: [['name', 'ASC']],
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
    name: body.name,
    identification: body.identification,
    type: body.type,
    status: body.status
  }

  const findModel = await Person.findOne({ where: { name: model.name } });
  if (findModel != null) {
    return { success: false, message: 'Nombre ya existe', status: 202 };
  }

  try {
    var res = await Person.create(model)
    return { success: true, message: 'Realizado', status: 200 };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}


const update = async (body) => {
  try {
    const person = {
      id: body.id,
      name: body.name,
      identification: body.identification,
      type: body.type,
      status: body.status
    }
    const model = await Person.findOne({ where: { id: person.id } });
    if (model == null) {
      return { message: 'Person no existe: ' + idFind, status: 400 };
    }
    else {
      await Person.update(person, { where: { id: person.id } })
      return { success: true, message: 'Person actualizada', status: 200 };
    }
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}


const getListAll = async (body) => {
  try {
    const result = await Person.findAll({
      attributes: ['id', 'name'], // Campos específicos
      order: [['name', 'ASC']]
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