import express from 'express'
//import authRoutes from '../routes/authRoutes.js';
import UserRoutes from '../routes/params/UserRoutes.js';

const router = express.Router()
router.use('/api/user/',UserRoutes)

export default router

