const mongoose = require('mongoose');

const VendorSchema = mongoose.Schema({
   vendor_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 characters']
   },
   vendor_location: {
      type: String,
      required: true
   },
   vendor_tax_no: {
      type: String,
      required: true
   },
   vendor_mobile_no: {
      type: Number,
      required: true
   },
   vendor_email: {
      type: String
   },
   vendor_address: {
      type: String,
      maxlength: [50, 'cannot exceed 50 characters']
   },
   vendor_country: {
      type: String
   },
   vendor_state: {
      type: String
   },
   vendor_city: {
      type: String
   },
   vendor_postal_code: {
      type: String
   },
   vendor_point_of_contact: {
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

const Vendors = mongoose.model('Vendors', VendorSchema);

module.exports = Vendors;
