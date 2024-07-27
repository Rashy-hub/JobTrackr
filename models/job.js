const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please enter a title'],
            trim: true,
            maxlength: [100, 'Title must be less than 100 characters'],
        },
        company: {
            type: String,
            trim: true,
            maxlength: [100, 'Company name must be less than 100 characters'],
        },
        website: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
        },
        contact: {
            name: {
                type: String,
                trim: true,
                maxlength: [100, 'Name must be less than 100 characters'],
            },
            email: {
                type: String,
                lowercase: true,
                required: [true, "Email can't be blank"],
                match: [/\S+@\S+\.\S+/, 'Email is invalid'],
                index: true,
            },
            phone: {
                type: String,
                trim: true,
                match: [/^\+?[0-9\s\-]{7,15}$/, 'Phone number is invalid'],
            },
            address: {
                type: String,
                trim: true,
                maxlength: [200, 'Address must be less than 200 characters'],
            },
        },
        origin: {
            type: String,
            enum: ['LinkedIn', 'Indeed', 'Glassdoor', 'Referral', 'Other'],
            default: 'Other',
        },
        status: {
            type: String,
            enum: ['Applied', 'Interviewing', 'Offered', 'Rejected', 'Accepted'],
            default: 'Applied',
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [500, 'Comment must be less than 500 characters'],
        },
    },
    {
        timestamps: true,
    }
)

const JobModel = mongoose.model('Job', JobSchema)

module.exports = JobModel
