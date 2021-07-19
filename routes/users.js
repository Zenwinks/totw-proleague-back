const pool = require('.././db')

const getTeamByUserName = (request, response) => {
  pool.query('select t.name from users u inner join players p on u.name = p.name inner join teams t on p.team_id = t.id where u.name = $1', [request.params.name])
    .then(res => response.status(200).json(res.rows[0]))
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des joueurs impossible")
    })
}

module.exports = {
  getTeamByUserName
}
