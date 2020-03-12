const express = require('express');
const router = express.Router();
const ProductCode = require('../../models/Configurations/ProductCode');

router.post('/product-code', (req, res, next) => {
   ProductCode.find({ _id: req.body._id }).then(ProductCode => {
      res.send({ ProductCode });
   });
});

router.post('/add-product-code', (req, res) => {
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
      const newProductCode = new ProductCode({
         code_prefix,
         code_separator
      });

      newProductCode.save().then(ProductCode => {
         return res.send({ ProductCode, errors });
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
      ProductCode.findOneAndUpdate(
         { _id },
         {
            code_prefix,
            code_separator
         }
      ).then(ProductCode => {
         if (!ProductCode) {
            errors.push('ProductCode Not found');
            return res.send({ errors });
         } else {
            return res.send({ ProductCode, errors });
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

   ProductCode.findOneAndUpdate(
      { _id },
      {
         code_prefix,
         code_separator
      }
   ).then(ProductCode => {
      if (!ProductCode) {
         return res.send({ errors });
      } else {
         return res.send({ ProductCode, errors });
      }
   });
});

module.exports = router;
