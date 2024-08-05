const { Request, Response, NextFunction } = require('express')
const { BaseSchema } = require('yup')
const { ErrorResponse, InvalidFieldErrorResponse } = require('../utils/error-schema')

/**
 * Middleware de validation Yup pour le body et les fichiers
 * @param {BaseSchema} yupBodyValidator - Schéma Yup pour valider les données du body
 * @param {BaseSchema} yupFilesValidator - Schéma Yup pour valider les fichiers uploadés
 * @param {number} errorCode - Code d'erreur HTTP à retourner en cas d'échec de validation
 * @returns {(req: Request, res: Response, next: NextFunction) => void}
 */
const bodyWithFilesValidation = (yupBodyValidator, yupFilesValidator, errorCode = 422) => {
    /**
     * Middleware pour valider les données du body et les fichiers via des validateurs Yup
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    return (req, res, next) => {
        // Valider les données du body
        yupBodyValidator
            .noUnknown()
            .validate(req.body, { abortEarly: false })
            .then((bodyData) => {
                // Préparer les fichiers pour validation
                const files = {
                    profilePicture: req.files['profilePicture'] ? req.files['profilePicture'][0] : null,
                    cv: req.files['cv'] ? req.files['cv'][0] : null,
                }

                // Valider les fichiers uploadés
                yupFilesValidator
                    .noUnknown()
                    .validate(files, { abortEarly: false })
                    .then((filesData) => {
                        // Ajout d'une propriété "validatedData" avec les données validées par Yup
                        req.validatedData = bodyData
                        // Ajout d'une propriété "validatedFiles" avec les fichiers validés par Yup
                        req.validatedFiles = filesData

                        next()
                    })
                    .catch((yupError) => {
                        // Création d'un objet "errors" basé sur les erreurs de validation Yup des fichiers
                        const errors = yupError.inner.reduce((acc, error) => {
                            const { path, message } = error
                            if (!acc.hasOwnProperty(path)) {
                                acc[path] = [message]
                            } else {
                                acc[path].push(message)
                            }
                            return acc
                        }, {})

                        // Envoi d'une réponse d'erreur formatée pour les fichiers
                        res.status(errorCode).json(new InvalidFieldErrorResponse('Files invalid', errors, errorCode))
                    })
            })
            .catch((yupError) => {
                // Création d'un objet "errors" basé sur les erreurs de validation Yup du body
                const errors = yupError.inner.reduce((acc, error) => {
                    const { path, message } = error
                    if (!acc.hasOwnProperty(path)) {
                        acc[path] = [message]
                    } else {
                        acc[path].push(message)
                    }
                    return acc
                }, {})

                // Envoi d'une réponse d'erreur formatée pour le body
                res.status(errorCode).json(new InvalidFieldErrorResponse('Body data invalid', errors, errorCode))
            })
    }
}

module.exports = bodyWithFilesValidation
