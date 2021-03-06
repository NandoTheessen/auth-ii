const router = require('express').Router();
const jwt = require('jsonwebtoken')
const User = require('./User');
const secret = "toss me, but don't tell the elf!";

function protected(req, res, next) {
  const token = req.headers.authorization
  console.log(token)
  if (token) {
    jwt.verify(token, secret, ((err, decodedToken) => {
      if (err) {

        return res
          .status(401)
          .json({ message: 'you shall not pass! not decoded' })
      }
      req.decodedToken = decodedToken
      next()
    }))
  }
  else {
    res.status(401).json({ msg: 'you shall not pass! no token' })
  }
}


router.get('/', protected, (req, res) => {
  console.log(req.decodedToken)
  User.find({ race: req.decodedToken.race })
    .select('-password')
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
