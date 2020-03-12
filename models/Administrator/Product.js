const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
   product_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 characters']
   },
   product_code: {
      type: String,
      required: true
   },
   product_price: {
      type: Number,
      required: true
   },
   product_registration_date: {
      type: Date
   },
   product_measuring_unit: {
      type: String,
      required: true
   },
   description: {
      type: String,
      maxlength: [200, 'cannot exceed 200 characters']
   },
   date: {
      type: Date,
      default: Date.now
   }
});

const Products = mongoose.model('Products', ProductSchema);

module.exports = Products;
