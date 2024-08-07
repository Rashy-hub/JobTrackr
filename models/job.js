const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const JobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title can't be blank"],
            trim: true,
            maxlength: [100, 'Job title must be less than 100 characters'],
        },
        website: {
            type: String,
            required: [true, "Website can't be blank"],
            trim: true,
            match: [/^https?:\/\/.+/, 'Website URL is invalid'],
            maxlength: [200, 'Website URL must be less than 200 characters'],
        },
        company: {
            type: String,
            required: [true, "Company name can't be blank"],
            trim: true,
            maxlength: [100, 'Company name must be less than 100 characters'],
        },
        contact: {
            name: {
                type: String,
                trim: true,
                maxlength: [100, 'Contact name must be less than 100 characters'],
                default: null,
            },
            email: {
                type: String,
                trim: true,
                match: [/\S+@\S+\.\S+/, 'Contact email is invalid'],
                maxlength: [100, 'Contact email must be less than 100 characters'],
                default: null,
            },
            phone: {
                type: String,
                trim: true,
                match: [/^\+?[1-9]\d{1,14}$/, 'Contact phone number is invalid'],
                maxlength: [15, 'Contact phone number must be less than 15 characters'],
                default: null,
            },
            address: {
                type: String,
                trim: true,
                maxlength: [200, 'Contact address must be less than 200 characters'],
                default: null,
            },
        },
        userExtraInfo: {
            origin: {
                type: String,
                enum: ['candidature spontanée', 'job offer'],
                required: [true, "Origin can't be blank"],
            },
            status: {
                type: String,
                enum: ['interested', 'cv sent', 'negative', 'interview'],
                required: [true, "Status can't be blank"],
            },
            comments: {
                type: String,
                trim: true,
                maxlength: [500, 'Comments must be less than 500 characters'],
                default: null,
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

JobSchema.plugin(uniqueValidator, { message: '{PATH} is already taken.' })

const JobModel = mongoose.model('Job', JobSchema)

module.exports = JobModel
