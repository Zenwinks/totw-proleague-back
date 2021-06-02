const pool = require('.././db')

const getAllPlayers = (request, response) => {
  pool.query('SELECT pl.id, pl.name, pl.team, pl.country, pl.nb_titu, pl.nb_sub, pl.nb_total, array_to_string(array_agg(po.label),\',\') AS positions \n' +
    'FROM players pl\n' +
    'LEFT JOIN players_positions pp\n' +
    'ON pl.id=pp.player_id\n' +
    'LEFT JOIN positions po\n' +
    'ON pp.position_id=po.id\n' +
    'GROUP BY pl.id, pl.name, pl.team, pl.country, pl.nb_titu, pl.nb_sub, pl.nb_total')
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

const createPlayer = (request, response) => {
  const formData = request.body
  let name = formData.name
  let team = formData.team
  let country = formData.country
  pool.query('INSERT INTO players(name, team, country) VALUES($1, $2, $3)', [name, team, country])
    .then(res => {
      pool.query('SELECT pl.id, pl.name, pl.team, pl.country, pl.nb_titu, pl.nb_sub, pl.nb_total, array_to_string(array_agg(po.label),\',\') AS positions \n' +
        'FROM players pl\n' +
        'LEFT JOIN players_positions pp\n' +
        'ON pl.id=pp.player_id\n' +
        'LEFT JOIN positions po\n' +
        'ON pp.position_id=po.id\n' +
        'GROUP BY pl.id, pl.name, pl.team, pl.country, pl.nb_titu, pl.nb_sub, pl.nb_total')
        .then(res2 => {
          let players = res2.rows.map(row => {
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
    })
}

module.exports = {
  getAllPlayers
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
