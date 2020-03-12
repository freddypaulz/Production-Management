const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   employee_id: {
      type: String,
      require: true
   },
   name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 charecters']
   },
   password: {
      type: String,
      required: true
   },
   role: {
      type: String,
      required: true
   },
   date: {
      type: Date,
      default: Date.now
   }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
