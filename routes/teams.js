const pool = require('.././db')

const getAllTeams = (request, response) => {
  pool.query('SELECT t.id, t.name, (select count(*) from players where team_id = t.id) as nbplayers FROM teams t')
    .then(res => response.status(200).json(res.rows))
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des équipes impossible")
    })
}

const createTeam = (request, response) => {
  pool.query("INSERT INTO teams(id, name) VALUES(uuid_generate_v4(), $1)", [request.body.name])
    .then(() => {
      pool.query('SELECT t.id, t.name, (select count(*) from players where team_id = t.id) as nbplayers FROM public.teams t')
        .then(res => response.status(200).json(res.rows))
        .catch(err => {
          console.error(err)
          response.status(500).json("Récupération des équipes impossible")
        })
    })
    .catch(err => {
      console.error(err)
      response.status(500).json("Insertion de l'équipe impossible")
    })
}

const updateTeam = (request, response) => {
  pool.query("UPDATE teams SET name = $1 WHERE id = $2", [request.body.name, request.body.id])
    .then(() => response.status(200).json("Équipe modifiée avec succès."))
    .catch(err => {
      console.error(err)
      response.status(500).json("Modification de l'équipe impossible")
    })
}

const deleteTeam = (request, response) => {
  pool.query("DELETE FROM teams WHERE id = $1", [request.params.id])
    .then(() => response.status(200).json("Équipe supprimée avec succès."))
    .catch(err => {
      console.error(err)
      response.status(500).json("Suppression de l'équipe impossible")
    })
}

module.exports = {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam
}
