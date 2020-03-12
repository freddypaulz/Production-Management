const express = require('express');
const router = express.Router();
const Countries = require('../models/Country');

router.get('/countries', (req, res, next) => {
   Countries.find({}).then(Countries => {
      res.send({ Countries });
   });
});

router.post('/country', (req, res, next) => {
   Countries.find({ _id: req.body._id }).then(Country => {
      res.send({ Country });
   });
});

router.post('/country-name', (req, res, next) => {
   Countries.find({ country_name: req.body.country_name }).then(Country => {
      res.send({ Country });
   });
});

router.post('/add-country', (req, res) => {
   console.log('Hello');
   const { country_name, description } = req.body;
   let errors = [];

   if (!country_name) {
      errors.push('Enter all required fields');
   }

   if (country_name.length > 20) {
      errors.push('Use 20 or less characters for country name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Countries.findOne({ country_name }).then(Country => {
         if (Country) {
            errors.push('Country name already taken');
            res.send({ errors });
         } else {
            const newCountry = new Countries({
               country_name,
               description
            });
            newCountry.save().then(Country => {
               return res.send({ Country, errors });
            });
         }
      });
   }
});

router.post('/edit-country', (req, res) => {
   const { _id, country_name, description } = req.body;
   let errors = [];

   if (!country_name) {
      errors.push('Enter all required fields');
   }
   if (country_name.length > 20) {
      errors.push('Use 20 or less characters for country Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (country_name) {
      Countries.find({ country_name }, { _id: 1 }).then(country => {
         if (typeof country[0] !== 'undefined') {
            if (country[0]._id != _id) {
               errors.push('Country Name must be unique');
            }
         }

         if (errors.length > 0) {
            res.send({ errors });
         } else {
            Countries.findOneAndUpdate(
               { _id },
               {
                  country_name,
                  description
               }
            ).then(Country => {
               if (!Country) {
                  errors.push('Country Not found');
                  res.send({ errors });
               } else {
                  res.send({ Country, errors });
               }
            });
         }
      });
   }
});

router.post('/delete-country', (req, res) => {
   Countries.findOneAndDelete({ country_name: req.body.country_name }).then(
      Country => {
         res.send(Country);
      }
   );
});

module.exports = router;
