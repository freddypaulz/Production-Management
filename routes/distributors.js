const express = require('express');
const router = express.Router();
const Distributors = require('../models/Distributor');

router.get('/distributors', (req, res, next) => {
   Distributors.find({}).then(Distributors => {
      res.send({ Distributors });
   });
});

router.post('/distributor', (req, res) => {
   Distributors.find({ _id: req.body._id }).then(Distributor => {
      res.send({ Distributor });
   });
});

router.post('/distributor-name', (req, res) => {
   Distributors.find({ distributor_name: req.body.distributor_name }).then(
      Distributor => {
         res.send({ Distributor });
      }
   );
});

router.post('/add-distributor', (req, res) => {
   const {
      distributor_name,
      distributor_location,
      distributor_tax_no,
      distributor_mobile_no,
      distributor_email,
      distributor_address,
      distributor_country,
      distributor_state,
      distributor_city,
      distributor_postal_code,
      distributor_point_of_contact,
      description
   } = req.body;
   let errors = [];

   if (
      !distributor_name ||
      !distributor_location ||
      !distributor_tax_no ||
      !distributor_mobile_no ||
      !distributor_point_of_contact
   ) {
      errors.push('Enter all required fields');
   }

   if (distributor_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (distributor_tax_no.length > 20) {
      errors.push('Use 20 or less characters for distributor tax number');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Distributors.findOne({ distributor_name }).then(Distributor => {
         if (Distributor) {
            errors.push('Distributor name already taken');
            res.send({ errors });
         } else {
            const newDistributor = new Distributors({
               distributor_name,
               distributor_location,
               distributor_tax_no,
               distributor_mobile_no,
               distributor_email,
               distributor_address,
               distributor_country,
               distributor_state,
               distributor_city,
               distributor_postal_code,
               distributor_point_of_contact,
               description
            });
            newDistributor.save().then(Distributor => {
               return res.send({ Distributor, errors });
            });
         }
      });
   }
});

router.post('/edit-distributor', (req, res) => {
   const {
      _id,
      distributor_name,
      distributor_location,
      distributor_tax_no,
      distributor_mobile_no,
      distributor_email,
      distributor_address,
      distributor_country,
      distributor_state,
      distributor_city,
      distributor_postal_code,
      distributor_point_of_contact,
      description
   } = req.body;
   let errors = [];

   if (
      !distributor_name ||
      !distributor_location ||
      !distributor_tax_no ||
      !distributor_mobile_no ||
      !distributor_point_of_contact
   ) {
      errors.push('Enter all required fields');
   }

   if (distributor_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (distributor_tax_no.length > 20) {
      errors.push('Use 20 or less characters for distributor tax number');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }

   if (distributor_name) {
      Distributors.find({ distributor_name }).then(Distributor => {
         if (typeof Distributor[0] !== 'undefined') {
            if (Distributor[0]._id != _id) {
               errors.push('Distributor name must be unique');
            }
         }
         if (errors.length > 0) {
            return res.send({ errors });
         } else {
            Distributors.findOneAndUpdate(
               { _id },
               {
                  distributor_name,
                  distributor_location,
                  distributor_tax_no,
                  distributor_mobile_no,
                  distributor_email,
                  distributor_address,
                  distributor_country,
                  distributor_state,
                  distributor_city,
                  distributor_postal_code,
                  distributor_point_of_contact,
                  description
               }
            )
               .then(Distributor => {
                  if (!Distributor) {
                     errors.push('Distributor Not found');
                     return res.send({ errors });
                  } else {
                     return res.send({ Distributor, errors });
                  }
               })
               .catch(err => {
                  return res.send(err);
               });
         }
      });
   }
});

router.post('/delete-distributor', (req, res) => {
   Distributors.findOneAndDelete({ _id: req.body._id }).then(Distributor => {
      res.send(Distributor);
   });
});

module.exports = router;
