const mongoose = require('mongoose');

const MaterialTypeSchema = mongoose.Schema({
   material_type_name: {
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

const MaterialType = mongoose.model('MaterialType', MaterialTypeSchema);

module.exports = MaterialType;
