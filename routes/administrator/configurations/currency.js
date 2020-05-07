const express = require('express');
const router = express.Router();
const Currency = require('../../../models/Administrator/Configurations/Currency');

router.get('/', (req, res) => {
   Currency.find({}).then((Currency) => {
      res.send({ Currency });
   });
});

router.post('/currency', (req, res, next) => {
   Currency.find({ _id: req.body._id }).then((Currency) => {
      res.send({ Currency });
   });
});

router.post('/add-currency', (req, res) => {
   const { currency_type, currency_separator } = req.body;
   let errors = [];

   if (currency_type.length > 10) {
      errors.push('currency type must be less than 10 characters');
   }

   if (currency_separator.length > 1) {
      errors.push('separator must be 0 or 1 character long');
   }

   if (errors.length > 0) {
      res.send({ errors });
   } else {
      const newCurrency = new Currency({
         currency_type,
         currency_separator,
      });

      newCurrency.save().then((Currency) => {
         return res.send({ Currency, errors });
      });
   }
});

router.post('/edit-currency', (req, res) => {
   const { _id, currency_type, currency_separator } = req.body;
   let errors = [];

   if (currency_type.length > 10) {
      errors.push('currency type must be less than 10 characters');
   }

   if (currency_separator.length > 1) {
      errors.push('separator must be 0 or 1 character long');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Currency.findOneAndUpdate(
         { _id },
         {
            currency_type,
            currency_separator,
         }
      ).then((Currency) => {
         if (!Currency) {
            errors.push('Currency Not found');
            return res.send({ errors });
         } else {
            return res.send({ Currency, errors });
         }
      });
   }
});

router.post('/currency', (req, res) => {
   const { _id, currency_type, currency_separator } = req.body;
   let errors = [];

   if (currency_type.length > 10) {
      errors.push('currency type must be less than 10 characters');
   }

   if (currency_separator.length > 1) {
      errors.push('separator must be 1 character long');
   }

   Currency.findOneAndUpdate(
      { _id },
      {
         currency_type,
         currency_separator,
      }
   ).then((Currency) => {
      if (!Currency) {
         return res.send({ errors });
      } else {
         return res.send({ Currency, errors });
      }
   });
});

module.exports = router;
