const express = require('express');
const router = express.Router();
const BoxCode = require('../../models/Production/Box_Code');

router.get('/', (req, res) => {
   BoxCode.find({}).then(BoxCode => {
      res.send({ BoxCode });
   });
});

router.post('/product-code', (req, res, next) => {
   BoxCode.find({ _id: req.body._id }).then(BoxCode => {
      res.send({ BoxCode });
   });
});

router.post('/add-product-code', (req, res) => {
   const { code_prefix, code_separator } = req.body;
   let errors = [];

   if (code_prefix.length > 10) {
      errors.push('prefix must be less than 10 characters');
   }

   if (code_separator.length > 1) {
      errors.push('separator must be 0 or 1 character long');
   }

   if (errors.length > 0) {
      res.send({ errors });
   } else {
      const newBoxCode = new BoxCode({
         code_prefix,
         code_separator
      });

      newBoxCode.save().then(BoxCode => {
         return res.send({ BoxCode, errors });
      });
   }
});

router.post('/edit-product-code', (req, res) => {
   const { _id, code_prefix, code_separator } = req.body;
   let errors = [];

   if (code_prefix.length > 10) {
      errors.push('prefix must be less than 10 characters');
   }

   if (code_separator.length > 1) {
      errors.push('separator must be 0 or 1 character long');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      BoxCode.findOneAndUpdate(
         { _id },
         {
            code_prefix,
            code_separator
         }
      ).then(BoxCode => {
         if (!BoxCode) {
            errors.push('BoxCode Not found');
            return res.send({ errors });
         } else {
            return res.send({ BoxCode, errors });
         }
      });
   }
});

router.post('/product-code', (req, res) => {
   const { _id, code_prefix, code_separator } = req.body;
   let errors = [];

   if (code_prefix.length > 5) {
      errors.push('prefix must be less than 5 characters');
   }

   if (code_separator.length > 1) {
      errors.push('separator must be 1 character long');
   }

   BoxCode.findOneAndUpdate(
      { _id },
      {
         code_prefix,
         code_separator
      }
   ).then(BoxCode => {
      if (!BoxCode) {
         return res.send({ errors });
      } else {
         return res.send({ BoxCode, errors });
      }
   });
});

module.exports = router;
