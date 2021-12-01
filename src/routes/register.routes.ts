import { Router } from 'express'
import { register } from '../controllers/register.controller'

const router = Router()

router.post('/v1/users/register', register)

export default router
