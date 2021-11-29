import { Schema, model } from 'mongoose'

const folderSchema = new Schema({
    folderName: String,
    user: String,
    path: String,
    parentPath: String,
    children: Array,
})

folderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    },
})

export default model('Folder', folderSchema)
