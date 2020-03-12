const express = require('express');
const router = express.Router();
const MaterialTypes = require('../models/Material_Type');

router.get('/material-types', (req, res, next) => {
   MaterialTypes.find({}).then(MaterialTypes => {
      res.send({ MaterialTypes });
   });
});

router.post('/material-type', (req, res, next) => {
   MaterialTypes.find({ _id: req.body._id }).then(MaterialType => {
      res.send({ MaterialType });
   });
});

router.post('/material-type-name', (req, res, next) => {
   MaterialTypes.find({ material_type_name: req.body.material_type_name }).then(
      MaterialType => {
         res.send({ MaterialType });
      }
   );
});

router.post('/add-material-type', (req, res) => {
   const { material_type_name, description } = req.body;
   let errors = [];

   if (!material_type_name) {
      errors.push('Enter all required fields');
   }

   if (material_type_name.length > 20) {
      errors.push('Use 20 or less characters for material_type name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      MaterialTypes.findOne({ material_type_name }).then(MaterialType => {
         if (MaterialType) {
            errors.push('MaterialType name already taken');
            res.send({ errors });
         } else {
            const newMaterialType = new MaterialTypes({
               material_type_name,
               description
            });
            newMaterialType.save().then(MaterialType => {
               return res.send({ MaterialType, errors });
            });
         }
      });
   }
});

router.post('/edit-material-type', (req, res) => {
   const { _id, material_type_name, description } = req.body;
   let errors = [];

   if (!material_type_name) {
      errors.push('Enter all required fields');
   }
   if (material_type_name.length > 20) {
      errors.push('Use 20 or less characters for material_type Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (material_type_name) {
      MaterialTypes.find({ material_type_name }, { _id: 1 }).then(
         material_type => {
            if (typeof material_type[0] !== 'undefined') {
               if (material_type[0]._id != _id) {
                  errors.push('MaterialType Name must be unique');
               }
            }

            if (errors.length > 0) {
               res.send({ errors });
            } else {
               MaterialTypes.findOneAndUpdate(
                  { _id },
                  {
                     material_type_name,
                     description
                  }
               ).then(MaterialType => {
                  if (!MaterialType) {
                     errors.push('MaterialType Not found');
                     res.send({ errors });
                  } else {
                     res.send({ MaterialType, errors });
                  }
               });
            }
         }
      );
   }
});

router.post('/delete-material-type', (req, res) => {
   MaterialTypes.findOneAndDelete({
      material_type_name: req.body.material_type_name
   }).then(MaterialType => {
      res.send(MaterialType);
   });
});

module.exports = router;
