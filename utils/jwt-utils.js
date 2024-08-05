const jwt = require('jsonwebtoken')

// Génération du JWT
const generateJWT = ({ id, firstname, lastname }) => {
    return new Promise((resolve, reject) => {
        const data = { id, firstname, lastname }
        const secret = process.env.JWT_SECRET

        if (!secret) {
            return reject(new Error('JWT secret not defined in environment'))
        }

        const options = {
            algorithm: 'HS512', // Algorithme pour la signature du token
            audience: process.env.JWT_AUDIENCE || 'default_audience',
            issuer: process.env.JWT_ISSUER || 'default_issuer',
            expiresIn: '1d', // Durée de validité du token
        }

        jwt.sign(data, secret, options, (error, token) => {
            if (error) {
                return reject(new Error(`Token generation error: ${error.message}`))
            }

            const decodedToken = jwt.decode(token)
            if (!decodedToken || !decodedToken.exp) {
                return reject(new Error('Token decoding error'))
            }

            const expire = new Date(decodedToken.exp * 1000).toISOString()
            resolve({ token, expire })
        })
    })
}

const decodeJWT = (token) => {
    return new Promise((resolve, reject) => {
        const secret = process.env.JWT_SECRET

        if (!secret) {
            return reject(new Error('JWT secret not defined in environment'))
        }

        jwt.verify(token, secret, { clockTolerance: 0 }, (error, data) => {
            if (error) {
                return reject(new Error('Invalid JWT or JWT expired'))
            }
            resolve({
                id: data.id,
                firstname: data.firstname,
                lastname: data.lastname,
            })
        })
    })
}

module.exports = {
    generateJWT,
    decodeJWT,
}
