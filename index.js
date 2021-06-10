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
const formations = require('./routes/formations')
const teams = require('./routes/teams')
const countries = require('./routes/countries')
const positions = require('./routes/positions')

app.use(allowCrossDomain)

//Appels Joueurs
app.get('/players', middleware, players.getAllPlayers)
app.get('/playersWithPositions', middleware, players.getAllPlayersWithPositions)
app.post('/add-player', middleware, players.create)

//Appels TOTW
app.get('/totw-count', middleware, totw.getCount)
app.post('/add-totw', middleware, totw.create)

//Appels Formations
app.get('/formations', middleware, formations.getAllFormations)

//Appels Teams
app.get('/teams', middleware, teams.getAllTeams)

//Appels Teams
app.get('/countries', middleware, countries.getAllCountries)

//Appels Positions
app.get('/positions', middleware, positions.getAllPositions)

//Appels Authentification
app.post('/login', auth.login)
app.post('/register', auth.register)

app.listen(3000, () => {
  console.log("Serveur en écoute")
})

module.exports = app;
