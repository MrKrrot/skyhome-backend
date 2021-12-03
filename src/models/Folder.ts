import { Schema, model } from 'mongoose'

interface Folder {
    folderName: string
    user: string
    path: string
    parentPath: string
    children: Array<string>
}

const folderSchema = new Schema<Folder>({
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

export default model<Folder>('Folder', folderSchema)
