const express = require('express');
const router = express.Router();
const Boxes = require('../models/Box');

router.get('/boxes', (req, res, next) => {
   Boxes.find({}).then(Boxes => {
      res.send({ Boxes });
   });
});

router.post('/box', (req, res, next) => {
   Boxes.find({ _id: req.body._id }).then(box => {
      res.send({ box });
   });
});

router.post('/add-box', (req, res) => {
   const { box_name, box_size, description } = req.body;
   let errors = [];

   if (!box_name || !box_size) {
      errors.push('Enter all required fields');
   }

   if (box_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (description.length > 200) {
      errors.push('Use 200 or less characters for Description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Boxes.findOne({ box_name }).then(Box => {
         if (Box) {
            errors.push('Box name already taken');
            res.send({ errors });
         } else {
            const newBox = new Boxes({
               box_name,
               box_size,
               description
            });
            newBox.save().then(Box => {
               return res.send({ Box, errors });
            });
         }
      });
   }
});

router.post('/edit-box', (req, res) => {
   const { _id, box_name, box_size, description } = req.body;
   let errors = [];

   if (!box_name || !box_size) {
      errors.push('Enter all required fields');
   }
   if (box_name.length > 20) {
      errors.push('Use 20 or less characters for box Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (box_name) {
      Boxes.find({ box_name }).then(box => {
         if (typeof box[0] !== 'undefined') {
            if (box[0]._id != _id) {
               errors.push('Box name must be unique');
            }
         }
         if (errors.length > 0) {
            return res.send({ errors });
         } else {
            console.log('else');
            Boxes.findOneAndUpdate(
               { _id },
               {
                  box_name,
                  box_size,
                  description
               }
            ).then(Box => {
               if (!Box) {
                  errors.push('box Not found');
                  return res.send({ errors });
               } else {
                  return res.send({ Box, errors });
               }
            });
         }
      });
   }
});

router.post('/delete-box', (req, res) => {
   Boxes.findOneAndDelete({ _id: req.body._id }).then(Box => {
      res.send(Box);
   });
});

module.exports = router;
