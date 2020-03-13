const mongoose = require("mongoose");
const Pre_Production_Schema = mongoose.Schema({
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
  Raw_Material_Details: {
    type: Array
  },
  date: { type: Date, default: Date.now }
});

const Pre_Production = mongoose.model("Pre_Production", Pre_Production_Schema);

module.exports = Pre_Production;
