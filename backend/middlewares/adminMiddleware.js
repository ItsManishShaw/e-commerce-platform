//middlewares/adminMiddlewares
const adminMiddlewares = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') next();
  } catch (error) {
    res.status(403).json({ message: 'Access Denied, Admin only!' });
  }
};

module.exports = adminMiddlewares;


