import { Schema, model } from 'mongoose'

interface File {
    fileName: string
    user: string
    path: string
    parentPath: string
}

const fileSchema = new Schema<File>({
    fileName: String,
    user: String,
    path: String,
    parentPath: String,
})

fileSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    },
})

export default model<File>('File', fileSchema)
