const {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
} = require('../utils/auth');
const User = require('../models/User');
const sendEmail = require('../utils/email');
const logger = require('../utils/logger');

//Register a new User
exports.Register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const HashedPassword = await hashPassword(password);
    const newUser = new User({ email, password: hashPassword });
    await newUser.save();
    await sendEmail(
      user.email,
      'Registration successful',
      'Welcome to our E-commerce platform!'
    );
    res.status(201).json({ message: 'User registered successfully', user });
    logger.info('User Registration successful');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await user.findOne({ email });
    if (!user) res.status(404).json({ message: 'User not found!' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) res.status(404).json({ message: 'Invalid Credentials' });

    const token = generateToken(user);
    res.token({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
