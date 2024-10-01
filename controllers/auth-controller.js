const bcrypt = require('bcrypt')
const { generateJWT } = require('../utils/jwt-utils')
const { ErrorResponse } = require('../utils/error-schema')
const UserModel = require('../models/user')

const authController = {
    register: async (req, res, next) => {
        const { firstname, lastname, email, password } = req.validatedData

        try {
            //Check if the user emaill already exists in Database
            const existingUser = await UserModel.findOne({ email })
            if (existingUser) {
                return res.status(422).json(new ErrorResponse('Email already in use', 422))
            }
            //If user email is new , generate hash with salt the given password for bcrypt
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            //Then store the new registred user with the hashed password
            const newUser = new UserModel({
                firstname,
                lastname,
                email,
                password: hashedPassword,
            })

            const savedUser = await newUser.save()
            req.user = { id: savedUser._id }

            next()
        } catch (error) {
            res.status(422).json(new ErrorResponse('Registration failed: ' + error.message, 422))
        }
    },
    updateUserWithFiles: async (req, res) => {
        try {
            const userId = req.user.id
            const user = await UserModel.findById(userId)

            if (req.uploadResults) {
                req.uploadResults.forEach((upload) => {
                    if (upload.fieldname === 'profilePicture' && upload.result) {
                        user.profilePicture = {
                            public_id: upload.result.public_id,
                            url: upload.result.secure_url,
                        }
                    }
                    if (upload.fieldname === 'cv' && upload.result) {
                        user.CV = {
                            public_id: upload.result.public_id,
                            url: upload.result.secure_url,
                        }
                    }
                })
            }

            await user.save()
            const token = await generateJWT({
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
            })

            res.json({
                title: 'Registration Successful',
                token: token.token,
                message: 'Files uploaded and user updated successfully',
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                },
            })
        } catch (error) {
            res.status(500).json(new ErrorResponse('Failed to update user with files: ' + error.message, 500))
        }
    },

    login: async (req, res) => {
        const { email, password } = req.validatedData

        try {
            // Find the user
            const user = await UserModel.findOne({ email })
            console.log(` user when find one ${email} `)
            if (!user) {
                return res.status(422).json(new ErrorResponse('Invalid credentials : user not found', 422))
            }

            // Check password
            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) {
                return res.status(422).json(new ErrorResponse('Invalid credentials : password not correct', 422))
            }

            // Generate JWT
            const token = await generateJWT({
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
            })

            res.json({
                title: 'Login Successful',
                message: `${user.firstname} ${user.lastname} is logged in`,
                token: token.token,
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                },
            })
        } catch (error) {
            res.status(500).json(new ErrorResponse('Login failed: ' + error.message, 500))
        }
    },

    refresh: async (req, res) => {
        const { email } = req.validatedData

        try {
            const user = await UserModel.findOne({ email })
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            const token = await generateJWT({
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
            })

            res.json({ token: token.token })
        } catch (error) {
            res.status(500).json(new ErrorResponse('Token refresh failed: ' + error.message, 500))
        }
    },
}

module.exports = authController
