const mongoose = require('mongoose');

const CountrySchema = mongoose.Schema({
   country_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 charecters']
   },
   description: {
      type: String,
      maxlength: [200, 'cannot exceed 200 charecters']
   },
   date: {
      type: Date,
      default: Date.now
   }
});

const Country = mongoose.model('Country', CountrySchema);

module.exports = Country;
