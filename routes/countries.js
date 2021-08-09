const pool = require('.././db')

const getAllCountries = (request, response) => {
  pool.query('SELECT c.id, c.name, (select count(*) from players where country_id = c.id) as nbplayers FROM countries c')
    .then(res => response.status(200).json(res.rows))
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des nationalités impossible")
    })
}

const createCountry = (request, response) => {
  pool.query("INSERT INTO countries(id, name) VALUES(uuid_generate_v4(), $1)", [request.body.name])
    .then(() => {
      pool.query('SELECT c.id, c.name, (select count(*) from players where country_id = c.id) as nbplayers FROM countries c')
        .then(res => response.status(200).json(res.rows))
        .catch(err => {
          console.error(err)
          response.status(500).json("Récupération des nationalités impossible")
        })
    })
    .catch(err => {
      console.error(err)
      response.status(500).json("Insertion de la nationalité impossible")
    })
}

const updateCountry = (request, response) => {
  pool.query("UPDATE countries SET name = $1 WHERE id = $2", [request.body.name, request.body.id])
    .then(() => response.status(200).json("Nationalité modifiée avec succès."))
    .catch(err => {
      console.error(err)
      response.status(500).json("Modification de la nationalité impossible")
    })
}

const deleteCountry = (request, response) => {
  pool.query("DELETE FROM countries WHERE id = $1", [request.params.id])
    .then(() => response.status(200).json("Nationalité supprimée avec succès."))
    .catch(err => {
      console.error(err)
      response.status(500).json("Suppression de la nationalité impossible")
    })
}

module.exports = {
  getAllCountries,
  createCountry,
  updateCountry,
  deleteCountry
}
