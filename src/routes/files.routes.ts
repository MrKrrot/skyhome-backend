import { Router } from 'express'
import {
    deleteFileController,
    deleteFileOnFolderController,
    renameFileController,
    renameFileControllerOnFolder,
    uploadFilesController,
    uploadFilesInDirectoryController,
} from '../controllers/files.controller'
import userExtractor from '../middlewares/userExtractor'
const router = Router()

//* Upload files in index
router.post('/v1/files', userExtractor, uploadFilesController)

//* Upload files in directory
router.post('/v1/files/:path', userExtractor, uploadFilesInDirectoryController)

//* Rename files on index
router.put('/v1/files/:fileName', userExtractor, renameFileController)

//* Rename files in direcotory
router.put('/v1/files/:path/:fileName', userExtractor, renameFileControllerOnFolder)

//* Delete files
router.delete('/v1/files/:fileName', userExtractor, deleteFileController)

//* Delete files in directory
router.delete('/v1/files/:path/:fileName', userExtractor, deleteFileOnFolderController)

export default router
