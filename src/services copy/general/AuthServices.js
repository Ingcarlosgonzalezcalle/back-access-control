
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js'
import Client from '../../models/client.js'
import { v4 as uuidv4} from 'uuid';
import dotenv from 'dotenv'

const login= async(body)=>{
  const JWT_SECRET = process.env.JWT_SECRET
  try { 
    const identification = body.identification;   
    const username = body.username;   
    const password = body.password;   
    const client = await Client.findOne({ where: { identification } });

    const user = await User.findOne({ where: { username,clientId:client.id } });
    if (!user) {
      return { message: 'Usuario no encontrado', status:404 };
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { message: 'Contraseña incorrecta', status:401 };
    }
    const token = jwt.sign(
        {
          id:user.id,      
          user:user.username,          
          clientId:user.clientId,          
          type:client.type,          
          name:client.name,          
          company:user.lastCompany
        },
        JWT_SECRET,
        {
            expiresIn:"2h"
        });

        if(user.lastCompany==null) 
          user.lastCompany = 1

    return { token, status:200, company:user.lastCompany };
  } catch (error) {
    return { message: 'Error en el servidor', status:500 };
  }
}


const insertUser= async(body)=>{
  var id = uuidv4()
  const passwordHash = await bcrypt.hash(body.password,7)
  const identification = body.identification
  try{
    const client = await Client.findOne({ where: { identification } });
    if(client==null){
      return { message: 'El nit no existe', status:500 };
    }
    const clientId = client.id
    body.password= passwordHash
    var usuario = {...body,id,clientId}
    var res = await User.create(usuario)
    return { message: 'Usuario creado', status:200 };
  }catch(err){
    return { message: 'Error en el servidor'+err, status:500 };
  }  
}



export default {
    insertUser,
    login
};