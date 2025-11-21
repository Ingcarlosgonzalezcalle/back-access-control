

import MovementType from '../../models/movementType.js'
import { v4 as uuidv4} from 'uuid';
import mysql from  'mysql2'



const get= async(idFind)=>{
  const model = await MovementType.findOne( 
    { where : {id:idFind}},
    { attributes: { exclude: ['createdAt', 'updatedAt'] }}
);
  return model
}

const getList= async()=>{ 
  try{
    const list = await MovementType.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }});
    return { list:list, status:200 };
  }catch(err){
    return { list:null, status:500 , error:err };
  }  
}


const insert= async(body)=>{
  try{
    var res = await MovementType.create(body)
    return { message: 'tipo de movimiento ingresado', status:200 };
  }catch(err){
    return { message: 'Error en el servidor', status:500 , error:err };
  }  
}



export default {
    get,
    getList,
    insert
};