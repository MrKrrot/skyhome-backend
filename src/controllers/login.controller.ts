import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'
import User from '../models/User'

export const login: RequestHandler = async (req, res, next) => {
    try {
        const { body } = req
        const { username } = body

        const user = await User.findOne({ username })
        const passCorrect =
            user === null ? false : await bcrypt.compare(body.password, user.password)
        if (!(user && passCorrect)) {
            return res.status(400).json({ error: 'invalid user or password' })
        }

        const userForToken = {
            id: user._id,
            username: user.username,
        }
        if (process.env.SECRET_TOKEN) {
            const token = jwt.sign(userForToken, process.env.SECRET_TOKEN)

            res.json({
                name: user.name,
                username: user.username,
                token,
            })
        } else {
            return res.status(500).json({ error: 'found a problem with token' })
        }
    } catch (error) {
        next(error)
    }
}
