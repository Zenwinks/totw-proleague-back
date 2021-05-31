const pool = require('.././db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//Connexion d'un utilisateur
const login = (request, response) => {
  const formData = request.body;
  var name = formData.name;
  var password = formData.password;
  pool.query('SELECT * FROM users WHERE name = $1', [name])
    .then(res => {
      if (res.rowCount > 0) {
        if (bcrypt.compareSync(password, res.rows[0].password)) {
          response.status(200).json({
            user: {
              id: res.rows[0].id,
              name: res.rows[0].name,
              isAdmin: res.rows[0].isAdmin
            },
            token: jwt.sign(
              {userId: res.rows[0].id},
              'RANDOM_TOKEN_SECRET',
              {expiresIn: '24h'}
            )
          });
        } else {
          return response.status(401).json({error: 'Mot de passe incorrect !'});
        }
      } else {
        return response.status(401).json({error: 'Utilisateur ' + name + ' non trouvé !'});
      }
    })
    .catch(err => console.log(err))
}

//Inscription d'un utilisateur
const register = (request, response) => {
  const formData = request.body;
  var name = formData.name;
  var password = bcrypt.hashSync(formData.password, 8);
  var isAdmin = formData.isAdmin;
  pool.query('INSERT INTO users(name, password, isAdmin) VALUES ($1, $2, $3);', [name, password, isAdmin])
    .then(res => response.status(200).json({success: 'Utilisateur créé'}))
    .catch(err => response.status(401).json({error: 'Impossible de créer le profil'}))
}

module.exports = {
  login,
  register
}
