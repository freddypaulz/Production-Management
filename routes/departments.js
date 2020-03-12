const express = require('express');
const router = express.Router();
const Departments = require('../models/Department');

router.get('/departments', (req, res) => {
   Departments.find({}).then(Departments => {
      res.send({ Departments });
   });
});

router.post('/department', (req, res) => {
   Departments.find({ _id: req.body._id }).then(Department => {
      res.send({ Department });
   });
});

router.post('/department-name', (req, res) => {
   Departments.find({
      department_name: req.body.department_name
   }).then(Department => {
      res.send({ Department });
   });
});

router.post('/add-department', (req, res) => {
   const { department_name, description } = req.body;
   let errors = [];

   if (!department_name) {
      errors.push('Enter all required fields');
   }

   if (department_name.length > 20) {
      errors.push('Use 20 or less characters for department name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Departments.findOne({ department_name }).then(Department => {
         if (Department) {
            errors.push('Department name already taken');
            res.send({ errors });
         } else {
            const newDepartment = new Departments({
               department_name,
               description
            });
            newDepartment.save().then(Department => {
               return res.send({ Department, errors });
            });
         }
      });
   }
});

router.post('/edit-department', (req, res) => {
   const { _id, department_name, description } = req.body;
   let errors = [];

   if (!department_name) {
      errors.push('Enter all required fields');
   }
   if (department_name.length > 20) {
      errors.push('Use 20 or less characters for department Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (department_name) {
      Departments.find({ department_name }, { _id: 1 }).then(Department => {
         if (typeof Department[0] !== 'undefined') {
            if (Department[0]._id != _id) {
               errors.push('Department Name must be unique');
            }
         }

         if (errors.length > 0) {
            res.send({ errors });
         } else {
            Departments.findOneAndUpdate(
               { _id },
               {
                  department_name,
                  description
               }
            ).then(Department => {
               if (!Department) {
                  errors.push('Department Not found');
                  res.send({ errors });
               } else {
                  res.send({ Department, errors });
               }
            });
         }
      });
   }
});

router.post('/delete-department', (req, res) => {
   Departments.findOneAndDelete({
      department_name: req.body.department_name
   }).then(Department => {
      res.send(Department);
   });
});

module.exports = router;
