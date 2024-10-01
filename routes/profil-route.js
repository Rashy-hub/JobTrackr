const express = require('express')
const { authenticateJwt } = require('../middleware/authenticate-jwt')
const { getProfile, updateProfile } = require('../controllers/profil-controller')
const multerMiddleware = require('../middleware/multer-middleware')
const cloudinaryMiddleware = require('../middleware/cloudinary-middleware')

const profilRouter = express.Router()

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

// Route to get the profile
profilRouter.get('/profile', authenticateJwt(), getProfile)

// Route to update the profile and uploade to cloudinary files
profilRouter.put('/profile', authenticateJwt(), uploadProfileFiles, cloudinaryUpload, updateProfile)

module.exports = profilRouter
