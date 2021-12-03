import { Router } from 'express'
import {
    uploadFilesController,
    uploadFilesInDirectoryController,
} from '../controllers/files.controller'
import userExtractor from '../middlewares/userExtractor'
const router = Router()

//* Upload files in index
router.post('/v1/files', userExtractor, uploadFilesController)

//* Upload files in directory
router.post('/v1/files/:path', userExtractor, uploadFilesInDirectoryController)

//* Rename files
router.put('/v1/files/:id', userExtractor)

//* Delete files
router.put('/v1/files/:id', userExtractor)
export default router
