const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const paymentController = require('../controllers/paymentController');

router.post('/process', authMiddleware, paymentController.processPayments);

module.exports = router;
