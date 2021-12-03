import { Router } from 'express'
import {
    uploadFilesController,
    uploadFilesInDirectoryController,
} from '../controllers/files.controller'
import userExtractor from '../middlewares/userExtractor'
const router = Router()

//TODO Save files on MongoDB
//* Upload files in index
router.post('/v1/files', userExtractor, uploadFilesController)

//TODO Save files on MongoDB
//* Upload files in directory
router.post('/v1/files/:path', userExtractor, uploadFilesInDirectoryController)

//TODO Rename files controller
//* Rename files
router.put('/v1/files/:id', userExtractor)

//TODO Delete files controller
//* Delete files
router.put('/v1/files/:id', userExtractor)
export default router
