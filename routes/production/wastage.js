const express = require('express');
const router = express.Router();
const Production_Wastages = require('../../models/Production/Wastage');
const Production_Stock = require('../../models/Production/Production_Stock');
const Production_Raw_Material_Stock = require('../../models/Purchase/Production_Raw_Material_Stock');

router.get('/', (req, res) => {
   Production_Wastages.find({}, function(err, data) {
      if (err) throw err;
      res.send(data);
   });
});
router.post('/', (req, res) => {
   Production_Wastages.find({ _id: req.body._id }, function(err, data) {
      if (err) throw err;
      res.send(data);
   });
});
router.post('/add', (req, res) => {
   console.log('wastage list');
   const {
      Wastage_Type,
      Product_Name,
      Raw_Material_Id,
      Product_ID,
      raw_material_code,
      Quantity,
      Id_Type,
      Id,
      Measuring_Unit,
      Wastage_Date,
      Description
   } = req.body;
   console.log(req.body);
   let error = [req.body.error];

   const new_Production_Wastages = new Production_Wastages({
      Wastage_Type,
      Product_Name,
      Raw_Material_Id,
      Product_ID,
      raw_material_code,
      Quantity,
      Id_Type,
      Id,
      Measuring_Unit,
      Wastage_Date,
      Description
   });
   new_Production_Wastages.save().then(Wastage => {
      if (Wastage_Type === 'Product') {
         Production_Stock.find({}).then(stock_entry => {
            for (let i = 0; i <= stock_entry.length; i++) {
               if (stock_entry[i].Product_ID === Product_ID) {
                  //console.log("stoc:", Quantity);
                  let new_stock = stock_entry[i].Quantity - Quantity;
                  Production_Stock.findOneAndUpdate(
                     { Product_ID: Product_ID },

                     {
                        $set: {
                           Quantity: new_stock
                        }
                     }
                  )
                     .then(stock_Quantity => {
                        console.log('Quantity lessed');
                        res.send('subracted successfully');
                     })
                     .catch(err => {
                        res.send(err);
                     });
               } else {
                  console.log('Id Not Matched');
               }
            }
            return res.send(Wastage);
         });
      } else if (Wastage_Type === 'RawMaterial') {
         Production_Raw_Material_Stock.find({}).then(stock_entry => {
            for (let i = 0; i < stock_entry.length; i++) {
               console.log(stock_entry[i].Raw_Material_Code);
               if (stock_entry[i].Raw_Material_Code === raw_material_code) {
                  console.log('rmstoc:', Quantity);
                  let new_stock = stock_entry[i].Quantity - Quantity;
                  Production_Raw_Material_Stock.findOneAndUpdate(
                     { Raw_Material_Code: raw_material_code },
                     {
                        $set: {
                           Quantity: new_stock
                        }
                     }
                  )
                     .then(stock_Quantity => {
                        console.log('Quantity added');
                        res.send('Added successfully');
                     })
                     .catch(err => {
                        res.send(err);
                     });
               } else {
                  console.log('RMId Not Matched');
               }
            }
            return res.send(Wastage);
         });
      }
   });
});

router.post('/delete', (req, res, next) => {
   Production_Wastages.findOneAndDelete({ _id: req.body._id }).then(Wastage => {
      res.send(Wastage);
   });
});
router.post('/edit', (req, res) => {
   const {
      _id,
      Wastage_Type,
      Product_Name,
      Raw_Material_Id,
      Product_ID,
      raw_material_code,
      Quantity,
      Id_Type,
      Id,
      Measuring_Unit,
      Wastage_Date,
      Description
   } = req.body;

   let errors = [];

   Production_Wastages.findOneAndUpdate(
      { _id },
      {
         Wastage_Type,
         Product_Name,
         Raw_Material_Id,
         Product_ID,
         raw_material_code,
         Quantity,
         Id_Type,
         Id,
         Measuring_Unit,
         Wastage_Date,
         Description
      }
   ).then(Wastage => {
      res.send(Wastage);
      console.log('updated');
   });
});

module.exports = router;
