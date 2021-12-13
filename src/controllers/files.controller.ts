import { NextFunction, Request, RequestHandler, Response } from 'express'
import getPath from '../lib/path'
import User from '../models/User'
import Folder from '../models/Folder'
import fs from 'fs'

//* Upload files on index directory
export const uploadFilesController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.files) {
            return res.status(400).json({ message: 'No files were uploaded' })
        }
        const { userId } = req

        const user = await User.findById(userId)
        if (!user) {
            return res.status(500).json({ message: 'error founded user' })
        }
        let userFiles = req.files.files
        if (!Array.isArray(userFiles)) {
            userFiles = [userFiles]
        }

        const userPath = await getPath(user.username)

        for (const file of userFiles) {
            const existFile = fs.existsSync(`${userPath.path}/${file.name}`)
            if (!existFile) {
                file.mv(`${userPath.path}/${file.name}`, error => {
                    if (error) return res.status(500).json({ error })
                })
            } else {
                let counter = 1
                let existNumberOfFile = false

                do {
                    if (!fs.existsSync(`${userPath.path}/(${counter}) ${file.name}`)) {
                        file.name = `(${counter}) ${file.name}`
                        file.mv(`${userPath.path}/${file.name}`)
                        existNumberOfFile = false
                    } else {
                        existNumberOfFile = true
                        counter++
                    }
                } while (existNumberOfFile)
            }
        }
        userPath.closeSync()
        return res.status(201).json({ message: 'Files uploaded succesfully!' })
    } catch (err) {
        next(err)
    }
}

//* Upload files on specific directory
export const uploadFilesInDirectoryController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.files) {
        return res.status(400).json({ message: 'No files were uploaded' })
    }

    const path = req.params.path
    const { userId } = req

    let userFiles = req.files.files

    if (!Array.isArray(userFiles)) {
        userFiles = [userFiles]
    }
    try {
        const parentFolder = await Folder.findById(path)
        if (!parentFolder) {
            return res.status(400).json({ message: 'Folder does not exists' })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(500).json({ message: 'error founded user' })
        }
        const userPath = await getPath(`${user.username}/${parentFolder.path}`)

        for (const file of userFiles) {
            file.mv(`${userPath.path}/${file.name}`, error => {
                if (error) res.status(500).json({ error })
            })
        }
        for (const file of userFiles) {
            const existFile = fs.existsSync(`${userPath.path}/${file.name}`)
            if (!existFile) {
                file.mv(`${userPath.path}/${file.name}`, error => {
                    if (error) return res.status(500).json({ error })
                })
            } else {
                let counter = 1
                let existNumberOfFile = false

                do {
                    if (!fs.existsSync(`${userPath.path}/(${counter}) ${file.name}`)) {
                        file.name = `(${counter}) ${file.name}`
                        file.mv(`${userPath.path}/${file.name}`)
                        existNumberOfFile = false
                    } else {
                        existNumberOfFile = true
                        counter++
                    }
                } while (existNumberOfFile)
            }
        }
        userPath.closeSync()
        return res.status(201).json({ message: 'Files uploaded succesfully!' })
    } catch (err) {
        next(err)
    }
}

export const renameFileController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const fileName = req.params.fileName
    const newFileName = req.body.fileName
    const { userId } = req
    if (!fileName) return res.status(400).json({ message: 'No file was specified' })
    if (!newFileName) return res.status(400).json({ message: 'No new file was specified' })

    try {
        const user = await User.findById(userId)
        if (!user) return res.status(400).json({ message: 'Error founded user' })

        const userPath = await getPath(user.username)
        fs.renameSync(`${userPath.path}/${fileName}`, `${userPath.path}/${newFileName}`)

        userPath.closeSync()
        return res.status(200).json({ message: 'File renamed successfully!' })
    } catch (err) {
        next(err)
    }
}

export const renameFileControllerOnFolder: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const fileName = req.params.fileName
    const folderId = req.params.path
    const newFileName = req.body.fileName
    const { userId } = req

    if (!fileName) return res.status(400).json({ message: 'No file was specified' })
    if (!newFileName) return res.status(400).json({ message: 'No new file name was specified' })

    try {
        const user = await User.findById(userId)
        if (!user) return res.status(400).json({ message: 'Error founded user' })

        const folder = await Folder.findById(folderId)
        if (!folder) return res.status(400).json({ message: 'This folder does not exists' })

        const userPath = await getPath(`${user.username}${folder.path}`)

        fs.renameSync(`${userPath.path}/${fileName}`, `${userPath.path}/${newFileName}`)
        userPath.closeSync()

        return res.status(200).json({ message: 'File renamed successfully!' })
    } catch (err) {
        next(err)
    }
}

export const deleteFileController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const fileName = req.params.fileName
    const { userId } = req

    if (!fileName) return res.status(400).json({ message: 'No file name was specified' })

    try {
        const user = await User.findById(userId)

        if (!user) return res.status(400).json({ message: 'Error founded user' })

        const userPath = await getPath(user.username)
        fs.unlinkSync(`${userPath.path}/${fileName}`)

        userPath.closeSync()

        return res.status(204).json({ message: 'File removed successfully!' })
    } catch (err) {
        next(err)
    }
}

export const deleteFileOnFolderController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const fileName = req.params.fileName
    const folderId = req.params.path
    const { userId } = req

    if (!fileName) return res.status(400).json({ message: 'No file name was specified' })

    try {
        const user = await User.findById(userId)

        if (!user) return res.status(400).json({ message: 'Error founded user' })

        const folder = await Folder.findById(folderId)
        if (!folder) return res.status(400).json({ message: 'This folder does not exists' })

        const userPath = await getPath(`${user.username}${folder.path}`)

        fs.unlinkSync(`${userPath.path}/${fileName}`)

        userPath.closeSync()

        return res.status(204).json({ message: 'File removed successfully!' })
    } catch (err) {
        next(err)
    }
}
