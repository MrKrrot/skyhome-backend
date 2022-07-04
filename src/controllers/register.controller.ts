import { NextFunction, Request, RequestHandler, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import storage from '../lib/storage'
import secretToken from '../lib/token'

export const registerController: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.body

    if (
        !user ||
        !user.username ||
        !user.password ||
        !user.name ||
        !user.email ||
        !user.confirmPassword
    ) {
        return res.status(400).json({ message: 'user info is missing' })
    }

    try {
        if (!(user.password === user.confirmPassword)) {
            return res.status(400).json({ message: 'passwords do not match' })
        }
        const passwordHash = await bcrypt.hash(user.password, 10)

        const userForToken = {
            id: user._id,
            username: user.username,
            email: user.email,
        }
        if (secretToken) {
            const token = jwt.sign(userForToken, secretToken)
            const newUser = new User({
                username: user.username,
                password: passwordHash,
                name: user.name,
                email: user.email,
            })

            const savedUser = await newUser.save()
            fs.mkdirSync(`${storage}/${savedUser.username}`)
            res.status(201).json({ savedUser, token })
        }
    } catch (err) {
        next(err)
    }
}
