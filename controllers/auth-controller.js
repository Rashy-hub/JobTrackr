const bcrypt = require('bcrypt')
const { generateJWT } = require('../utils/jwt-utils')
const { ErrorResponse } = require('../utils/error-schema')
const UserModel = require('../models/user')

const authController = {
    register: async (req, res) => {
        const { firstname, lastname, email, password } = req.validatedData
        console.log('Getting inside the register controller endpoint')

        try {
            // Check if the email already exists

            const existingUser = await UserModel.findOne({ email })
            if (existingUser) {
                return res.status(422).json(new ErrorResponse('Email already in use', 422))
            }
            console.log('before saving')
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Create a new user
            const newUser = new UserModel({
                firstname,
                lastname,
                email,
                password: hashedPassword,
            })

            // Save to the database

            const savedUser = await newUser.save()

            // Generate JWT
            const token = await generateJWT({
                id: savedUser._id,
                firstname: savedUser.firstname,
                lastname: savedUser.lastname,
            })

            res.json({
                title: 'Registration Successful',
                message: `${firstname} ${lastname} has been registered`,
                token: token.token,
                user: {
                    id: savedUser._id,
                    firstname: savedUser.firstname,
                    lastname: savedUser.lastname,
                    email: savedUser.email,
                },
            })
        } catch (error) {
            res.status(422).json(new ErrorResponse('Registration failed: ' + error.message, 422))
        }
    },

    login: async (req, res) => {
        const { email, password } = req.validatedData

        try {
            // Find the user
            const user = await UserModel.findOne({ email })
            console.log(` user when find one ${email} `)
            if (!user) {
                return res.status(422).json(new ErrorResponse('Invalid credentials', 422))
            }

            // Check password
            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) {
                return res.status(422).json(new ErrorResponse('Invalid credentials', 422))
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

            // Generate JWT
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
