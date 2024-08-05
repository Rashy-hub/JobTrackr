/* const ProfilController = require('../controllers/profil-controller')
const { authentificateJwt } = require('../middlewares/authentificate-jwt')
const multerConfig = require('../middlewares/multer-config')

const profilRouter = require('express').Router() */

// Routing pour les acces utilisateur
// - Route "/register" pour créer un compte et récuperer un token d'identification
// - Route "/login" pour obtenir un JSON Web Token d'identification

//profilRouter.route('/user/update').post(authentificateJwt(), multerConfig('avatar_image'), ProfilController.update)

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

// Route to update the profile
profilRouter.put('/profile', authenticateJwt(), uploadProfileFiles, cloudinaryUpload, updateProfile) // Handle file uploads
// Upload files to Cloudinary

module.exports = profilRouter
