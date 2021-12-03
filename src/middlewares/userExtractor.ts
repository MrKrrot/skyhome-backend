import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { decodedToken } from '../../types/decodedToken'

export default (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.get('authorization')
    let token = ''
    // Format token and substract it without Bearer
    if (authorization && authorization.toLocaleLowerCase().startsWith('bearer')) {
        token = authorization.substring(7)
    }

    try {
        if (process.env.SECRET_TOKEN) {
            const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)

            if (!token || !(decodedToken as decodedToken).id) {
                return res.status(401).json({ error: 'token missing or invalid' })
            }

            const { id: userId } = decodedToken as decodedToken

            req.userId = userId
        }
    } catch (err) {
        next(err)
    }
    next()
}
