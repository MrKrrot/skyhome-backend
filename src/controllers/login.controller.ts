import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'
import User from '../models/User'

export const login: RequestHandler = async (req, res, next) => {
    try {
        const { body } = req
        const { username, email } = body

        if (!username && !email) {
            return res.status(400).json({ message: 'No username or email added' })
        }

        // Find user by username or email
        const user = username ? await User.findOne({ username }) : await User.findOne({ email })

        // Compare if the password is correct
        const passCorrect =
            user === null ? false : await bcrypt.compare(body.password, user.password)
        if (!(user && passCorrect)) {
            return res.status(400).json({ error: 'invalid user or password' })
        }

        const userForToken = {
            id: user._id,
            username: user.username,
            email: user.email,
        }
        if (process.env.SECRET_TOKEN) {
            const token = jwt.sign(userForToken, process.env.SECRET_TOKEN)

            res.json({
                name: user.name,
                username: user.username,
                email: user.email,
                token,
            })
        } else {
            return res.status(500).json({ error: 'Secret Token is missing' })
        }
    } catch (error) {
        next(error)
    }
}
