const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
   Raw_Material_Code: { type: String, required: true },
   Raw_Material_Id: { type: String, required: true },
   Quantity: { type: Number, required: true },
   Measuring_Unit: { type: String, required: true },
   Priority: { type: String, required: true },
   Due_Date: { type: Date, required: true },
   Status: { type: String, required: true },
   Comments: { type: String, default: 'no comments' },
   date: { type: Date, default: Date.now },
   Total_Price: { type: Number },
   Vendor: { type: String },
   Quotation_Document_URL: { type: Array },
   Created_By: {
      type: Object,
      required: true,
      Employee_Id: { type: String, required: true },
      Role_Id: { type: String, required: true },
   },
   Invoice_Quantity: { type: Number },
   Invoice_Measuring_Unit: { type: String },
   Id_Type: { type: String },
   Id: { type: Array },
   Invoice_Amount: { type: Number },
   Invoice_Date: { type: Date },
   Invoice_Document: { type: Array },
});

const request_details = mongoose.model('Request_Details', schema);

module.exports = request_details;
