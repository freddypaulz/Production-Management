const express = require('express');
const router = express.Router();
const MeasuringUnits = require('../models/Measuring_Unit');

router.get('/measuring-units', (req, res) => {
   MeasuringUnits.find({}).then(MeasuringUnits => {
      res.send({ MeasuringUnits });
   });
});

router.post('/measuring-unit', (req, res) => {
   MeasuringUnits.find({ _id: req.body._id }).then(MeasuringUnit => {
      res.send({ MeasuringUnit });
   });
});

router.post('/measuring-unit-name', (req, res) => {
   MeasuringUnits.find({
      measuring_unit_name: req.body.measuring_unit_name
   }).then(MeasuringUnit => {
      res.send({ MeasuringUnit });
   });
});

router.post('/add-measuring-unit', (req, res) => {
   const { measuring_unit_name, description } = req.body;
   let errors = [];

   if (!measuring_unit_name) {
      errors.push('Enter all required fields');
   }

   if (measuring_unit_name.length > 20) {
      errors.push('Use 20 or less characters for country name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      MeasuringUnits.findOne({ measuring_unit_name }).then(MeasuringUnit => {
         if (MeasuringUnit) {
            errors.push('MeasuringUnit name already taken');
            res.send({ errors });
         } else {
            const newMeasuringUnit = new MeasuringUnits({
               measuring_unit_name,
               description
            });
            newMeasuringUnit.save().then(MeasuringUnit => {
               return res.send({ MeasuringUnit, errors });
            });
         }
      });
   }
});

router.post('/edit-measuring-unit', (req, res) => {
   const { _id, measuring_unit_name, description } = req.body;
   let errors = [];

   if (!measuring_unit_name) {
      errors.push('Enter all required fields');
   }
   if (measuring_unit_name.length > 20) {
      errors.push('Use 20 or less characters for country Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (measuring_unit_name) {
      MeasuringUnits.find({ measuring_unit_name }, { _id: 1 }).then(
         MeasuringUnit => {
            if (typeof MeasuringUnit[0] !== 'undefined') {
               if (MeasuringUnit[0]._id != _id) {
                  errors.push('MeasuringUnit Name must be unique');
               }
            }

            if (errors.length > 0) {
               res.send({ errors });
            } else {
               MeasuringUnits.findOneAndUpdate(
                  { _id },
                  {
                     measuring_unit_name,
                     description
                  }
               ).then(MeasuringUnit => {
                  if (!MeasuringUnit) {
                     errors.push('MeasuringUnits Not found');
                     res.send({ errors });
                  } else {
                     res.send({ MeasuringUnit, errors });
                  }
               });
            }
         }
      );
   }
});

router.post('/delete-measuring-unit', (req, res) => {
   MeasuringUnits.findOneAndDelete({
      measuring_unit_name: req.body.measuring_unit_name
   }).then(MeasuringUnit => {
      res.send(MeasuringUnit);
   });
});

module.exports = router;
