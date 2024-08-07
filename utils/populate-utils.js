const fs = require('fs')
const path = require('path')

/**
 * Reads JSON data from a file and returns it.
 * @returns {Promise<Object[]>} The job data.
 */
const getJobData = () => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'jobs.json')

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err)
            }

            try {
                const jsonData = JSON.parse(data)
                resolve(jsonData)
            } catch (parseError) {
                reject(parseError)
            }
        })
    })
}

module.exports = { getJobData }
