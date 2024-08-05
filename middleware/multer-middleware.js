const multer = require('multer')
const { multerStorageOptions } = require('../utils/multer-utils')

/**
 * Middleware pour gérer les téléchargements de fichiers
 *
 * @param {Object} options - Configuration pour multer
 * @returns {(req: Request, res: Response, next: NextFunction) => void}
 */
const multerMiddleware = (options = { fields: [] }) => {
    const upload = multer(multerStorageOptions(options))
    return upload.fields(options.fields)
}

module.exports = multerMiddleware
