import { Router } from 'express'
import userExtractor from '../middlewares/userExtractor'
import { fileManagerController, fileManagerPathController } from '../controllers/fm.controller'
const router = Router()

//* GET user files and directories from index
router.get('/v1/fm', userExtractor, fileManagerController)

//* GET user files and directories from specific folder
router.get('/v1/fm/:path', userExtractor, fileManagerPathController)

export default router
