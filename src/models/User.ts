import { Schema, model } from 'mongoose'

interface User {
    username: string
    password: string
    name: string
    email: string
}

// User Schema for MongoDB
const userSchema = new Schema<User>({
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

export default model<User>('User', userSchema)
