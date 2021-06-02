const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      // const token = req.headers.authorization.split(' ')[1];
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.userId;
      next();
    } else {
      console.log("Vous n'êtes pas autorisé à accéder à cette ressource")
      res.status(401).json({
        error: "Vous n'êtes pas autorisé à accéder à cette ressource"
      });
    }
  } catch (e) {
    console.log(e)
    res.status(401).json({
      error: "Vous n'êtes pas autorisé à accéder à cette ressource"
    });
  }
};
