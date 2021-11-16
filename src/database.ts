import mongoose from 'mongoose'
import 'dotenv/config'

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

let connectionString: string

if (MONGO_DB_URI && MONGO_DB_URI_TEST) {
    connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI
} else {
    process.exit(1)
}

(async () => {
    try {
        const db = await mongoose.connect(connectionString)
        console.log(`Database is connected to: ${db.connection.name}`)
    } catch (err) {
        console.log(`Failed to connect to the database: ${err}`)
    }
})()

process.on('uncaughtException', err => {
    console.error(err)
    mongoose.disconnect()
    console.log('Database disconnected')
})
