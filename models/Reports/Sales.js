const mongoose = require("mongoose");
const Sales_Schema = mongoose.Schema({
  Product_ID: {
    type: String,
    required: true
  },
  Product_Name: {
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
  Selling_Date: {
    type: Date,
    required: true
  },
  Box_Id: {
    type: Array,
    required: true
  },
  Distributor: {
    type: String,
    required: true
  },
  Payment_Type: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  Final_Price: {
    type: Number,
    required: true
  },
  Discount: {
    type: Number,
    required: true
  },
  Advance: {
    type: Number,
    required: true
  },
  Balance: {
    type: Number,
    required: true
  },
  date: { type: Date, default: Date.now }
});

const Sales = mongoose.model("Sales", Sales_Schema);

module.exports = Sales;
