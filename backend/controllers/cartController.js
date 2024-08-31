const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: 'Product not found!' });
    if (!cart) cart = new Cart({ user: req.user.id, items: [], total: 0 });
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    cart.total += product.price * quantity;
    await cart.save();

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await cart.findById({ user: req.user.id });
    const product = await product.findById(productId);
    if (!cart || !product)
      res.status(404).json({ message: 'Product or Cart not found!' });
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: 'Item not found!' });
    const oldQuantity = item.quantity;
    item.quantity = quantity;
    cart.quantity = quantity;
    cart.total += product.price * (quantity - oldQuantity);

    await cart.save();
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'internal server error' });
  }
};

exports.removeCartItems = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findById({ user: req.user.id });
    const product = await Product.findById(productId);
    if (!cart || !product)
      return res.status(404).json({ message: 'Cart or Product not found!' });
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: 'Item not found!' });
    cart.items = cart.items.filter(
      (item) => item.product.toString() === productId
    );
    await cart.save();
    res.status(200).json({ message: 'items removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product'
    );
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.status(200).json({ cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'error fetching the user cart. . .' });
  }
};
