const express = require('express')
const jobController = require('../controllers/job-controller')
const { authenticateJwt } = require('../middleware/authenticate-jwt')

const jobRouter = express.Router()

jobRouter.get('/jobs', authenticateJwt(), jobController.getJobs)
jobRouter.post('/jobs', authenticateJwt(), jobController.addJob)
jobRouter.put('/jobs/:id', authenticateJwt(), jobController.updateJob)
jobRouter.delete('/jobs/:id', authenticateJwt(), jobController.deleteJob)

module.exports = jobRouter
