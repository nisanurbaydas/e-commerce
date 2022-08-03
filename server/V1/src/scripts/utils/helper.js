const CryptoJS = require('crypto-js');
const JWT = require('jsonwebtoken');

const passwordToHash = (password) => {
  const hashKey = CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH).toString();
  return CryptoJS.HmacSHA256(password, hashKey).toString();
};

const generateJWTAccessToken = (user) => {
  return JWT.sign({ name: user.email, ...user }, process.env.ACCESS_TOKEN_SECRET_KEY);
};

const generateJWTRefreshToken = (user) => {
  return JWT.sign({ name: user.email, ...user }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1w' });
};

const checkSecureFile = (mimeType) => {
  return mimeType.includes('image/');
};

const getResetPasswordToken = (user) => {
  return JWT.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: Date.now() + 30 * 60 * 1000 });
};

module.exports = {
  passwordToHash,
  generateJWTAccessToken,
  generateJWTRefreshToken,
  checkSecureFile,
  getResetPasswordToken,
};
