const mongoose = require('mongoose');

const CurrencySchema = mongoose.Schema({
   currency_type: {
      type: String,
      maxlength: [10, 'cannot exceed 10 charecters'],
   },
   currency_separator: {
      type: String,
      maxlength: [1, 'cannot exceed 1 charecters'],
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;
