const express = require('express');
const router = express.Router();
const Designations = require('../models/Designation');

router.get('/designations', (req, res) => {
   Designations.find({}).then(Designations => {
      res.send({ Designations });
   });
});

router.post('/designation', (req, res) => {
   Designations.find({ _id: req.body._id }).then(Designation => {
      res.send({ Designation });
   });
});

router.post('/designation-name', (req, res) => {
   Designations.find({
      designation_name: req.body.designation_name
   }).then(Designation => {
      res.send({ Designation });
   });
});

router.post('/add-designation', (req, res) => {
   const { designation_name, description } = req.body;
   let errors = [];

   if (!designation_name) {
      errors.push('Enter all required fields');
   }

   if (designation_name.length > 20) {
      errors.push('Use 20 or less characters for designation name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Designations.findOne({ designation_name }).then(Designation => {
         if (Designation) {
            errors.push('Designation name already taken');
            res.send({ errors });
         } else {
            const newDesignation = new Designations({
               designation_name,
               description
            });
            newDesignation.save().then(Designation => {
               return res.send({ Designation, errors });
            });
         }
      });
   }
});

router.post('/edit-designation', (req, res) => {
   const { _id, designation_name, description } = req.body;
   let errors = [];

   if (!designation_name) {
      errors.push('Enter all required fields');
   }
   if (designation_name.length > 20) {
      errors.push('Use 20 or less characters for designation Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (designation_name) {
      Designations.find({ designation_name }, { _id: 1 }).then(Designation => {
         if (typeof Designation[0] !== 'undefined') {
            if (Designation[0]._id != _id) {
               errors.push('Designation Name must be unique');
            }
         }

         if (errors.length > 0) {
            res.send({ errors });
         } else {
            Designations.findOneAndUpdate(
               { _id },
               {
                  designation_name,
                  description
               }
            ).then(Designation => {
               if (!Designation) {
                  errors.push('Designation Not found');
                  res.send({ errors });
               } else {
                  res.send({ Designation, errors });
               }
            });
         }
      });
   }
});

router.post('/delete-designation', (req, res) => {
   Designations.findOneAndDelete({
      designation_name: req.body.designation_name
   }).then(Designation => {
      res.send(Designation);
   });
});

module.exports = router;
