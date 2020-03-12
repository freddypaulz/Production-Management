const mongoose = require('mongoose');
const Productions_Schema = mongoose.Schema({
   Product_ID: {
      type: String,
      required: true
   },
   Product_Name: {
      type: String,
      required: true
   },
   Batch_Id: {
      type: String,
      required: true
   },
   Quantity: {
      type: Number,
      required: true
   },
   Measuring_Unit: {
      type: String,
      required: true
   },
   Expiry_Duration_Days: {
      type: Number,
      required: true
   },
   Manufacture_Date: {
      type: Date,
      required: true
   },
   Status: {
      type: String
   },
   date: { type: Date, default: Date.now }
});

const Productions = mongoose.model('Productions', Productions_Schema);

module.exports = Productions;
