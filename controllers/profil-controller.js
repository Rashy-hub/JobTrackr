const User = require('../models/user')
const mongoose = require('mongoose')
const { ErrorResponse } = require('../utils/error-schema')

const getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json(new ErrorResponse('Unauthorized: User not authenticated', 401))
        }

        const userId = req.user.id

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json(new ErrorResponse('Invalid user ID', 400))
        }

        const user = await User.findById(userId)
        console.log(user)
        if (user) {
            res.json({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                github: user.github,
                profilePicture: user.profilePicture,
                cv: user.CV,
            })
        } else {
            res.status(422).json(new ErrorResponse('User not found', 422))
        }
    } catch (error) {
        res.status(500).json(new ErrorResponse('Internal server error : ' + error.message, 500))
    }
}

const updateProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json(new ErrorResponse('Unauthorized: User not authenticated', 401))
        }

        const userId = req.user.id

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json(new ErrorResponse('Invalid user ID', 400))
        }
        let updateData = { ...req.body }

        // If there are uploaded files, include their Cloudinary URLs in the update data
        if (req.uploadResults) {
            req.uploadResults.forEach(({ fieldname, result, error }) => {
                if (result) {
                    if (fieldname === 'cv') {
                        updateData = { ...updateData, ...{ CV: { public_id: result.public_id, url: result.secure_url } } }
                    } else if (fieldname === 'profilePicture') {
                        updateData = { ...updateData, ...{ profilePicture: { public_id: result.public_id, url: result.secure_url } } }
                        //updateData.profilePictureUrl =
                        // console.log(updateData.profilePictureUrl)
                    }
                }
                // Handle errors if needed
            })
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true })
        if (!user) {
            return res.status(404).json(new ErrorResponse('User not found', 404)) // Not Found
        }
        res.json(user)
    } catch (error) {
        console.error('Error updating profile:', error)
        res.status(500).json(new ErrorResponse('Internal server error : ' + error.message, 500))
    }
}

module.exports = {
    getProfile,
    updateProfile,
}
