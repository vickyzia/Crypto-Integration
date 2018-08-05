// middleware for doing role-based permissions
module.exports = function permit(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1;
    
    // return a middleware
    return (req, res, next) => {
      if (req.body && isAllowed(req.body.role))
        next(); // role is allowed, so continue on the next middleware
      else {
        res.status(403).json({message: "Forbidden"}); // user is forbidden
      }
    }
  }