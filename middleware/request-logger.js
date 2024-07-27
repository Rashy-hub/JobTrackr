function logRequest(req, res, next) {
    const method = req.method
    const url = req.url
    const startTime = Date.now()
    console.log(req.url)

    res.on('finish', () => {
        const statusCode = res.statusCode
        const elapsedTime = Date.now() - startTime
        console.log(`${method} ${url} - ${statusCode} - ${elapsedTime}ms`)
    })

    next()
}

module.exports = logRequest
