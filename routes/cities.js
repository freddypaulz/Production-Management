const express = require('express');
const router = express.Router();
const Cities = require('../models/City');

router.get('/cities', (req, res, next) => {
   Cities.find({}).then(cities => {
      res.send({ Cities: cities });
   });
});

router.post('/city', (req, res, next) => {
   Cities.find({ _id: req.body._id }).then(city => {
      res.send({ city });
   });
});
router.post('/city-state', (req, res, next) => {
   Cities.find({ state_id: req.body.state_id }).then(city => {
      res.send({ city });
   });
});

router.post('/city-name', (req, res, next) => {
   Cities.find({ city_name: req.body.city_name }).then(city => {
      res.send({ City: city });
   });
});

router.post('/add-city', (req, res) => {
   console.log('Hello');
   const { city_name, state_id, description } = req.body;
   let errors = [];

   if (!city_name || !state_id) {
      errors.push('Enter all required fields');
   }

   if (city_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for Name');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Cities.findOne({ city_name }).then(City => {
         if (City) {
            errors.push('City name already taken');
            res.send({ errors });
         } else {
            const newCity = new Cities({
               city_name,
               state_id,
               description
            });
            newCity.save().then(City => {
               return res.send({ City, errors });
            });
         }
      });
   }
   console.log('Hello');
});

router.post('/edit-city', (req, res) => {
   const { _id, city_name, state_id, description } = req.body;
   let errors = [];

   if (!city_name || !state_id) {
      errors.push('Enter all required fields');
   }
   if (city_name.length > 20) {
      errors.push('Use 20 or less characters for city Name');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (city_name) {
      Cities.find({ city_name }).then(city => {
         if (typeof city[0] !== 'undefined') {
            if (city[0]._id != _id) {
               errors.push('City name must be unique');
            }
         }
         if (errors.length > 0) {
            return res.send({ errors });
         } else {
            console.log('else');
            Cities.findOneAndUpdate(
               { _id },
               {
                  city_name,
                  state_id,
                  description
               }
            ).then(City => {
               if (!City) {
                  errors.push('city Not found');
                  return res.send({ errors });
               } else {
                  return res.send({ City, errors });
               }
            });
         }
      });
   }
});

router.post('/delete-city', (req, res) => {
   Cities.findOneAndDelete({ _id: req.body._id }).then(City => {
      res.send(City);
   });
});

module.exports = router;
