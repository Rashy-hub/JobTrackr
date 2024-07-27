const mongoose = require('mongoose')
const JobModel = require('../models/Job')

exports.getJobs = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized: User not authenticated')
        }

        const userId = req.user.id

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid user ID')
        }

        const jobs = await JobModel.find({ user: userId })

        res.json({ jobs })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error retrieving jobs')
    }
}

exports.addJob = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized: User not authenticated')
        }

        const userId = req.user.id
        const { title, company, website, contact, origin, status, comment } = req.body

        const job = new JobModel({
            user: userId,
            title,
            company,
            website,
            contact,
            origin,
            status,
            comment,
        })

        await job.save()

        const jobs = await JobModel.find({ user: userId })
        res.json({ jobs })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error adding job')
    }
}

exports.updateJob = async (req, res) => {
    const { id } = req.params

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized: User not authenticated')
        }

        const userId = req.user.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid job ID')
        }

        const job = await JobModel.findOneAndUpdate({ _id: id, user: userId }, req.body, { new: true, runValidators: true })

        if (!job) {
            return res.status(404).send('Job not found')
        }

        res.json({ job })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error updating job')
    }
}

exports.deleteJob = async (req, res) => {
    const { id } = req.params

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized: User not authenticated')
        }

        const userId = req.user.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid job ID')
        }

        const job = await JobModel.findOneAndDelete({ _id: id, user: userId })

        if (!job) {
            return res.status(404).send('Job not found')
        }

        res.json({ message: 'Job deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).send('Error deleting job')
    }
}
