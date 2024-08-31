const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String },
  category: { type: String },
});
productSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Product', productSchema);
