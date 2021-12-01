import { Router } from 'express'
import { register } from '../controllers/register.controller'

const router = Router()

router.post('/register', register)

export default router
