const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    Purchase_List: { type: Array, required: true },
    Purchase_Id: { type: String, required: true },
    Total_Quantity: { type: Number, required: true },
    Measuring_Unit: { type: String, required: true },
    Date: { type: Date, default: Date.now }
})

const purchaseStock = mongoose.model('purchase_stock', stockSchema)

module.exports = purchaseStock; 