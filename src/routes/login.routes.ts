import { Router } from 'express'
import { login } from '../controllers/login.controller'

const router = Router()

router.post('/v1/users/login', login)

export default router
