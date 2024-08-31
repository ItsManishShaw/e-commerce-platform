const Order = require('../models/Order');

exports.processPayments = async (req, res) => {
  const { orderId, payementDetails } = req.body;
  try {
    if (!orderId || !paymentDetails) {
      return res
        .status(400)
        .json({ message: 'Order ID and payment details are required.' });
    }
    //
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'order not found!' });
    //update the order
    order.status = 'Paid';
    await order.save();
    res.status(200).json({ message: 'Payment successfully', order });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'error processing the payments',
    });
  }
};
