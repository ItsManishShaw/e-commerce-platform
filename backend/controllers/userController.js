const User = require('../models/User');

//get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); //excluding the password from the response

    if (!user) return res.status(404).json({ message: 'user not found' });

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || 'Error retrieving the user profile' });
  }
};

