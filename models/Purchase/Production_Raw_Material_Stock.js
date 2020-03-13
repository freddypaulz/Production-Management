const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema({
  Raw_Material_Id: { type: String, required: true },
  Raw_Material_Code: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Measuring_Unit: { type: String, required: true },
  Id_Type: { type: String },
  Id: { type: Array },
  date: { type: Date, default: Date.now }
});

const Production_Raw_Material_Stock = mongoose.model(
  "Production_Raw_Material_Stock",
  schema
);

module.exports = Production_Raw_Material_Stock;
