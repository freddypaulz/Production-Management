const mongoose = require('mongoose');

const BoxSchema = mongoose.Schema({
   box_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 characters']
   },

   box_size: {
      type: Number,
      required: true
   },

   description: {
      type: String,
      maxlength: [200, 'cannot exceed 200 characters']
   },
   date: {
      type: Date,
      default: Date.now
   }
});

const Box = mongoose.model('Box', BoxSchema);

module.exports = Box;
