import { NextFunction, Request, RequestHandler, Response } from 'express'
import getPath from '../lib/path'
import User from '../models/User'
import Folder from '../models/Folder'
import fs from 'fs'
import 'express-fileupload'

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
    } catch (err) {
        next(err)
    }
}
