const mongoose = require('mongoose');

const ShiftSchema = mongoose.Schema({
   shift_name: {
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

const Shift = mongoose.model('Shift', ShiftSchema);

module.exports = Shift;
