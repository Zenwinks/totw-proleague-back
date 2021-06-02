const pool = require('.././db')

const getAllPositions = (request, response) => {
  pool.query('SELECT * FROM positions')
    .then(res => response.status(200).json(res.rows))
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des postes impossible")
    })
}

module.exports = {
  getAllPositions
}
