import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

const verifyToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const token = auth.split(' ').pop();
    const decoded = jwt.verify(token,JWT_SECRET);
    console.log(decoded)
    req.user = decoded;
    req.token =token
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default verifyToken;