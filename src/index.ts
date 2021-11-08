import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.json({ message: 'Init SkyHome' })
})

app.listen(5000, () => {
    console.log('Server listening on port 5000')
})
