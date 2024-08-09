const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secketKey = '';

//funcion to generate a jwt token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secretkey, {
    expiresIn: '1h',
  });
};

//function to verify a JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretkey);
  } catch (error) {
    return error;
  }
};

//funcion to hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

//function to compare password with hashed hashPassword
const comparePassword = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };
