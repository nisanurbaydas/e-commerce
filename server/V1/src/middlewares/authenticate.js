const JWT = require('jsonwebtoken');
const httpStatus = require('http-status');

const authenticateToken = (req, res, next) => {
  // const token = req.headers?.authorization?.split(' ')[1] || null;
  const { token } = req.cookies;
  if (token === null)
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: 'Access Denied',
    });
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    //console.log(token);
    if (err) return res.status(httpStatus.FORBIDDEN).send({ message: 'Login first to access this resource.' });
    req.user = user?._doc;
    next();
  });
};

module.exports = authenticateToken;
