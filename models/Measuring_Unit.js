const mongoose = require('mongoose');

const MeasuringUnitSchema = mongoose.Schema({
   measuring_unit_name: {
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

const MeasuringUnit = mongoose.model('MeasuringUnit', MeasuringUnitSchema);

module.exports = MeasuringUnit;
