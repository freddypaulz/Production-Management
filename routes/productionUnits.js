const express = require('express');
const router = express.Router();
const ProductionUnits = require('../models/ProductionUnit');

router.get('/production-units', (req, res) => {
   ProductionUnits.find({}).then(ProductionUnits => {
      res.send({ ProductionUnits });
   });
});

router.post('/production-unit', (req, res) => {
   ProductionUnits.find({ _id: req.body._id }).then(ProductionUnit => {
      res.send({ ProductionUnit });
   });
});

router.post('/production-unit-name', (req, res) => {
   ProductionUnits.find({
      production_unit_name: req.body.production_unit_name
   }).then(ProductionUnit => {
      res.send({ ProductionUnit });
   });
});

router.post('/add-production-unit', (req, res) => {
   const { production_unit_name, description } = req.body;
   let errors = [];

   if (!production_unit_name) {
      errors.push('Enter all required fields');
   }

   if (production_unit_name.length > 20) {
      errors.push('Use 20 or less characters for production_unit name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      ProductionUnits.findOne({ production_unit_name }).then(ProductionUnit => {
         if (ProductionUnit) {
            errors.push('ProductionUnit name already taken');
            res.send({ errors });
         } else {
            const newProductionUnit = new ProductionUnits({
               production_unit_name,
               description
            });
            newProductionUnit.save().then(ProductionUnit => {
               return res.send({ ProductionUnit, errors });
            });
         }
      });
   }
});

router.post('/edit-production-unit', (req, res) => {
   const { _id, production_unit_name, description } = req.body;
   let errors = [];

   if (!production_unit_name) {
      errors.push('Enter all required fields');
   }
   if (production_unit_name.length > 20) {
      errors.push('Use 20 or less characters for production_unit Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (production_unit_name) {
      ProductionUnits.find({ production_unit_name }, { _id: 1 }).then(
         ProductionUnit => {
            if (typeof ProductionUnit[0] !== 'undefined') {
               if (ProductionUnit[0]._id != _id) {
                  errors.push('Production Unit Name must be unique');
               }
            }

            if (errors.length > 0) {
               res.send({ errors });
            } else {
               ProductionUnits.findOneAndUpdate(
                  { _id },
                  {
                     production_unit_name,
                     description
                  }
               ).then(ProductionUnit => {
                  if (!ProductionUnit) {
                     errors.push('ProductionUnit Not found');
                     res.send({ errors });
                  } else {
                     res.send({ ProductionUnit, errors });
                  }
               });
            }
         }
      );
   }
});

router.post('/delete-production-unit', (req, res) => {
   ProductionUnits.findOneAndDelete({
      production_unit_name: req.body.production_unit_name
   }).then(ProductionUnit => {
      res.send(ProductionUnit);
   });
});

module.exports = router;
