var jwt = require('jsonwebtoken');
var config = require('../config/keys');
function verifyToken(req, res, next) {
  var token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  var arr = token.split(" ");
  if(arr.length <2){
    return res.status(403).send({ auth: false, message: 'Invalid Token.' });
  }
  jwt.verify(arr[1], config.secretOrKey, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.body.userId = decoded.id;
    next();
  });
}
module.exports = verifyToken;