const pool = require('.././db')

const getCount = (request, response) => {
  pool.query('SELECT COUNT(*) FROM totws')
    .then(res => {
      response.status(200).json(parseInt(res.rows[0].count) + 1)
    })
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des joueurs impossible")
    })
}

const createTotw = (request, response) => {
  const formData = request.body
  let label = formData.label
  let compo = formData.compo
  let players = formData.players

}

module.exports = {
  getCount
}
