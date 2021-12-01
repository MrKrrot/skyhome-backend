import { RequestHandler } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'
import fs from 'fs'
import storage from '../lib/storage'

export const register: RequestHandler = async (req, res, next) => {
    const user = req.body

    if (!user || !user.username || !user.password || !user.name) {
        return res.status(400).json({ message: 'user info is missing' })
    }

    const passwordHash = await bcrypt.hash(user.password, 10)

    const newUser = new User({
        username: user.username,
        password: passwordHash,
        name: user.name,
    })

    try {
        const savedUser = await newUser.save()
        fs.mkdirSync(`${storage}/${savedUser.username}`)
        res.status(201).json(savedUser)
    } catch (err) {
        next(err)
    }
}
