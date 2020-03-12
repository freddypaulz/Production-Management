const express = require('express');
const router = express.Router();
const RawMaterials = require('../models/Raw_Materials');

router.get('/raw-materials', (req, res, next) => {
   RawMaterials.find({}).then(RawMaterials => {
      res.send({ RawMaterials });
   });
});

router.post('/raw-material', (req, res) => {
   RawMaterials.find({ _id: req.body._id }).then(RawMaterial => {
      res.send({ RawMaterial });
   });
});

router.post('/raw-material-name', (req, res) => {
   RawMaterials.find({ raw_material_name: req.body.raw_material_name }).then(
      RawMaterial => {
         res.send({ RawMaterial: RawMaterial });
      }
   );
});

router.post('/add-raw-material', (req, res) => {
   console.log('Hello');
   const {
      raw_material_name,
      raw_material_code,
      raw_material_type,
      raw_material_measuring_unit,
      description
   } = req.body;
   let errors = [];

   if (
      !raw_material_name ||
      !raw_material_code ||
      !raw_material_type ||
      !raw_material_measuring_unit
   ) {
      errors.push('Enter all required fields');
   }

   if (raw_material_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (raw_material_code.length > 20) {
      errors.push('Use 20 or less characters for raw material ID');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }

   if (errors.length > 0) {
      res.send({ errors });
   } else {
      RawMaterials.findOne({ raw_material_name }).then(RawMaterial => {
         if (RawMaterial) {
            errors.push('RawMaterial name already taken');
            res.send({ errors });
         } else {
            const newRawMaterial = new RawMaterials({
               raw_material_name,
               raw_material_code,
               raw_material_type,
               raw_material_measuring_unit,
               description
            });
            newRawMaterial.save().then(RawMaterial => {
               return res.send({ RawMaterial, errors });
            });
         }
      });
   }
});

router.post('/edit-raw-material', (req, res) => {
   const {
      _id,
      raw_material_name,
      raw_material_code,
      raw_material_type,
      raw_material_measuring_unit,
      description
   } = req.body;
   let errors = [];

   if (
      !raw_material_name ||
      !raw_material_code ||
      !raw_material_type ||
      !raw_material_measuring_unit
   ) {
      errors.push('Enter all required fields');
   }

   if (raw_material_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (raw_material_code.length > 20) {
      errors.push('Use 20 or less characters for raw material ID');
   }
   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (raw_material_name) {
      RawMaterials.find({ raw_material_name }).then(rawMaterial => {
         if (typeof rawMaterial[0] !== 'undefined') {
            if (rawMaterial[0]._id != _id) {
               errors.push('Raw Material name must be unique');
            }
         }
         if (errors.length > 0) {
            return res.send({ errors });
         } else {
            console.log('else');
            RawMaterials.findOneAndUpdate(
               { _id },
               {
                  raw_material_name,
                  raw_material_code,
                  raw_material_type,
                  raw_material_measuring_unit,
                  description
               }
            ).then(RawMaterial => {
               if (!RawMaterial) {
                  errors.push('Raw Material Not found');
                  return res.send({ errors });
               } else {
                  return res.send({ RawMaterial, errors });
               }
            });
         }
      });
   }
});

router.post('/delete-raw-material', (req, res) => {
   RawMaterials.findOneAndDelete({ _id: req.body._id }).then(RawMaterial => {
      res.send(RawMaterial);
   });
});

module.exports = router;
