
import Client from '../../models/client.js'
import Module from '../../models/module.js'
import ModuleClient from '../../models/moduleClient.js'
import { v4 as uuidv4} from 'uuid';
import mysql from  'mysql2'

const getClient= async(idClient)=>{
  try{
    const client = await Client.findOne( 
      { 
        where : {id:idClient},
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }
      );
    return { client, status:200 };
  }catch(err){
    return { client:null, status:500 , error:err };
  }  

}




const getList= async()=>{ 
    try{
      const list = await Client.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }});
      return { list:list, status:200 };
    }catch(err){
      return { list:null, status:500 , error:err };
    }  
}


const insertClient= async(body)=>{
  var id = uuidv4()
  let clientId = id
  var client = {...body,id}
  let identification = client.identification
  try{

    let model = await Client.findOne( { where : {identification}});
    if(model==null){
      await Client.create(client)


      ///Agrego todos los modulos al cliente///
      const listModules = await Module.findAll();
      for (const module of listModules) {
        let moduleId = module.id
        
        console.log(`Inteta buscar el moduleclient del modulo ${moduleId} y del cliente: ${clientId}`)
        model = await ModuleClient.findOne({ where: { moduleId, clientId } });
        if (model == null) {          
          console.log(`Inteta crear el moduleclient del modulo ${moduleId} y del cliente: ${clientId}`)
          let state = false
          let idModuleClient = uuidv4()
          await ModuleClient.create({id:idModuleClient, clientId, moduleId, state})
        }
      }


      return { message: 'Cliente ingresado', status:200 };
    }
    else{
      return { message: 'Ya existe un cliente con identification: '+identification, status:400 };
    }
    
  }catch(err){
    return { message: 'Error en el servidor', status:500 , error:err };
  }  
}


const updateClient= async(idFind,client)=>{
  try{  

    const model = await Client.findOne( { where : {id:idFind}});
    if(model==null){
      return { message: 'No existe un cliente con id: '+idFind, status:400 };
    }
    else{
      await Client.update(client,{ where: { id: idFind } }     )
      return { message: 'Cliente actualizado', status:200 };
    }  
  }catch(err){
    return { message: 'Error en el servidor al realizar el update', status:500, error:err };
  }  
}



const enableClient= async(idFind)=>{
  try{  
    const model = await Client.findOne( { where : {id:idFind}});
    if(model==null){
      return { message: 'No existe un cliente con id: '+idFind, status:400 };
    }
    else{
      await Client.update({state:true},{ where: { id: idFind } }     )
      return { message: 'Cliente activado', status:200 };
    }  
  }catch(err){
    return { message: 'Error en el servidor al realizar el cambio de estado', status:500, error:err };
  }  
}


const disableClient= async(idFind)=>{
  try{  
    const model = await Client.findOne( { where : {id:idFind}});
    if(model==null){
      return { message: 'No existe un cliente con id: '+idFind, status:400 };
    }
    else{
      await Client.update({state:false},{ where: { id: idFind } }     )
      return { message: 'Cliente desactivado', status:200 };
    }  
  }catch(err){
    return { message: 'Error en el servidor al realizar el cambio de estado', status:500, error:err };
  }  
}



export default {
    getClient,
    getList,
    insertClient,
    updateClient,
    enableClient,
    disableClient
};