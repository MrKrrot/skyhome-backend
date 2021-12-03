import { Router } from 'express'
import userExtractor from '../middlewares/userExtractor'

const router = Router()

//* Create directory
router.post('/v1/folders', userExtractor)

//* Create directory in specific folder
router.post('/v1/folders/:path', userExtractor)

//* Rename directory
router.put('/v1/folders/:id', userExtractor)

//* Delete directory
router.put('/v1/folders/:id', userExtractor)

export default router
