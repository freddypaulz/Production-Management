const express = require('express');
const router = express.Router();
const Products = require('../models/Product');

router.get('/products', (req, res, next) => {
   Products.find({}).then(Products => {
      res.send({ Products });
   });
});

router.post('/product', (req, res) => {
   Products.find({ _id: req.body._id }).then(Product => {
      res.send({ Product });
   });
});

router.post('/product-name', (req, res) => {
   Products.find({ product_name: req.body.product_name }).then(Product => {
      res.send({ Product });
   });
});

router.post('/add-product', (req, res) => {
   const {
      product_name,
      product_code,
      product_price,
      product_registration_date,
      product_measuring_unit,
      description
   } = req.body;
   let errors = [];

   if (
      !product_name ||
      !product_code ||
      !product_price ||
      //!product_registration_date ||
      !product_measuring_unit
   ) {
      errors.push('Enter all required fields');
   }

   if (product_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (product_code.length > 20) {
      errors.push('Use 20 or less characters for product code');
   }

   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (errors.length > 0) {
      res.send({ errors });
   } else {
      Products.findOne({ product_name }).then(Product => {
         if (Product) {
            errors.push('Product name already taken');
            res.send({ errors });
         } else {
            const newProduct = new Products({
               product_name,
               product_code,
               product_price,
               product_registration_date,
               product_measuring_unit,
               description
            });
            newProduct.save().then(Product => {
               return res.send({ Product, errors });
            });
         }
      });
   }
});

router.post('/edit-product', (req, res) => {
   const {
      _id,
      product_name,
      product_code,
      product_price,
      product_registration_date,
      product_measuring_unit,
      description
   } = req.body;
   let errors = [];

   if (
      !product_name ||
      !product_code ||
      !product_price ||
      !product_registration_date ||
      !product_measuring_unit
   ) {
      errors.push('Enter all required fields');
   }

   if (product_name.length > 20) {
      errors.push('Use 20 or less characters for Name');
   }

   if (product_code.length > 20) {
      errors.push('Use 20 or less characters for product code');
   }
   if (description.length > 200) {
      errors.push('Use 20 or less characters for description');
   }
   if (product_name) {
      Products.find({ product_name }).then(Product => {
         if (typeof Product[0] !== 'undefined') {
            if (Product[0]._id != _id) {
               errors.push('Product name must be unique');
            }
         }
         if (errors.length > 0) {
            return res.send({ errors });
         } else {
            Products.findOneAndUpdate(
               { _id },
               {
                  product_name,
                  product_code,
                  product_price,
                  product_registration_date,
                  product_measuring_unit,
                  description
               }
            )
               .then(Product => {
                  if (!Product) {
                     errors.push('Product Not found');
                     return res.send({ errors });
                  } else {
                     return res.send({ Product, errors });
                  }
               })
               .catch(err => {
                  return res.send(err);
               });
         }
      });
   }
});

router.post('/delete-product', (req, res) => {
   Products.findOneAndDelete({ _id: req.body._id }).then(Product => {
      res.send(Product);
   });
});

module.exports = router;
