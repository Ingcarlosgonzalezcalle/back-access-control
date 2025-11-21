

import Module from '../../models/module.js'
import { v4 as uuidv4} from 'uuid';
import mysql from  'mysql2'



const get= async(idFind)=>{
  const model = await Module.findOne( 
    { where : {id:idFind}},
    { attributes: { exclude: ['createdAt', 'updatedAt'] }}
);
  return model
}

const getList= async()=>{ 
  try{
    const list = await Module.findAll(
      { 
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [
          [Module, 'description', 'ASC'] 
        ]
      }
    );
    return { list:list, status:200 };
  }catch(err){
    return { list:null, status:500 , error:err };
  }  
}


const insert= async(body)=>{
  try{
    var res = await Module.create(body)
    return { message: 'Modulo ingresado', status:200 };
  }catch(err){
    return { message: 'Error en el servidor', status:500 , error:err };
  }  
}



export default {
    get,
    getList,
    insert
};