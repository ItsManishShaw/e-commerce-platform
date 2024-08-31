const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const adminMiddlewares = require('../middlewares/adminMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const Product = require('../models/Product');

router.get('/', (req, res) => {
  console.log(req, 'Welcome to the product routes');
  res.json({ message: req });
});
router.post(
  '/create',
  authMiddleware,
  adminMiddlewares,
  productController.createProduct
);
router.get('/', adminMiddlewares, productController.getAllProducts);
router.get('/:productId', productController.getProductDetails);
router.put(
  '/:productId',
  authMiddleware,
  adminMiddlewares,
  productController.updateProductDetails
);
router.delete(
  '/:productId',
  authMiddleware,
  adminMiddlewares,
  productController.deleteProduct
);
//search route
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({ $text: { $search: { query } } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error!' });
  }
});
//filtering
router.get('/filter', async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (minPrice) filter.minPrice = minPrice;
    if (maxPrice) filter.maxPrice = maxPrice;
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//pagination
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
