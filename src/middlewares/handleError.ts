import { ErrorRequestHandler, NextFunction, Response } from 'express'

const ERROR_HANDLERS = {
    CastError: (res: Response) => res.status(400).send({ error: 'id used is malformed' }),
    ValidationError: (res: Response, message: string) => res.status(409).send({ error: message }),
    JsonWebTokenError: (res: Response) =>
        res.status(401).json({ error: 'token missing or invalid' }),
    TokenExpirerError: (res: Response) => res.status(400).json({ error: 'token expired' }),
    EEXIST: (res: Response) => res.status(400).json({ error: 'Folder already exists' }),
    ENOENT: (res: Response) => res.status(400).json({ error: 'Folder not found' }),
    defaultError: (res: Response, err: NodeJS.ErrnoException) =>
        res.status(500).json({ error: err }),
}

const errorHandler: any = (
    err: NodeJS.ErrnoException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err.code === 'EEXIST' || err.code === 'ENOENT') {
        const handler = ERROR_HANDLERS[err.code]
        handler(res)
    } else if (
        err.name === 'CastError' ||
        err.name === 'ValidationError' ||
        err.name === 'JsonWebTokenError' ||
        err.name === 'TokenExpirerError'
    ) {
        const handler = ERROR_HANDLERS[err.name]
        handler(res, err.name)
    } else {
        const handler = ERROR_HANDLERS.defaultError

        handler(res, err)
    }
}

export default errorHandler
