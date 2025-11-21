// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import authServices from '../services/general/AuthServices.js'


const loginController = async (req, res) => {
  
  if (!req.body.identification) {
    return res.status(500).json({ message: "campo faltante: id del cliente" });
  }
  if (!req.body.username) {
    return res.status(500).json({ message: "campo faltante: el username" });
  }
  if (!req.body.password) {
    return res.status(500).json({ message: "campo faltante: password" });
  }

  const body = req.body;
  var dataresult = await authServices.login(body)
  return res.status(dataresult.status).json(dataresult);
};

const insertUserController = async (req, res) => {

  
  if (!req.body.identification) {
    return res.status(500).json({ message: "campo faltante: id del cliente" });
  }
  if (!req.body.name) {
    return res.status(500).json({ message: "campo faltante: nombre" });
  }
  if (!req.body.username) {
    return res.status(500).json({ message: "campo faltante: username" });
  }
  if (!req.body.password) {
    return res.status(500).json({ message: "campo faltante: password" });
  }
  if (!req.body.email) {
    return res.status(500).json({ message: "campo faltante: email" });
  }
  if (!req.body.state) {
    return res.status(500).json({ message: "campo faltante: state" });
  }


  const body = req.body
  var dataresult = await authServices.insertUser(body)
  return res.status(dataresult.status).json(dataresult);
}


export default {
  loginController,
  insertUserController
}


