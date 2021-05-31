const pool = require('.././db')

const getAllPlayers = (request, response) => {
  pool.query('SELECT * FROM players')
    .then(res => response.status(200).json(res.rows))
    .catch(err => console.error(err))
}

module.exports = {
  getAllPlayers
}
