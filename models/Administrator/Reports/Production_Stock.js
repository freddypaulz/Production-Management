const mongoose = require("mongoose");
const Production_Stock_Schema = mongoose.Schema({
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

  date: { type: Date, default: Date.now }
});

const Production_Stock = mongoose.model(
  "Production_Stock",
  Production_Stock_Schema
);

module.exports = Production_Stock;
