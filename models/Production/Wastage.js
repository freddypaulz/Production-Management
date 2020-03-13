const mongoose = require("mongoose");
const Wastage_Schema = mongoose.Schema({
  Wastage_Type: {
    type: String,
    required: true
  },
  Product_Name: {
    type: String
    // required: true
  },
  Raw_Material_Id: {
    type: String
    // required: true
  },
  Product_ID: {
    type: String
  },
  raw_material_code: {
    type: String
  },
  Quantity: {
    type: Number,
    required: true
  },
  Id_Type: {
    type: String,
    required: true
  },
  Id: {
    type: Array
  },
  Measuring_Unit: {
    type: String,
    required: true
  },
  Wastage_Date: {
    type: String
  },
  Description: {
    type: String
  },
  date: { type: Date, default: Date.now }
});
const Production_Wastages = mongoose.model(
  "Production_Wastages",
  Wastage_Schema
);

module.exports = Production_Wastages;
