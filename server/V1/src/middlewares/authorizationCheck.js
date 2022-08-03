const JWT = require('jsonwebtoken');
const httpStatus = require('http-status');

//authenticate admin
const authenticateToken = (req, res, next) => {
  //const token = req.headers?.token;
  //console.log(req.cookies)
  const { token } = req.cookies;
  if (!token) return res.status(httpStatus.UNAUTHORIZED).send({ message: 'Access denied' });
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) return res.status(httpStatus.FORBIDDEN).send(err);
    //console.log("user => ", user);
    if (!user?._doc?.isAdmin) return res.status(httpStatus.UNAUTHORIZED).send({ message: 'You are not allowed to acccess this resource' });
    req.user = user?._doc;
    next();
  });
};

module.exports = authenticateToken;
