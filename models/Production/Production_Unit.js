const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema({
  Raw_Material_Code: { type: String, required: true },
  Raw_Material_Id: { type: String, required: true },
  Quantity: { type: Number, required: true },
  Measuring_Unit: { type: String, required: true },
  Priority: { type: String, required: true },
  Due_Date: { type: Date, required: true },
  Status: { type: String, required: true },
  Comments: { type: String },
  date: { type: Date, default: Date.now },
  Created_By: {
    type: Object,
    required: true,
    Employee_Id: { type: String, required: true },
    Role_Id: { type: String, required: true }
  }
});

const production_unit = mongoose.model("production_unit", schema);

module.exports = production_unit;
