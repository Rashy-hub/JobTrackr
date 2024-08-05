const axios = require('axios')
// Fonction pour faire une requête à soi-même
//SELF_URL='http:/localhost:8080/api/wakeup'
const { SELF_URL } = process.env
const wakeUpSelf = async () => {
    try {
        const response = await axios.get(SELF_URL)

        console.log(`Requête envoyée à ${SELF_URL} pour éviter la mise en veille ${response.data}`)
    } catch (error) {
        console.error(`Erreur lors de la requête à ${SELF_URL}:`, error)
    }
}

module.exports = { wakeUpSelf }
