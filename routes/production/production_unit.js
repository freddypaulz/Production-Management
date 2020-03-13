const production_unit = require('../../models/Production/production_unit');
const Production_Raw_Material_Stock = require('../../models/Purchase/Production_Raw_Material_Stock');
const express = require('express');
const router = express.Router();
const app = express();

router.get('/', (req, res) => {
   production_unit.find({}, function(err, data) {
      if (err) throw err;
      res.send(data);
      console.log(data);
   });
});
router.post('/', (req, res) => {
   production_unit.find({ _id: req.body._id }, function(err, data) {
      if (err) throw err;
      res.send(data);
      console.log(data);
   });
});

router.post('/add', (req, res) => {
   const {
      // _id,
      Raw_Material_Id,
      Raw_Material_Code,
      Quantity,
      Measuring_Unit,
      Priority,
      Due_Date,
      Status,
      Comments,
      error = []
   } = req.body;
   console.log(req.body);

   const new_production_unit = new production_unit({
      //_id,
      Raw_Material_Id,
      Raw_Material_Code,
      Quantity,
      Measuring_Unit,
      Priority,
      Due_Date,
      Status,
      Comments,
      Created_By: {
         Employee_Id: '5e4a727601f32b18b45bac9b',
         Role_Id: '5e4a8cdbce0f9c2244ca9fb1'
      }
   });
   new_production_unit.save().then(production_unit => {
      console.log('added');

      return res.send(production_unit);
   });
});

router.post('/delete', (req, res, next) => {
   production_unit
      .findOneAndDelete({ _id: req.body._id })
      .then(requestdetails => {
         res.send(production_unit);
      });
});
router.post('/edit', (req, res) => {
   const {
      _id,
      Raw_Material_Id,
      Raw_Material_Code,
      Quantity,
      Measuring_Unit,
      Priority,
      Due_Date,
      Status,
      Comments
   } = req.body;

   production_unit
      .findOneAndUpdate(
         { _id },
         {
            Raw_Material_Id,
            Raw_Material_Code,
            Quantity,
            Measuring_Unit,
            Priority,
            Due_Date,
            Status,
            Comments
         }
      )
      .then(production_unit => {
         if (Status === 'Accepted') {
            console.log('unit overflow');
            Production_Raw_Material_Stock.find({}).then(stock_entry => {
               console.log(Raw_Material_Code);

               for (let i = 0; i < stock_entry.length; i++) {
                  console.log(stock_entry[i].Raw_Material_Code);
                  if (stock_entry[i].Raw_Material_Code === Raw_Material_Code) {
                     console.log('rmstoc:', Quantity);
                     let new_stock = stock_entry[i].Quantity - Quantity;
                     Production_Raw_Material_Stock.findOneAndUpdate(
                        { Raw_Material_Code: Raw_Material_Code },
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
            });
         }
         res.send(production_unit);
         console.log(production_unit);
      });
});

module.exports = router;
