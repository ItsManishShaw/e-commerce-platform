const Order = require('../models/Order');
const Product = require('../models/Product');

//create new order
exports.createOrder = async (req, res) => {
  try {
    const { productIDs } = req.body;

    //find the products by there id's
    const products = await Product.find({ _id: { $in: productIDs } });

    //Calculate the total price of the products
    const total = products.reduce((acc, product) => acc + product.price, 0);
    //create new order
    const newOrder = new Order({
      user: req.user.id, //Assuming req.user is set by the authMiddleware
      products: products.map((product) => product._id),
      total,
    });
    await newOrder.save();

    res.status(200).json({
      message: 'Order placed successfully',
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get orders of a specific user
exports.getOrdersByUserId = async (req, res) => {
  try {
    //Find orders by the user _id
    const orders = await Order.find({ user: req.params.userId }).populate(
      'products'
    );

    if (!orders)
      return res.status(404).json({
        message: 'No orders found! ',
      });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all the orders
exports.getAllOrders = async (req, res) => {
  try {
    //find all orders
    const orders = await Order.find().populate('products');
    if (!orders) return res.status(404).json({ message: 'No orders found!' });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update an orderStatus (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; //extracting the orderId from params
    const { status } = req.body;
    //retriving the order by id
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found!' });
    //Find by orderId and update the status
    if (order.user.toString() !== req.user.id || req.user.role !== 'admin')
      return res
        .status(404)
        .json({ message: 'you are not authorized to update this order' });
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) res.status(403).json({ message: 'Order not found!' });
    res.json({
      message: 'Orders status updated successfully',
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//findAndDelete
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    //find the order by Id and delete it

    const order = Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found!' });
    if (req.user.id !== order.user.toString() && req.user.role !== 'admin')
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this order!' });
    //delete the order
    await order.remove();
    res.json({ message: 'Order deleted successfully', order: deleteOrder });
  } catch (err) {
    res.status(500).json({ message: 'server error', err });
  }
};
//getOrderById

exports.getOrderById = async (req, res) => {
  try {
    const order = Order.findById(req.params.orderId).populate('product');
    if (!order) res.status(404).json({ message: 'Order not found' });
    // if authorised , return the order
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to retrieve the order' });
  }
};

// Cancel an order (admin or user who placed the order)
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found!' });

    // Check if the user is allowed to cancel the order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'You are not authorized to cancel this order' });
    }

    // Update the order status to 'Refunded'
    order.status = 'Refunded';
    await order.save();

    res
      .status(200)
      .json({ message: 'Order has been refunded successfully', order });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to cancel the order.' });
  }
};
