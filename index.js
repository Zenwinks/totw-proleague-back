//Import
const express = require('express')
const app = express()
const pool = require('./db')

// Middleware
app.use(express.json())

app.get('/players', function (request, response) {
  pool.query('SELECT * FROM public.players;')
    .then(res => response.status(200).json(res.rows))
    .catch(err => console.error(err))
})

app.listen(3000, () => {
  console.log("Serveur en écoute")
})

module.exports = app;
