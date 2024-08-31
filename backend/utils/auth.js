const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

//funcion to generate a jwt token
const generateToken = () => {
  return jwt.sign(
    {
      _id: 'testuser',
      email: 'test@example.com',
    },
    secretKey,
    {
      expiresIn: '1h',
    }
  );
};

//function to verify a JWT token
const verifyToken = (token) => {
  try {
    console.log({ secretKey });
    console.log('generatedToken:', generateToken());
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log('Token verification failed: ', error);
    return null;
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
