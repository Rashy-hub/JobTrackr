const axios = require('axios')
// Fonction pour faire une requête à soi-même
//SELF_URL='http:/localhost:8080/api/wakeup'

const wakeUpSelf = async () => {
    try {
        const response = await axios.get(`https://${process.env.RENDER_EXTERNAL_URL}`)

        console.log(`Requête envoyée à ${`https://${process.env.RENDER_EXTERNAL_URL}`} pour éviter la mise en veille ${response.data}`)
    } catch (error) {
        console.error(`Erreur lors de la requête à ${`https://${process.env.RENDER_EXTERNAL_URL}`}:`, error)
    }
}

module.exports = { wakeUpSelf }
