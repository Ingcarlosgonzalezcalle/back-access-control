

import MovementDetail from '../../models/movementDetail.js'
import { v4 as uuidv4} from 'uuid';
import mysql from  'mysql2'



const get= async(idFind)=>{
  const model = await MovementDetail.findOne( 
    { where : {id:idFind}},
    { attributes: { exclude: ['createdAt', 'updatedAt'] }}
);
  return model
}

const getList= async()=>{ 
  try{
    const list = await MovementDetail.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }});
    return { list:list, status:200 };
  }catch(err){
    return { list:null, status:500 , error:err };
  }  
}


const insert= async(body)=>{
  try{
    var res = await MovementDetail.create(body)
    return { message: 'detalle de movimiento ingresado', status:200 };
  }catch(err){
    return { message: 'Error en el servidor', status:500 , error:err };
  }  
}



export default {
    get,
    getList,
    insert
};