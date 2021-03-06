//Imports
const express = require('express')
const app = express()
const middleware = require('./middleware/auth')

// Middleware
app.use(express.json())

// CORS middleware
const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
}

//Routes
const auth = require('./routes/auth')
const players = require('./routes/players')
const totw = require('./routes/totw')
const teams = require('./routes/teams')
const countries = require('./routes/countries')
const positions = require('./routes/positions')
const users = require('./routes/users')

app.use(allowCrossDomain)

//Appels Joueurs
app.get('/players', middleware, players.getAllPlayers)
app.post('/players', middleware, players.createPlayer)
app.patch('/players/:id', middleware, players.updatePlayer)
app.delete('/players/:id', middleware, players.deletePlayer)
app.get('/players/:totw', middleware, players.getPlayersByTotw)
app.get('/playersWithPositions', middleware, players.getAllPlayersWithPositions)

//Appels TOTW
app.get('/totw-count', middleware, totw.getCount)
app.get('/totws', middleware, totw.getAllTotws)
app.post('/add-totw', middleware, totw.createTotw)

//Appels Teams
app.get('/teams', middleware, teams.getAllTeams)
app.post('/teams', middleware, teams.createTeam)
app.patch('/teams/:id', middleware, teams.updateTeam)
app.delete('/teams/:id', middleware, teams.deleteTeam)

//Appels Teams
app.get('/countries', middleware, countries.getAllCountries)
app.post('/countries', middleware, countries.createCountry)
app.patch('/countries/:id', middleware, countries.updateCountry)
app.delete('/countries/:id', middleware, countries.deleteCountry)

//Appels Positions
app.get('/positions', middleware, positions.getAllPositions)
app.post('/positions', middleware, positions.createPosition)
app.patch('/positions/:id', middleware, positions.updatePosition)
app.delete('/positions/:id', middleware, positions.deletePosition)

//Appels Users
app.get('/getTeamByUserName/:name', middleware, users.getTeamByUserName)

//Appels Authentification
app.post('/login', auth.login)
app.post('/register', auth.register)

app.listen(3000, () => {
  console.log("Serveur en ??coute")
})

module.exports = app;
