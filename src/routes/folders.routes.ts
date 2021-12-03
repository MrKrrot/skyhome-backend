import { Router } from 'express'
import {
    createFolderController,
    createFolderInDirectoryController,
    deleteFolderControler,
    renameFolderController,
} from '../controllers/folders.controller'
import userExtractor from '../middlewares/userExtractor'

const router = Router()

//* Create directory
router.post('/v1/folders', userExtractor, createFolderController)

//* Create directory in specific folder
router.post('/v1/folders/:folderId', userExtractor, createFolderInDirectoryController)

//TODO Finish rename folder controller
//* Rename directory
router.put('/v1/folders/:folderId', userExtractor, renameFolderController)

//* Delete directory
router.delete('/v1/folders/:folderId', userExtractor, deleteFolderControler)

export default router
