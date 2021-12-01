import { Schema, model } from 'mongoose'

// User Schema for MongoDB
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    name: String,
    email: {
        type: String,
        unique: true,
    },
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
    },
})

export default model('User', userSchema)
