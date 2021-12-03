import { Router } from 'express'
import { loginController } from '../controllers/login.controller'
import { registerController } from '../controllers/register.controller'
import { changePasswordController, deleteUserController } from '../controllers/users.controller'
import userExtractor from '../middlewares/userExtractor'

const router = Router()

//* Register new user
router.post('/v1/users/register', registerController)

//* Login user
router.post('/v1/users/login', loginController)

//* Change password
router.put('/v1/users', userExtractor, changePasswordController)

//* Delete user
router.delete('/v1/users', userExtractor, deleteUserController)

export default router
