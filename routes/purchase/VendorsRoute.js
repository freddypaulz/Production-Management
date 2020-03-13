const express = require('express');
const router = express.Router();
const Vendors = require('../../models/Administrator/Vendor');

router.get('/', (req, res, next) => {
   Vendors.find({}).then(Vendors => {
      res.send({ Vendors });
   });
});

router.post('/', (req, res) => {
   Vendors.find({ _id: req.body._id })
      .then(Vendor => {
         res.send({ Vendor });
      })
      .catch(err => {
         res.send('Problem Loading vendor');
      });
});

router.post('/name', (req, res) => {
   Vendors.find({ _id: req.body._id })
      .then(vendor => {
         res.send(vendor[0].vendor_name);
      })
      .catch(err => console.log(err));
});

module.exports = router;
