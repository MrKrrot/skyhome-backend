import { NextFunction, Request, RequestHandler, Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'
import Folder from '../models/Folder'
import getPath from '../lib/path'
import fs from 'fs'

//* Change password controller
export const changePasswordController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req

    const cred = req.body

    if (!cred.oldPassword || !cred.newPassword || !cred.confirmPassword) {
        return res.status(400).json({ message: 'user info is missing' })
    }

    try {
        const user = await User.findById(userId)

        const passCorrect =
            user === null ? false : await bcrypt.compare(cred.oldPassword, user.password)

        if (!(user && passCorrect)) {
            return res.status(400).json({ message: 'incorrect password' })
        }

        if (!(cred.newPassword === cred.confirmPassword)) {
            return res.status(400).json({ message: 'passwords do not match' })
        }

        const passwordHash = await bcrypt.hash(cred.newPassword, 10)
        user.password = passwordHash
        await user.save()

        return res.json({ message: 'password was changed succesfully!' })
    } catch (err) {
        next(err)
    }
}

//* Delete user controller
export const deleteUserController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req
    try {
        const user = await User.findByIdAndDelete(userId)
        if (!user) return res.status(500).json({ message: 'Error founded user' })

        const dir = await getPath(user.username)

        await Folder.deleteMany({ user: userId })
        fs.rmdirSync(dir.path, { recursive: true })
        await dir.close()
        res.status(204).end()
    } catch (err) {
        next(err)
    }
}
