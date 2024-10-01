const express = require('express')
const authController = require('../controllers/auth-controller')
const bodyValidation = require('../middleware/body-validation')
const { registerValidator, loginValidator, refreshValidator, fileValidator } = require('../validators/auth-validators')
const multerMiddleware = require('../middleware/multer-middleware')
const cloudinaryMiddleware = require('../middleware/cloudinary-middleware')
const bodyWithFilesValidation = require('../middleware/form-data-validation')

const authRouter = express.Router()

// Middleware to handle file uploads
const uploadProfileFiles = multerMiddleware({
    fields: [
        { name: 'cv', maxCount: 1 },
        { name: 'profilePicture', maxCount: 1 },
    ],
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFileSize: 10 * 1024 * 1024, // 10 MB
})

const cloudinaryUpload = cloudinaryMiddleware({
    resourceType: 'auto', // Automatically detect file type
    folderPath: 'jobApplyTracker/profiles',
})

authRouter.post(
    '/auth/register',
    uploadProfileFiles,
    bodyWithFilesValidation(registerValidator, fileValidator),
    authController.register,
    cloudinaryUpload,
    authController.updateUserWithFiles
)

authRouter.post('/auth/login', bodyValidation(loginValidator), authController.login)
authRouter.post('/auth/refresh', bodyValidation(refreshValidator), authController.refresh)

module.exports = authRouter
