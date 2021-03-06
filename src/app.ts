import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import './database'
import usersRoutes from './routes/users.routes'
import fmRoutes from './routes/fm.routes'
import filesRoutes from './routes/files.routes'
import foldersRoutes from './routes/folders.routes'
import errorHandler from './middlewares/handleError'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'

dotenv.config()
const app = express()

//* Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())
app.use(morgan('tiny'))
//* Routes
app.use(usersRoutes)
app.use(fmRoutes)
app.use(filesRoutes)
app.use(foldersRoutes)

//* Error Handler
app.use(errorHandler)

export default app
