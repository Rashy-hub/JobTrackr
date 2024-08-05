const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
require('dotenv-flow').config()
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
})

/**
 * Télécharge un fichier vers Cloudinary
 *
 * @param {string} resourceType - Type de ressource (image, raw, etc.)
 * @param {string} folderPath - Chemin du dossier dans Cloudinary
 * @param {Buffer} buffer - Contenu du fichier à télécharger
 * @returns {Promise<Object>} - Résultat de l'upload
 */
const uploadToCloudinary = (resourceType, folderPath, buffer, publicId) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: resourceType, folder: folderPath, public_id: publicId }, (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result)
        })

        streamifier.createReadStream(buffer).pipe(uploadStream)
    })
}

module.exports = {
    uploadToCloudinary,
}
/*
const uploadCv = async (buffer) => {
    return uploadToCloudinary('application/pdf', 'jobApplyTracker/CV', buffer)
}

const uploadProfilePicture = async (buffer) => {
    return uploadToCloudinary('image/jpg', 'jobApplyTracker/profilePicture', buffer)
}
 */
