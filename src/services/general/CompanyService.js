
import Company from '../../models/company.js'
import { v4 as uuidv4} from 'uuid';
import mysql from  'mysql2'



const get= async(idFind)=>{
  const model = await Company.findOne( { where : {id:idFind}});
  return model
}

const getList= async()=>{ 
  try{
    console.log("lisatado de compañias")
    const list = await Company.findAll();
    return { list:list, status:200 };
  }catch(err){
    return { list:null, status:500 , error:err };
  }  
}

const getListByClient= async(clientId)=>{ 
  try{
    const list = await Company.findAll({ 
      where : {clientId},
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    return { list:list, status:200 };
  }catch(err){
    return { list:null, status:500 , error:err };
  }  
}


const insert= async(body)=>{
  var id = uuidv4()
  var model = {...body,id}
  try{
    var res = await Company.create(model)
    return { message: 'Company ingresado', status:200 };
  }catch(err){
    return { message: 'Error en el servidor', status:500 , error:err };
  }  
}



export default {
    get,
    getList,
    getListByClient,
    insert
};