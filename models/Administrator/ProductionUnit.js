const mongoose = require('mongoose');

const ProductionUnitSchema = mongoose.Schema({
   production_unit_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 charecters']
   },
   description: {
      type: String,
      maxlength: [200, 'cannot exceed 200 charecters']
   },
   date: {
      type: Date,
      default: Date.now
   }
});

const ProductionUnit = mongoose.model('ProductionUnit', ProductionUnitSchema);

module.exports = ProductionUnit;
