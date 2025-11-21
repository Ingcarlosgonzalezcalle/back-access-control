// routes/authRoutes.js
import express from 'express';
import controller from '../controllers/params/UserController.js'
const router = express.Router();

router.post('/login', controller.login);
router.post('/insert', controller.insert);

export default router;
