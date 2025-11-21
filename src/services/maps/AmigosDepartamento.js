import { Sequelize, Op, literal } from "sequelize";

import Departamento from '../../models/departamento.js'
import Municipio from '../../models/municipio.js'
import Amigo from '../../models/amigo.js'


const getMap = async (body) => {
  try {
    const { page = 1, limit = 10 ,tipo=0,genero=0,gremio=0,candidato=0,findName=""} = body;


    const match = {}


    const  havingCondition = literal(` total_amigos <> 0  `);

console.log("paso 1")

    const result =  await Departamento.findAll({
  attributes: [
    'id',
    'nombre',
    'latitud',
    'longitud',
    [Sequelize.fn('COUNT', Sequelize.col('amigos.id')), 'total_amigos']
  ],
  include: [
    {
      model: Amigo,
      attributes: [],
    }
  ],
  where: {
    latitud: {
      [Op.notIn]: ['0', '']
    }
  },
  ...(havingCondition ? { having: havingCondition } : {}),
  group: ['departamentos.id'],
  order: [['orden', 'DESC']]
});



console.log("paso 2")



    return { success: true, message: "success", status: 200, data: result,  error: null };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
};




export default getMap;