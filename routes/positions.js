const pool = require('.././db')

const getAllPositions = (request, response) => {
  pool.query('SELECT p.id, p.label, (select COUNT(DISTINCT t.player_id) from totws t where t.position_id = p.id) as nbplayers FROM positions p')
    .then(res => response.status(200).json(res.rows))
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des postes impossible")
    })
}

const createPosition = (request, response) => {
  pool.query("INSERT INTO positions(label) VALUES($1)", [request.body.label])
    .then(() => {
      pool.query('SELECT p.id, p.label, (select COUNT(DISTINCT t.player_id) from totws t where t.position_id = p.id) as nbplayers FROM positions p')
        .then(res => response.status(200).json(res.rows))
        .catch(err => {
          console.error(err)
          response.status(500).json("Récupération des postes impossible")
        })
    })
    .catch(err => {
      console.error(err)
      response.status(500).json("Insertion du poste impossible")
    })
}

const updatePosition = (request, response) => {
  pool.query("UPDATE positions SET label = $1 WHERE id = $2", [request.body.label, request.body.id])
    .then(() => response.status(200).json("Poste modifié avec succès."))
    .catch(err => {
      console.error(err)
      response.status(500).json("Modification du poste impossible")
    })
}

const deletePosition = (request, response) => {
  pool.query("DELETE FROM positions WHERE id = $1", [request.params.id])
    .then(() => response.status(200).json("Poste supprimé avec succès."))
    .catch(err => {
      console.error(err)
      response.status(500).json("Suppression du poste impossible")
    })
}

module.exports = {
  getAllPositions,
  createPosition,
  updatePosition,
  deletePosition
}
