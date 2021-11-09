import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

export const app = express()

const PORT = process.env.PORT

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Init SkyHome' })
})

export const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
