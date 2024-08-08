const axios = require('axios')
// Fonction pour faire une requête à soi-même
//SELF_URL='http:/localhost:8080/api/wakeup'

const wakeUpSelf = async () => {
    try {
        const response = await axios.get('https://jobtrackr-backend.onrender.com/api/wakeup')

        console.log(`Requête envoyée à https://jobtrackr-backend.onrender.com/api/wakeup pour éviter la mise en veille ${response.data}`)
    } catch (error) {
        console.error(`Erreur lors de la requête à "https://jobtrackr-backend.onrender.com/api/wakeup":`, error)
    }
}

module.exports = { wakeUpSelf }
