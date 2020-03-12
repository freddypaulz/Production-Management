const mongoose = require('mongoose');

const StateSchema = mongoose.Schema({
   state_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 characters']
   },
   country_id: {
      type: String,
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

const State = mongoose.model('State', StateSchema);

module.exports = State;
