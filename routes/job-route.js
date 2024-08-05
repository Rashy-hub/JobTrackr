const express = require('express')
const { createJob, getJobById, deleteJob, updateJob, getJobsByUser } = require('../controllers/job-controller')
const { authenticateJwt } = require('../middleware/authenticate-jwt')

const jobRouter = express.Router()

jobRouter.get('/jobs', authenticateJwt(), getJobsByUser)
jobRouter.get('/jobs/:id', authenticateJwt(), getJobById)
jobRouter.post('/jobs', authenticateJwt(), createJob)
jobRouter.put('/jobs/:id', authenticateJwt(), updateJob)
jobRouter.delete('/jobs/:id', authenticateJwt(), deleteJob)

module.exports = jobRouter
