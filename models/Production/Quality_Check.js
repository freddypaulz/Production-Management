const mongoose = require("mongoose");
const Qualitycheck_Schema = mongoose.Schema({
  QC_Type: {
    type: String,
    required: true
  },
  Product_Name: {
    type: String,
    required: true
  },
  Product_ID: {
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
  Id_Type: {
    type: String
  },
  Id: {
    type: Array
  },
  QC_Id: {
    type: String
  },
  Box_Id: {
    type: Array
  },
  I_Capacity: {
    type: Number
  },
  B_Capacity: {
    type: Number
  },
  QC_Date: {
    type: String
  },
  Method: {
    type: Array
  },
  Result: {
    type: String,
    required: true
  },
  Comments: {
    type: String
  },
  Status: {
    type: String
  },
  date: { type: Date, default: Date.now }
});
const Qualitycheck = mongoose.model("Qualitycheck", Qualitycheck_Schema);

module.exports = Qualitycheck;
