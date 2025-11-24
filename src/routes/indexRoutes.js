import express from 'express'
//import authRoutes from '../routes/authRoutes.js';
import UserRoutes from '../routes/params/UserRoutes.js';
import PersonRoutes from '../routes/params/PersonRoutes.js';

const router = express.Router()
router.use('/api/user/',UserRoutes)
router.use('/api/person/',PersonRoutes)

export default router

