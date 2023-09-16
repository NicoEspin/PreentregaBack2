import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'


const app = express()
const PORT = 4000

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('BDD conectada')
    })
    .catch(() => console.log('Error en conexion a BDD'))

app.use(express.json())


app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})