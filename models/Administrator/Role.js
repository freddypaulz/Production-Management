const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
   role_name: {
      type: String,
      require: [true, 'Please add a Name'],
      maxlength: [20, 'cannot exceed 20 charecters']
   },
   description: {
      type: String,
      maxlength: [200, 'cannot exceed 200 charecters']
   },
   permissions: {
      type: Array,
      require: [true, 'Please select one or more permissions']
   },
   date: {
      type: Date,
      default: Date.now
   }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
