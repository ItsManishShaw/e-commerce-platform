const Product = require('../models/Product');

//create new Product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, desc } = req.body;
    const newProduct = new Product({ name, price, desc });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || 'Failed to create the product!!' });
  }
};

//get allProducts
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.send(500).json({ message: err.message });
  }
};

//get ProductDetails
exports.getProductDetails = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: 'Product not found!' });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'failed to retrieve the product details',
    });
  }
};

//update a productdetails(admin only)
exports.updateProductDetails = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: 'Product not found!' });
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to retrieve the product details',
    });
  }
};

//delete product(admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product)
      return res.status(404).json({ message: 'Product not found!' });
    res.status(200).json({ message: 'Product deleted successfully', product });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'failed to delete the product!' });
  }
};
