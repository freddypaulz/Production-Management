const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema({
   employee_first_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 characters']
   },
   employee_middle_name: {
      type: String,
      maxlength: [20, 'cannot exceed 20 characters']
   },
   employee_last_name: {
      type: String,
      required: true,
      maxlength: [20, 'cannot exceed 20 characters']
   },
   employee_dob: {
      type: Date,
      required: true
   },
   employee_age: {
      type: Number,
      required: true
   },
   employee_gender: {
      type: String,
      required: true
   },
   employee_mobile_no: {
      type: Number,
      required: true
   },
   employee_email: {
      type: String
   },
   employee_father_or_spouse_name: {
      type: String,
      required: true
   },
   employee_no_of_children: {
      type: Number
   },
   employee_address: {
      type: String,
      maxlength: [50, 'cannot exceed 50 characters']
   },
   employee_country: {
      type: String
   },
   employee_state: {
      type: String
   },
   employee_city: {
      type: String
   },
   employee_postal_code: {
      type: String
   },
   employee_id: {
      type: String,
      required: true
   },
   employee_date_of_joinig: {
      type: Date,
      required: true
   },
   employee_designation: {
      type: String,
      required: true
   },
   employee_salary: {
      type: Number,
      required: true
   },
   employee_work_location: {
      type: String,
      required: true
   },
   employee_shift: {
      type: String,
      required: true
   },
   employee_bank_account_no: {
      type: Number,
      required: true
   },
   employee_bank_name: {
      type: String,
      required: true
   },
   employee_bank_branch: {
      type: String,
      required: true
   },
   employee_bank_ifsc: {
      type: String,
      required: true
   },
   date: {
      type: Date,
      default: Date.now
   }
});

const Employees = mongoose.model('Employees', EmployeeSchema);

module.exports = Employees;
