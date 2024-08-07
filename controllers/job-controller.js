const Job = require('../models/job')
const mongoose = require('mongoose')
const { ErrorResponse } = require('../utils/error-schema')
const { getJobData } = require('../utils/populate-utils')

// Create a new job
const createJob = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json(new ErrorResponse('Unauthorized: User not authenticated', 401))
        }

        const userId = req.user.id
        const { title, website, company, contact, userExtraInfo } = req.body

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
} */ // Log the new job object before saving

        const newJob = new Job({
            title,
            website,
            company,
            contact,
            userExtraInfo,
            user: userId,
        })
        console.log('New job object:', newJob)
        const job = await newJob.save()
        res.status(201).json(job)
    } catch (error) {
        res.status(500).json(new ErrorResponse('Internal server error: ' + error.message, 500))
    }
}

const populateJob = async (req, res, next) => {
    console.log('GETTING INSIDE populateJOB')
    try {
        // Vérifiez que l'utilisateur est authentifié
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: 'Unauthorized: User not authenticated',
            })
        }

        // Récupérez l'ID de l'utilisateur
        const userId = req.user.id

        // Récupérez les données de job depuis le fichier JSON
        const jobData = await getJobData()

        // Ajoutez l'ID de l'utilisateur à chaque job
        const jobsWithUser = jobData.map((job) => ({
            ...job,
            user: userId,
        }))
        const arrayJobs = []
        jobsWithUser.forEach((jobwithuser) => {
            const newJob = new Job(jobwithuser)
            arrayJobs.push(newJob)
        })

        // Insérez les données de job dans la base de données
        const result = await Job.insertMany(arrayJobs)

        res.status(201).json({
            message: 'Jobs populated successfully',
            data: result,
        })
    } catch (error) {
        console.error('Error populating jobs:', error)
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        })
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

        // Query to find jobs by user ID and select only the required fields
        const jobs = await Job.find({ user: userId })
            .select('_id title company userExtraInfo.status createdAt') // Only select specified fields
            .populate('user', 'username') // Assuming you want to populate user info; adjust as needed
            .exec()

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
    populateJob,
}
