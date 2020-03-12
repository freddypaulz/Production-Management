const mongoose = require('mongoose');

const DistributorSchema = mongoose.Schema({
   distributor_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 characters']
   },
   distributor_location: {
      type: String,
      required: true
   },
   distributor_tax_no: {
      type: String,
      required: true
   },
   distributor_mobile_no: {
      type: Number,
      required: true
   },
   distributor_email: {
      type: String
   },
   distributor_address: {
      type: String,
      maxlength: [50, 'cannot exceed 50 characters']
   },
   distributor_country: {
      type: String
   },
   distributor_state: {
      type: String
   },
   distributor_city: {
      type: String
   },
   distributor_postal_code: {
      type: String
   },
   distributor_point_of_contact: {
      type: Array
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

const Distributors = mongoose.model('Distributors', DistributorSchema);

module.exports = Distributors;
