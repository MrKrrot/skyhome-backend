import { NextFunction, Request, RequestHandler, Response } from 'express'
import getPath from '../lib/path'
import User from '../models/User'
import fs from 'fs'
import Folder from '../models/Folder'

//* Create folder on index user directory
export const createFolderController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const folderName = req.body.folderName
    const { userId } = req

    if (!folderName) return res.status(400).json({ message: 'No name was specified' })

    try {
        const user = await User.findById(userId)
        if (!user) return res.status(500).json({ message: 'Error founded user' })

        const userPath = await getPath(user.username)
        await fs.promises.mkdir(`${userPath.path}/${folderName}`)
        await userPath.close()
        const newFolder = new Folder({
            folderName,
            user: userId,
            parentPath: '/',
            path: `/${folderName}`,
            children: [],
        })

        const savedFolder = await newFolder.save()

        res.status(201).json({
            message: 'Directory created',
            folder: savedFolder.folderName,
        })
    } catch (err) {
        next(err)
    }
}

//* Create a folder in specific directory
export const createFolderInDirectoryController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const folderId = req.params.folderId
    const folderName = req.body.folderName
    const { userId } = req

    if (!folderName) return res.status(400).json({ message: 'No folder name was specified' })

    try {
        const parentFolder = await Folder.findById(folderId)
        const user = await User.findById(userId)
        if (!parentFolder) return res.status(400).json({ message: 'This folder does not exists' })
        if (!user) return res.status(500).json({ message: 'Error founded user' })

        const userPath = await getPath(`${user.username}${parentFolder.path}`)
        await fs.promises.mkdir(`${userPath.path}/${folderName}`)
        await userPath.close()
        const newFolder = new Folder({
            folderName,
            user: userId,
            parentPath: parentFolder.path,
            path: `${parentFolder.path}/${folderName}`,
            children: [],
        })

        const savedFolder = await newFolder.save()

        const updateParentFolder = {
            id: newFolder._id,
            folderName,
        }

        await Folder.findByIdAndUpdate(
            folderId,
            { $push: { children: updateParentFolder } },
            { new: true }
        )

        res.status(201).json({
            message: 'Directory created',
            folder: savedFolder.folderName,
        })
    } catch (err) {
        next(err)
    }
}

//* Rename folder
export const renameFolderController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const folderId = req.params.folderId
    const newFolderName = req.body.folderName
    const { userId } = req

    if (!newFolderName) return res.status(400).json({ mesage: 'No folder name was specified' })

    try {
        const folderToRename = await Folder.findById(folderId)
        const user = await User.findById(userId)

        if (!folderToRename) return res.status(400).json({ message: 'Folder does not exists' })
        if (!user) return res.status(400).json({ message: 'Error founded user' })

        const oldFolderName = folderToRename.folderName
        const pathToChange = await getPath(`${user.username}${folderToRename.path}`)
        const oldPath = folderToRename.path

        folderToRename.folderName = newFolderName

        // Substract Disk path
        const indexOfDisk = pathToChange.path.lastIndexOf(oldFolderName)
        const substractedDiskPath = pathToChange.path.substring(0, indexOfDisk)

        // Substract DB path
        const indexOfDB = folderToRename.path.lastIndexOf(oldFolderName)
        const substractedDBPath = folderToRename.path.substring(0, indexOfDB)

        fs.renameSync(pathToChange.path, `${substractedDiskPath}${newFolderName}`)

        // Get children of the folder that wants to rename to update them too
        const childrenFolder = await Folder.find({
            user: userId,
            path: { $regex: `${folderToRename.path}/` },
        })

        folderToRename.path = `${substractedDBPath}${newFolderName}`

        // Update children to new path and parentPath
        childrenFolder.forEach(async child => {
            child.path = child.path.replace(
                `${substractedDBPath}${oldFolderName}`,
                folderToRename.path
            )
            child.parentPath = child.parentPath.replace(
                oldPath,
                `${substractedDBPath}${newFolderName}`
            )

            await child.save()
        })

        await folderToRename.save()

        pathToChange.closeSync()
        return res.json({ message: 'Folder renamed succesfully!' })
    } catch (err) {
        next(err)
    }
}

//* Delete folder
export const deleteFolderControler: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const folderId = req.params.folderId
    const { userId } = req

    if (!folderId) return res.status(400).json({ message: 'No folder name was specified' })

    try {
        const deletedFolder = await Folder.findByIdAndDelete(folderId)

        if (!deletedFolder) return res.status(400).json({ message: 'Folder does not exists' })

        const user = await User.findById(userId)

        if (!user) return res.status(500).json({ message: 'Error founded user' })

        const pathToDelete = await getPath(`${user.username}${deletedFolder.path}`)

        await Folder.deleteMany({
            user: userId,
            path: { $regex: `${deletedFolder.path}/` },
        })

        fs.rmdirSync(pathToDelete.path, { recursive: true })

        pathToDelete.close()
        return res.status(201).json({ message: 'Folder removed successfully' })
    } catch (err) {
        next(err)
    }
}
