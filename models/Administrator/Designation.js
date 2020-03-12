const mongoose = require('mongoose');

const DesignationSchema = mongoose.Schema({
   designation_name: {
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

const Designation = mongoose.model('Designation', DesignationSchema);

module.exports = Designation;
