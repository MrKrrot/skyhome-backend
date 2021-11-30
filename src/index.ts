import app from './app'

const PORT = process.env.PORT

// Turn on the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
