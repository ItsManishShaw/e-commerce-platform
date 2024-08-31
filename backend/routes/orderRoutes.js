const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const {
  deleteOrder,
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getOrdersByUserId,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');

//create a new order
router.post('/', authMiddleware, createOrder);
router.get('/:orderId', authMiddleware, getOrderById);
//update order status (adminOnly)
router.get('/orderId', authMiddleware, adminMiddleware, updateOrderStatus);
router.delete('/orderId', authMiddleware, adminMiddleware, deleteOrder);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
//admin route to get the all the orders of an user
router.get(
  '/user/:userId/orders',
  authMiddleware,
  adminMiddleware,
  getOrdersByUserId
);

router.patch('/cancel/:orderId', authMiddleware, cancelOrder);

module.exports = router;
