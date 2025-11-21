
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js'

const login= async(body)=>{
  const JWT_SECRET = process.env.JWT_SECRET
  try { 
    const username = body.username;   
    const password = body.password;   
    

    const user = await User.findOne({ where: { username} });
    if (!user) {
      return { message: 'Usuario no encontrado', status:404 , success:false};
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { message: 'Contraseña incorrecta', status:401 , success:false};
    }

    const role = user.role
    const userId = user.id
    const name = user.name

    const token = jwt.sign(
        {
          id:user.id,      
          username:user.username,          
          name:user.name,      
          role:user.role
        },
        JWT_SECRET,
        {
            expiresIn:"2h"
        });

       
    return { token, status:200 , success:true, role,userId,name,username};
  } catch (error) {
    return { message: 'Error en el servidor', status:500, success:false };
  }
}




const update = async (body) => {


  try {
     const model = {
    id: body.id,
    username: body.username,
    name: body.name,
    leader: body.leader,
    role: body.role,
    email: body.email,
    status: body.status
  }

  if(body.password){
    console.log("cambiara de contraseña")
    const passwordHash = await bcrypt.hash(body.password,7)
    model.password = passwordHash
  }
  else{
    console.log("el password permanece igual")
  }

      console.log("model:::",model)
    const user = await User.findOne({ where: { id: model.id } });
    console.log("user:::",user)
    if (user == null) {
      return { message: 'Usuario no existe: ' + idFind, status: 400 };
    }
    else {
      console.log("model:::",model)
      await User.update(model, { where: { id: model.id } })
      return { success: true, message: 'Usuario actualizado', status: 200 };
    }
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}



const insert = async (body) => {

  const passwordHash = await bcrypt.hash(body.password,7)

  const model = {
    username: body.username,
    name: body.name,
    password: passwordHash,
    leader: body.leader,
    role: body.role,
    email: body.email,
    status: body.status
  }

  const findModel = await User.findOne({ where: { username: model.username } });
  if (findModel != null) {
    return { success: false, message: 'Username ya existe', status: 202 };
  }

  try {
    var res = await User.create(model)
    return { success: true, message: 'Realizado', status: 200 };
  } catch (err) {
    return { success: false, message: "error", status: 500, error: err, data: null };
  }
}


const getList = async (body) => {
  try {
    const { page = 1, limit = 10 } = body;
    console.log(page)
    console.log(limit)
    const offset = (page - 1) * limit;
    const result = await User.findAndCountAll({
      attributes: ['id', 'username',  'name', 'role', 'status'], // Campos específicos
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


const get = async (idFind) => {
  try {
    const model = await User.findOne(
      { where: { id: idFind } }
    );
    return { message: "success", status: 200, data: model, error: null };
  } catch (err) {
    return { message: "error", status: 500, error: err, data: null };
  }
}

export default {
    insert,
    login,
    getList,
    get,
    update
};