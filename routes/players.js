const pool = require('.././db')

const getAllPlayers = (request, response) => {
  pool.query('SELECT p.id, p.name, t.name as team, c.name as country, (select count(*) from totws where player_id = p.id) as nbtotws FROM players p\n' +
    'inner join teams t on p.team_id = t.id\n' +
    'inner join countries c on p.country_id = c.id\n' +
    'ORDER BY t.name ASC, p.name ASC;')
    .then(res => response.status(200).json(res.rows))
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des joueurs impossible")
    })
}

const createPlayer = (request, response) => {
  pool.query('INSERT INTO players(id, name, team_id, country_id) VALUES(uuid_generate_v4(), $1, $2, $3)', [
    request.body.name,
    request.body.team.id,
    request.body.country.id,
  ])
    .then(res => {
      pool.query('SELECT p.id, p.name, t.name as team, c.name as country, (select count(*) from totws where player_id = p.id) as nbtotws FROM players p\n' +
        'inner join teams t on p.team_id = t.id\n' +
        'inner join countries c on p.country_id = c.id\n' +
        'ORDER BY t.name ASC, p.name ASC;')
        .then(res2 => response.status(200).json(res2.rows))
        .catch(err => {
          console.error(err)
          response.status(500).json("Récupération des joueurs impossible")
        })
    })
    .catch(err => {
      console.error(err)
      response.status(500).json("Création du joueur impossible")
    })
}

const updatePlayer = (request, response) => {
  pool.query("UPDATE players SET name = $1, team_id = $2, country_id = $3 WHERE id = $4", [
    request.body.name,
    request.body.team.id,
    request.body.country.id,
    request.body.id
  ])
    .then(() => response.status(200).json("Joueur modifié avec succès."))
    .catch(err => {
      console.error(err)
      response.status(500).json("Modification du joueur impossible")
    })
}

const deletePlayer = (request, response) => {
  pool.query("DELETE FROM players WHERE id = $1", [request.params.id])
    .then(() => response.status(200).json("Joueur supprimé avec succès."))
    .catch(err => {
      console.error(err)
      response.status(500).json("Suppression du joueur impossible")
    })
}

const getPlayersByTotw = (request, response) => {
  pool.query('SELECT p.id, p.name, t.name as team, c.name as country, tt.istitu, tt.ispotw, po.label as position FROM players p\n' +
    'inner join teams t on p.team_id = t.id\n' +
    'inner join countries c on p.country_id = c.id\n' +
    'inner join totws tt on p.id = tt.player_id\n' +
    'inner join positions po on tt.position_id = po.id\n' +
    'where tt.totw = $1\n' +
    'ORDER BY t.name ASC, p.name ASC;', [request.params.totw])
    .then(res => {
      let titus = []
      let subs = []
      res.rows.forEach(player => {
        if (player.istitu) {
          titus.push(player)
        } else {
          subs.push(player)
        }
      })
      response.status(200).json({titus: titus, subs: subs})
    })
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des joueurs en fonction de la TOTW impossible")
    })
}

const getAllPlayersWithPositions = (request, response) => {
  pool.query('select DISTINCT pl.id, pl.name, array_to_string(array_agg(po.label),\',\') as positions, te.name as team, c.name as country, coalesce((\n' +
    '\tSELECT COUNT(*) FROM totws t2 \n' +
    '\tINNER JOIN players pl2 on t2.player_id=pl2.id \n' +
    '\tWHERE t2.istitu = true AND t2.player_id = pl.id\n' +
    '\tGROUP BY t2.player_id, pl2.name order by pl2.name asc\n' +
    '),0) as nb_titu, coalesce((\n' +
    '\tSELECT COUNT(*) FROM totws t3 \n' +
    '\tINNER JOIN players pl3 on t3.player_id = pl3.id \n' +
    '\tWHERE t3.istitu = false AND t3.player_id = pl.id\n' +
    '\tGROUP BY t3.player_id, pl3.name order by pl3.name asc\n' +
    '),0) as nb_sub, (\n' +
    '\tSELECT COUNT(*) FROM totws t4 \n' +
    '\tINNER JOIN players pl4 on t4.player_id = pl4.id \n' +
    '\tWHERE t4.player_id = pl.id\n' +
    '\tGROUP BY t4.player_id, pl4.name order by pl4.name asc\n' +
    ') as nb_total, coalesce((\n' +
    '\tSELECT COUNT(*) FROM totws t5 \n' +
    '\tINNER JOIN players pl5 on t5.player_id = pl5.id \n' +
    '\tWHERE t5.ispotw = true AND t5.player_id = pl.id\n' +
    '\tGROUP BY t5.player_id, pl5.name order by pl5.name asc\n' +
    '),0) as nb_potw from players pl\n' +
    'inner join totws t on pl.id = t.player_id\n' +
    'inner join positions po on t.position_id = po.id\n' +
    'inner join teams te on pl.team_id = te.id\n' +
    'inner join countries c on pl.country_id = c.id\n' +
    'group by pl.id, te.name, c.name order by te.name ASC')
    .then(res => {
      let players = res.rows.map(row => {
        let positionsTab = row.positions.split(',')
        if (positionsTab[0] !== '') {
          let results = foo(positionsTab)
          let newPositions = ''
          results[0].forEach((elem, index) => {
            if (index + 1 < results[0].length) {
              newPositions += elem + ' x' + results[1][index] + ', '
            } else {
              newPositions += elem + ' x' + results[1][index]
            }
          })
          row.positions = newPositions
        }
        return row
      })
      response.status(200).json(players)
    })
    .catch(err => {
      console.error(err)
      response.status(500).json("Récupération des joueurs impossible")
    })
}

module.exports = {
  getAllPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayersWithPositions,
  getPlayersByTotw
}

function foo (arr) {
  var a = [], b = [], prev

  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i])
      b.push(1)
    } else {
      b[b.length - 1]++
    }
    prev = arr[i]
  }

  return [a, b]
}
