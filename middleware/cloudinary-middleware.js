const { uploadToCloudinary } = require('../utils/cloudinary-utils')

/**
 * Middleware pour télécharger les fichiers vers Cloudinary
 *
 * @param {Object} options - Configuration pour le téléchargement
 * @returns {(req: Request, res: Response, next: NextFunction) => void}
 */
const cloudinaryMiddleware = (options = { resourceType: 'auto', folderPath: '' }) => {
    return async (req, res, next) => {
        if (!req.files) {
            return next() // No files to process
        }
        const userId = req.user && req.user.id // Supposons que l'ID de l'utilisateur soit disponible dans req.user.id

        if (!userId) {
            return res.status(400).send('User ID is required')
        }

        try {
            const fileUploads = []
            for (const [fieldname, files] of Object.entries(req.files)) {
                for (const file of files) {
                    let publicId = `${fieldname}_${userId}` // Générer un public_id basé sur l'ID de l'utilisateur et le nom du champ
                    const fileType = file.mimetype // Déterminer le type de fichier

                    // Définir dynamiquement le resourceType en fonction du type de fichier
                    const resourceType = fileType === 'application/pdf' ? 'raw' : 'image'

                    // Ajouter l'extension .pdf si le fichier est un PDF
                    if (fileType === 'application/pdf') {
                        publicId += '.pdf'
                    }
                    fileUploads.push(
                        uploadToCloudinary(resourceType, options.folderPath, file.buffer, publicId)
                            .then((result) => ({ fieldname, result }))
                            .catch((error) => ({ fieldname, error }))
                    )
                }
            }

            const uploadResults = await Promise.all(fileUploads)
            req.uploadResults = uploadResults // Attach results to request object
            next()
        } catch (error) {
            console.error('Cloudinary upload error:', error)
            res.status(500).send('Internal Server Error')
        }
    }
}

module.exports = cloudinaryMiddleware
