require('dotenv-flow').config() // Load environment variables from .env file

const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
const mongoose = require('mongoose')
const jobRouter = require('./routes/job-route')
const authRouter = require('./routes/auth-route')
const logRequest = require('./middleware/request-logger')
const { registratedRoutes, extractRoutes } = require('./middleware/registratedRoutes')
const { wakeUpSelf } = require('./utils/wakupself')
const profilRouter = require('./routes/profil-route')

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//extract env variables
const { PORT, NODE_ENV, MONGODB_URI, MONGO_LOCAL } = process.env

const port = PORT
let mongoURI = null
// Connect to MongoDB
if (NODE_ENV === 'development') {
    mongoURI = MONGO_LOCAL
} else {
    mongoURI = MONGODB_URI
}

mongoose
    .connect(mongoURI)
    .then(() => console.log(`Connected to MongoDB - Connection string :  ${mongoURI}`))
    .catch((err) => console.error('Error connecting to MongoDB:', err))

// Middleware

app.use(logRequest)
app.use(express.urlencoded({ extended: false }))

// Routes
registratedRoutes.push(jobRouter)
registratedRoutes.push(authRouter)
registratedRoutes.push(profilRouter)

//Enregistrement des routes

app.use('/api', ...registratedRoutes)

// Route pour vérifier le réveil
app.get('/api/wakeup', (req, res) => {
    res.status(200).json('Wakeup call received!')
})

app.use('*', extractRoutes, (req, res) => {
    const errorMessage = 'Page not found.Here are all available (public) routes:'
    const responseBody = {
        error: errorMessage,
        availableRoutes: req.extractedPaths,
    }

    res.status(404).json(responseBody)
})
// Planifier une tâche cron toutes les 14 minutes
// cron.schedule('*/14 * * * *', () => {
// console.log('Envoi de la requête pour éviter la mise en veille...')
//  wakeUpSelf()
//})

app.listen(port, () => {
    console.log(`Server listening on port ${port} - in ${NODE_ENV} environnement`)
})
