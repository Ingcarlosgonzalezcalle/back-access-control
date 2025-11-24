import express from 'express'
import controller from '../../controllers/params/PersonController.js'
const router = express.Router()


router.post('/insert',controller.insert)
router.post('/update',controller.update)
router.get('/list',controller.list)
router.get('/get',controller.get)


export default router