import { RequestHandler } from 'express'
import getPath from '../lib/path'
import Folder from '../models/Folder'
import User from '../models/User'

// User File Manager Controller from index path
export const fm: RequestHandler = async (req, res, next) => {
    const { userId } = req

    try {
        const user = await User.findById(userId)
        const userPath = await getPath(user.username)

        const content = {
            files: [] as Array<string>,
            directories: [] as Array<object>,
            path: '/',
        }

        const userFolders = await Folder.find({ user: userId, parentPath: '/' })

        for await (const dirent of userPath) {
            if (dirent.isFile()) {
                content.files.push(dirent.name)
            }
        }
        for (const userFolder of userFolders) {
            content.directories.push({
                id: userFolder._id as string,
                name: userFolder.folderName as string,
            })
        }

        return res.json(content).status(200)
    } catch (err) {
        next(err)
    }
}

// User File Manager Controller from specific path
export const fmPath: RequestHandler = async (req, res, next) => {
    const path = req.params.path
    const { userId } = req

    try {
        const parentFolder = await Folder.findById(path)
        const user = await User.findById(userId)

        if (!parentFolder) {
            return res.status(400).json({ message: 'This folder does not exists' })
        }
        const userPath = await getPath(`${user.username}/${parentFolder.path}`)

        const content = {
            files: [] as Array<string>,
            directories: [] as Array<object>,
            path: parentFolder.path,
        }

        const userFolders = await Folder.find({ user: userId, parentPath: parentFolder.path })

        // Arregement of files and directories
        for await (const dirent of userPath) {
            if (dirent.isFile()) {
                content.files.push(dirent.name)
            }
        }

        for (const userFolder of userFolders) {
            content.directories.push({ id: userFolder._id, name: userFolder.folderName })
        }

        return res.json(content).status(200)
    } catch (err) {
        next(err)
    }
}
