const express = require('express');
const router = express.Router();
const Shifts = require('../models/Shift');

router.get('/shifts', (req, res, next) => {
   Shifts.find({}).then(shifts => {
      res.send({ Shifts: shifts });
   });
});

router.post('/shift', (req, res, next) => {
   Shifts.find({ _id: req.body._id }).then(shift => {
      res.send({ shift });
   });
});

router.post('/shift-name', (req, res, next) => {
   Shifts.find({ shift_name: req.body.shift_name }).then(shift => {
      res.send({ Shift: shift });
   });
});

router.post('/add-shift', (req, res) => {
   console.log('Hello');
   const { shift_name, description } = req.body;
   let errors = [];

   if (!shift_name) {
      errors.push('Enter all required fields');
   }

   if (shift_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for Name');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Shifts.findOne({ shift_name }).then(Shift => {
         if (Shift) {
            errors.push('Shift name already taken');
            res.send({ errors });
         } else {
            const newShift = new Shifts({
               shift_name,
               description
            });
            newShift.save().then(Shift => {
               return res.send({ Shift, errors });
            });
         }
      });
   }
   console.log('Hello');
});

router.post('/edit-shift', (req, res) => {
   const { _id, shift_name, description } = req.body;
   let errors = [];

   if (!shift_name) {
      errors.push('Enter all required fields');
   }
   if (shift_name.length > 20) {
      errors.push('Use 20 or less characters for shift Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (shift_name) {
      Shifts.find({ shift_name }).then(Shift => {
         if (typeof Shift[0] !== 'undefined') {
            if (Shift[0]._id != _id) {
               errors.push('Shift Name must be unique');
            }
         }

         if (errors.length > 0) {
            res.send({ errors });
         } else {
            Shifts.findOneAndUpdate(
               { _id },
               {
                  shift_name,
                  description
               }
            ).then(Shift => {
               if (!Shift) {
                  errors.push('Shift Not found');
                  res.send({ errors });
               } else {
                  res.send({ Shift, errors });
               }
            });
         }
      });
   }
});

router.post('/delete-shift', (req, res) => {
   Shifts.findOneAndDelete({ shift_name: req.body.shift_name }).then(Shift => {
      res.send(Shift);
   });
});

module.exports = router;
