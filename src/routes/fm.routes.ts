import { Router } from 'express'
import userExtractor from '../middlewares/userExtractor'
import { fm, fmPath } from '../controllers/fm.controller'
const router = Router()

// GET user files and directories from index
router.get('/fm', userExtractor, fm)

// GET user files and directories from specific folder
router.get('/fm/:path', userExtractor, fmPath)
export default router
