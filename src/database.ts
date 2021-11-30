import mongoose from 'mongoose'
import 'dotenv/config'

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

let connectionString: string

// If no values in .env then exit
if (MONGO_DB_URI && MONGO_DB_URI_TEST) {
    connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI
} else {
    process.exit(1)
}

// Turn on the database connection
(async () => {
    const db = await mongoose.connect(connectionString)
    console.log(`Database is connected to: ${db.connection.name}`)
})()

// Turn off the database connection if error exists
process.on('uncaughtException', err => {
    console.error(err)
    mongoose.disconnect()
    console.log('Database disconnected')
})
