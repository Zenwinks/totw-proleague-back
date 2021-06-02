const pool = require('.././db')

const getAllFormations = (request, response) => {
  pool.query('SELECT * FROM formations')
    .then(res => response.status(200).json(res.rows))
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des compos impossible")
    })
}

module.exports = {
  getAllFormations
}
