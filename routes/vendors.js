const express = require('express');
const router = express.Router();
const Vendors = require('../models/Vendor');

router.get('/vendors', (req, res, next) => {
   Vendors.find({}).then(Vendors => {
      res.send({ Vendors });
   });
});

router.post('/vendor', (req, res) => {
   Vendors.find({ _id: req.body._id })
      .then(Vendor => {
         res.send({ Vendor });
      })
      .catch(err => {
         res.send('Problem Loading vendor');
      });
});

router.post('/vendor-name', (req, res) => {
   Vendors.find({ vendor_name: req.body.vendor_name }).then(Vendor => {
      res.send({ Vendor });
   });
});

router.post('/add-vendor', (req, res) => {
   const {
      vendor_name,
      vendor_location,
      vendor_tax_no,
      vendor_mobile_no,
      vendor_email,
      vendor_address,
      vendor_country,
      vendor_state,
      vendor_city,
      vendor_postal_code,
      vendor_point_of_contact,
      description
   } = req.body;
   let errors = [];

   if (
      !vendor_name ||
      !vendor_location ||
      !vendor_tax_no ||
      !vendor_mobile_no ||
      !vendor_point_of_contact
   ) {
      errors.push('Enter all required fields');
   }

   if (vendor_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (vendor_tax_no.length > 20) {
      errors.push('Use 20 or less characters for vendor tax number');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Vendors.findOne({ vendor_name }).then(Vendor => {
         if (Vendor) {
            errors.push('Vendor name already taken');
            res.send({ errors });
         } else {
            const newVendor = new Vendors({
               vendor_name,
               vendor_location,
               vendor_tax_no,
               vendor_mobile_no,
               vendor_email,
               vendor_address,
               vendor_country,
               vendor_state,
               vendor_city,
               vendor_postal_code,
               vendor_point_of_contact,
               description
            });
            newVendor.save().then(Vendor => {
               return res.send({ Vendor, errors });
            });
         }
      });
   }
});

router.post('/edit-vendor', (req, res) => {
   const {
      _id,
      vendor_name,
      vendor_location,
      vendor_tax_no,
      vendor_mobile_no,
      vendor_email,
      vendor_address,
      vendor_country,
      vendor_state,
      vendor_city,
      vendor_postal_code,
      vendor_point_of_contact,
      description
   } = req.body;
   let errors = [];

   if (
      !vendor_name ||
      !vendor_location ||
      !vendor_tax_no ||
      !vendor_mobile_no ||
      !vendor_point_of_contact
   ) {
      errors.push('Enter all required fields');
   }

   if (vendor_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (vendor_tax_no.length > 20) {
      errors.push('Use 20 or less characters for vendor tax number');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }

   if (vendor_name) {
      Vendors.find({ vendor_name }).then(Vendor => {
         if (typeof Vendor[0] !== 'undefined') {
            if (Vendor[0]._id != _id) {
               errors.push('Vendor name must be unique');
            }
         }
         if (errors.length > 0) {
            return res.send({ errors });
         } else {
            Vendors.findOneAndUpdate(
               { _id },
               {
                  vendor_name,
                  vendor_location,
                  vendor_tax_no,
                  vendor_mobile_no,
                  vendor_email,
                  vendor_address,
                  vendor_country,
                  vendor_state,
                  vendor_city,
                  vendor_postal_code,
                  vendor_point_of_contact,
                  description
               }
            )
               .then(Vendor => {
                  if (!Vendor) {
                     errors.push('Vendor Not found');
                     return res.send({ errors });
                  } else {
                     return res.send({ Vendor, errors });
                  }
               })
               .catch(err => {
                  return res.send(err);
               });
         }
      });
   }
});

router.post('/delete-vendor', (req, res) => {
   Vendors.findOneAndDelete({ _id: req.body._id }).then(Vendor => {
      res.send(Vendor);
   });
});

module.exports = router;
