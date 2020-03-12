const mongoose = require('mongoose');

const CitySchema = mongoose.Schema({
   city_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 characters']
   },
   state_id: {
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

const City = mongoose.model('City', CitySchema);

module.exports = City;
