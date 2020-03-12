const express = require('express');
const router = express.Router();
const WorkLocations = require('../models/WorkLocation');

router.get('/work-locations', (req, res, next) => {
   WorkLocations.find({}).then(WorkLocations => {
      res.send({ WorkLocations });
   });
});

router.post('/work-location', (req, res, next) => {
   WorkLocations.find({ _id: req.body._id }).then(WorkLocation => {
      res.send({ WorkLocation });
   });
});

router.post('/work-location-name', (req, res, next) => {
   WorkLocations.find({ work_location_name: req.body.work_location_name }).then(
      WorkLocation => {
         res.send({ WorkLocation });
      }
   );
});

router.post('/add-work-location', (req, res) => {
   console.log('Hello');
   const { work_location_name, description } = req.body;
   let errors = [];

   if (!work_location_name) {
      errors.push('Enter all required fields');
   }

   if (work_location_name.length > 20) {
      errors.push('Use 20 or less characters for work_location name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      WorkLocations.findOne({ work_location_name }).then(WorkLocation => {
         if (WorkLocation) {
            errors.push('WorkLocation name already taken');
            res.send({ errors });
         } else {
            const newWorkLocation = new WorkLocations({
               work_location_name,
               description
            });
            newWorkLocation.save().then(WorkLocation => {
               return res.send({ WorkLocation, errors });
            });
         }
      });
   }
});

router.post('/edit-work-location', (req, res) => {
   const { _id, work_location_name, description } = req.body;
   let errors = [];

   if (!work_location_name) {
      errors.push('Enter all required fields');
   }
   if (work_location_name.length > 20) {
      errors.push('Use 20 or less characters for work_location Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (work_location_name) {
      WorkLocations.find({ work_location_name }, { _id: 1 }).then(
         WorkLocation => {
            if (typeof WorkLocation[0] !== 'undefined') {
               if (WorkLocation[0]._id != _id) {
                  errors.push('WorkLocation Name must be unique');
               }
            }

            if (errors.length > 0) {
               res.send({ errors });
            } else {
               WorkLocations.findOneAndUpdate(
                  { _id },
                  {
                     work_location_name,
                     description
                  }
               ).then(WorkLocation => {
                  if (!WorkLocation) {
                     errors.push('WorkLocation Not found');
                     res.send({ errors });
                  } else {
                     res.send({ WorkLocation, errors });
                  }
               });
            }
         }
      );
   }
});

router.post('/delete-work-location', (req, res) => {
   WorkLocations.findOneAndDelete({
      work_location_name: req.body.work_location_name
   }).then(WorkLocation => {
      res.send(WorkLocation);
   });
});

module.exports = router;
