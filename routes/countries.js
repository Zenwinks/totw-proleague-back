const pool = require('.././db')

const getAllCountries = (request, response) => {
  pool.query('SELECT * FROM countries')
    .then(res => response.status(200).json(res.rows))
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des équipes impossible")
    })
}

module.exports = {
  getAllCountries
}
