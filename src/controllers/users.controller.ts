import { NextFunction, Request, RequestHandler, Response } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'

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
