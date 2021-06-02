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

app.use(allowCrossDomain)

//Appels Joueurs
app.get('/players', middleware, players.getAllPlayers)

//Appels TOTW
app.get('/totw-count', middleware, totw.getCount)

//Appels Authentification
app.post('/login', auth.login)
app.post('/register', auth.register)

app.listen(3000, () => {
  console.log("Serveur en écoute")
})

module.exports = app;
