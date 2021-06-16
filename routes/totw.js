const pool = require('.././db')

const getCount = (request, response) => {
  pool.query('SELECT MAX(totw) as totwcount FROM totws')
    .then(res => {
      if (res.rows[0].totwcount !== null) {
        response.status(200).json(parseInt(res.rows[0].totwcount) + 1)
      } else {
        response.status(200).json(1)
      }
    })
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération du compteur de TOTW impossible")
    })
}

const getAllTotws = (request, response) => {
  pool.query('SELECT DISTINCT totw FROM totws order by totw asc')
    .then(res => {
      pool.query('SELECT * FROM totwpics\n' +
        'WHERE totw IN (SELECT DISTINCT totw FROM totws) order by totw asc')
        .then(res2 => {
          let totws = res.rows
          res.rows.forEach((elem, index) => {
            res2.rows.forEach(elem2 => {
              if (elem.totw === elem2.totw) {
                totws[index].pic = elem2.pic
              }
            })
          })
          response.status(200).json(totws)
        })
        .catch(err => {
          console.error(err)
          response.status(500).json("Récupération des previews de TOTW impossible")
        })
    })
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des TOTW impossible")
    })
}

const create = (request, response) => {
  const formData = request.body
  let titus = formData.titus
  let subs = formData.subs
  let totwCount = formData.totwCount
  try {
    titus.forEach(player => {
      pool.query('insert into totws(player_id, position_id, "isTitu", "isPotw", totw) values($1, $2, true, $3, $4)', [
        player.id,
        player.position.id,
        player.isPotw,
        totwCount
      ])
    })
    subs.forEach(player => {
      pool.query('insert into totws(player_id, position_id, "isTitu", "isPotw", totw) values($1, $2, false, false, $3)', [
        player.id,
        player.position.id,
        totwCount
      ])
    })

    response.status(200).json("Ajout de la TOTW " + totwCount + " réalisé avec succès")
  } catch (e) {
    console.log(e)
    response.status(500).json("Ajout de la TOTW " + totwCount + " impossible")
  }
}

module.exports = {
  getCount,
  getAllTotws,
  create
}
