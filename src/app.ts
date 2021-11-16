import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import './database.ts'

// Routes
import registerRoutes from './routes/register.routes'
import loginRoutes from './routes/login.routes'

dotenv.config()
const app = express()

//* Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//* Routes
app.use(registerRoutes)
app.use(loginRoutes)

export default app