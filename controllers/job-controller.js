const Job = require('../models/job')
const mongoose = require('mongoose')
const { ErrorResponse } = require('../utils/error-schema')

// Create a new job
const createJob = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json(new ErrorResponse('Unauthorized: User not authenticated', 401))
        }

        const userId = req.user.id
        const { title, website, contact, userExtraInfo } = req.body

        /*{
    "title": "Front end dev",
    "website": "https://front-company.com",
    "contact": {
        "name": "Alice Johnson",
        "email": "alice.johnson@data-company.com",
        "phone": "+11876543231",
        "address": "456 Data Rd, City, Country"
    },
    "userExtraInfo": {
        "origin": "Candidature spontanée",
        "status": "CV sent",
        "comments": "Looking forward to hearing back."
    }
} */

        const newJob = new Job({
            title,
            website,
            contact,
            userExtraInfo,
            user: userId,
        })

        const job = await newJob.save()
        res.status(201).json(job)
    } catch (error) {
        res.status(500).json(new ErrorResponse('Internal server error: ' + error.message, 500))
    }
}

// Get job by ID
const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id
        console.log('HELLO')
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json(new ErrorResponse('Invalid job ID', 400))
        }

        const job = await Job.findById(jobId) //.populate('user', 'firstname lastname email')

        if (!job) {
            return res.status(404).json(new ErrorResponse('Job not found', 404))
        }

        res.json(job)
    } catch (error) {
        res.status(500).json(new ErrorResponse('Internal server error: ' + error.message, 500))
    }
}

// Update job by ID
const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json(new ErrorResponse('Invalid job ID', 400))
        }

        const updateData = { ...req.body }

        const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true })

        if (!job) {
            return res.status(404).json(new ErrorResponse('Job not found', 404))
        }

        res.json(job)
    } catch (error) {
        res.status(500).json(new ErrorResponse('Internal server error: ' + error.message, 500))
    }
}

// Delete job by ID
const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json(new ErrorResponse('Invalid job ID', 400))
        }

        const job = await Job.findByIdAndDelete(jobId)

        if (!job) {
            return res.status(404).json(new ErrorResponse('Job not found', 404))
        }

        res.json({ message: 'Job deleted successfully' })
    } catch (error) {
        res.status(500).json(new ErrorResponse('Internal server error: ' + error.message, 500))
    }
}

// Get all jobs for a user
const getJobsByUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json(new ErrorResponse('Unauthorized: User not authenticated', 401))
        }

        const userId = req.user.id

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json(new ErrorResponse('Invalid user ID', 400))
        }

        const jobs = await Job.find({ user: userId })

        res.json(jobs)
    } catch (error) {
        res.status(500).json(new ErrorResponse('Internal server error: ' + error.message, 500))
    }
}

module.exports = {
    createJob,
    getJobById,
    updateJob,
    deleteJob,
    getJobsByUser,
}
