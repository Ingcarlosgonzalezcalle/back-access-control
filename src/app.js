import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectDb from './config/db.js'
import swaggerConfig  from './config/swaggerConfig.js';
import routes from './routes/indexRoutes.js'
dotenv.config();


const port = process.env.PORT || 8020; 
const app = express();
app.use(express.json({limit: '50mb'}));

app.use(cors())
conectDb()
app.listen(port, () => {
    console.log(`Server is running on port::: ${port}`)
})


swaggerConfig(app);
app.use(routes)



app.get('/', (req, res) => {
    res.send("API is running 2025...");
})