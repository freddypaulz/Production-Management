const mongoose = require('mongoose');

const WorkLocationSchema = mongoose.Schema({
   work_location_name: {
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

const WorkLocation = mongoose.model('WorkLocation', WorkLocationSchema);

module.exports = WorkLocation;
