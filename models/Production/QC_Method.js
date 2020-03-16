const mongoose = require("mongoose");

const MethodSchema = mongoose.Schema({
  Method_Name: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    maxlength: [200, "cannot exceed 200 charecters"]
  },
  Value: {
    type: Boolean,
    default: false
  }
});

const QC_Method = mongoose.model("QC_Method", MethodSchema);

module.exports = QC_Method;
