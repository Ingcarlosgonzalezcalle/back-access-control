
import Dashboard from '../../models/dashboard.js'
import { v4 as uuidv4} from 'uuid';
import mysql from  'mysql2'



const get= async(idFind)=>{
  const model = await Dashboard.findOne( { where : {id:idFind}});
  return model
}

const getList= async()=>{ 
  try{
    const list = await Dashboard.findAll();
    return { list:list, status:200 };
  }catch(err){
    return { list:null, status:500 , error:err };
  }  
}



const insert= async(body)=>{
  var id = uuidv4()
  var model = {...body,id}
  try{
    var res = await Dashboard.create(model)
    return { message: 'Dashboard ingresado', status:200 };
  }catch(err){
    return { message: 'Error en el servidor', status:500 , error:err };
  }  
}


const update= async(idFind,newName)=>{
  try{
    var res = await Dashboard.update(
      { name: newName},
      { where: { id: idFind } } 
    )
    return { message: 'Dashboard actualizado', status:200 };
  }catch(err){
    return { message: 'Error en el servidor', status:500, error:err };
  }  
}



export default {
    get,
    getList,
    insert,
    update
};