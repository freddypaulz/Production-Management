const mongoose = require('mongoose');

const ProductCodeSchema = mongoose.Schema({
   code_prefix: {
      type: String,
      maxlength: [10, 'cannot exceed 10 charecters']
   },
   code_separator: {
      type: String,
      maxlength: [2, 'cannot exceed 2 charecters']
   },
   date: {
      type: Date,
      default: Date.now
   }
});

const ProductCode = mongoose.model('ProductCode', ProductCodeSchema);

module.exports = ProductCode;
