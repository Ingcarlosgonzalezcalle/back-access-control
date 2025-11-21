

import ModuleClient from '../../models/moduleClient.js'
import Client from '../../models/client.js'
import Module from '../../models/module.js'
import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2'



const get = async (idFind) => {
  const model = await ModuleClient.findOne({ where: { id: idFind } });
  return model
}

const getModulesByClient = async (id) => {

  ModuleClient.belongsTo(Module, { foreignKey: 'moduleId' })
  Module.hasMany(ModuleClient, { foreignKey: 'moduleId' })


  const model = await ModuleClient.findAll({
    where: { clientId: id },
    include: [
      {
        model: Module,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        required: true
      }
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    order: [
      [Module, 'description', 'ASC'] 
    ]

  });
  return model
}




const getModulesActiveByClient = async (id) => {

  ModuleClient.belongsTo(Module, { foreignKey: 'moduleId' })
  Module.hasMany(ModuleClient, { foreignKey: 'moduleId' })


  try {

    const model = await ModuleClient.findAll({
      where: {
        clientId: id, state: true
      },
      include: [
        {
          model: Module,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          required: true
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [
        [Module, 'description', 'ASC'] 
      ]

    });
    return model

  }
  catch (Error) {
    return { list: null, status: 500, error: err };
  }

}




const getList2 = async () => {
  try {
    const list = await ModuleClient.findAll();
    return { list: list, status: 200 };
  } catch (err) {
    return { list: null, status: 500, error: err };
  }
}


const getList = async () => {

  ModuleClient.belongsTo(Client, { foreignKey: 'clientId' })
  Client.hasMany(ModuleClient, { foreignKey: 'clientId' })

  ModuleClient.belongsTo(Module, { foreignKey: 'moduleId' })
  Module.hasMany(ModuleClient, { foreignKey: 'moduleId' })


  try {
    const list = await Client.findAll({
      include: [
        {
          model: ModuleClient,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          required: true,
          include: [
            {
              model: Module,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            }
          ]
        }
      ],
      attributes: ['id', 'name']
    });

    return { list: list, status: 200 };
  } catch (err) {
    console.log(err)
    return { list: null, status: 500, error: err };
  }
}



const insert = async (body) => {
  try {
    await ModuleClient.update(
      { state: true },
      {
        where: {
          moduleId: body.moduleId,
          clientId: body.clientId
        }
      }
    )
    return { message: 'Modulo activado', status: 200 };
  } catch (err) {
    return { message: 'Error en el servidor', status: 500, error: err };
  }
}


const deleteReg = async (body) => {
  try {
    await ModuleClient.update(
      { state: false },
      {
        where: {
          moduleId: body.moduleId,
          clientId: body.clientId
        }
      }
    )
    return { message: 'Modulo desasignado', status: 200 };
  } catch (err) {
    return { message: 'Error en el servidor', status: 500, error: err };
  }
}



export default {
  get,
  getModulesByClient,
  getModulesActiveByClient,
  getList,
  insert,
  deleteReg
};