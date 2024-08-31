const express = require('express');
const router = express.Router();
const {
  addToCart,
  removeCartItems,
  updateCart,
  getUserCart,
} = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware, addToCart);
router.put('/update', authMiddleware, updateCart);
router.delete('/remove', authMiddleware, removeCartItems);
router.get('/', authMiddleware, getUserCart);
