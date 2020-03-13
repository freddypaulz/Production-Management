const mongoose = require("mongoose");
const Production_Schema = mongoose.Schema({
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
    unique: true,
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

const Production = mongoose.model("Production", Production_Schema);

module.exports = Production;
