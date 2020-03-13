const mongoose = require("mongoose");
const Wastage_Schema = mongoose.Schema({
  Raw_Material_Id: {
    type: String,
    required: true
  },
  Raw_Material_Code: {
    type: String,
    required: true
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
const Purchase_Wastages = mongoose.model(
  "purchase_wastages",
  Wastage_Schema
);

module.exports = Purchase_Wastages;
