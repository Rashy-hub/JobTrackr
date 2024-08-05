const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            lowercase: true,
            required: [true, "First name can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, 'First name is invalid'],
            trim: true,
            maxlength: [50, 'First name must be less than 50 characters'],
            index: true,
        },
        lastname: {
            type: String,
            lowercase: true,
            required: [true, "Last name can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, 'Last name is invalid'],
            trim: true,
            maxlength: [50, 'Last name must be less than 50 characters'],
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            required: [true, "Email can't be blank"],
            unique: true,
            match: [/\S+@\S+\.\S+/, 'Email is invalid'],
            trim: true,
            index: true,
        },
        github: {
            type: String,
            trim: true,
            match: [/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+$/, 'GitHub profile URL is invalid'],
            maxlength: [100, 'GitHub profile URL must be less than 100 characters'],
            default: null,
        },
        profilePicture: {
            public_id: {
                type: String,
                trim: true,
                default: null, // Add a default value
            },
            url: {
                type: String,
                trim: true,
                match: [/^https?:\/\/.+/, 'Profile picture URL is invalid'],
                maxlength: [200, 'Profile picture URL must be less than 200 characters'],
                default: null, // Add a default value
            },
        },
        CV: {
            public_id: {
                type: String,
                trim: true,
                default: null, // Add a default value
            },
            url: {
                type: String,
                trim: true,
                match: [/^https?:\/\/.+/, 'CV URL is invalid'],
                maxlength: [200, 'CV URL must be less than 200 characters'],
                default: null, // Add a default value
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            default: null, // Add a default value
        },
        offers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
    },
    {
        timestamps: true,
    }
)

UserSchema.plugin(uniqueValidator, { message: '{PATH} is already taken.' })

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel
