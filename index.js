//Imports
const express = require('express')
const app = express()

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

app.use(allowCrossDomain)

//Appels Joueurs
app.get('/players', players.getAllPlayers)

//Appels Authentification
app.post('/login', auth.login)
app.post('/register', auth.register)

app.listen(3000, () => {
  console.log("Serveur en écoute")
})

module.exports = app;
