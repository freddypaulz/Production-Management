const express = require('express');
const router = express.Router();
const purchaseWastages = require('../../models/Purchase/Purchase_Wastages');
const purchaseStocks = require('../../models/Purchase/Purchase_Stocks');
const reqDetails = require('../../models/Purchase/Request_Details');

router.get('/', (req, res) => {
   purchaseWastages.find({}, function (err, data) {
      if (err) throw err;
      res.send(data);
   });
});
router.post('/', (req, res) => {
   purchaseWastages.find({ _id: req.body._id }, function (err, data) {
      if (err) throw err;
      res.send(data);
   });
});
router.post('/add', (req, res) => {
   console.log('wastage list');
   const {
      Raw_Material_Id,
      Raw_Material_Code,
      Quantity,
      Id_Type,
      Id,
      Measuring_Unit,
      Wastage_Date,
      Description
   } = req.body;
   //console.log(req.body);

   const new_Purchase_Wastages = new purchaseWastages({
      Raw_Material_Id,
      Raw_Material_Code,
      Quantity,
      Id_Type,
      Id,
      Measuring_Unit,
      Wastage_Date,
      Description
   });
   new_Purchase_Wastages.save().then(Wastage => {
      purchaseStocks.find({}).then(stock_entry => {
         let flag = false;
         for (let i = 0; i < stock_entry.length; i++) {
            reqDetails
               .find({ _id: stock_entry[i].Purchase_Id })
               .then(details => {
                  if (details[0].Raw_Material_Code === Raw_Material_Code) {
                     flag = true;
                     let new_stock = stock_entry[i].Total_Quantity - Quantity;
                     if (new_stock < 0) {
                        new_stock = 0;
                     }
                     purchaseStocks
                        .findOneAndUpdate(
                           { Purchase_Id: details[0]._id },
                           {
                              $set: {
                                 Total_Quantity: new_stock
                              }
                           }
                        )
                        .then(stock_Quantity => {
                           console.log('Quantity lessed: ', stock_Quantity);
                           res.send('Stock reduced successfully');
                        })
                        .catch(err => {
                           res.send(err);
                        });
                  } else {
                     if (id === stock_entry.length - 1 && flag != true) {
                        console.log('Id Not Matched');
                        res.send('Id not matched');
                     }
                  }
               })
               .catch(err => {
                  console.log('not purchased', err);
                  res.send('Not in stock');
               });
         }
         return res.send(Wastage);
      });
   });
});

router.post('/delete', (req, res, next) => {
   purchaseWastages.findOneAndDelete({ _id: req.body._id }).then(Wastage => {
      res.send(Wastage);
   });
});

router.post('/edit', (req, res) => {
   const {
      _id,
      Raw_Material_Id,
      Raw_Material_code,
      Quantity,
      Id_Type,
      Id,
      Measuring_Unit,
      Wastage_Date,
      Description
   } = req.body;

   let errors = [];

   purchaseWastages
      .findOneAndUpdate(
         { _id },
         {
            Raw_Material_Id,
            Raw_Material_Code,
            Quantity,
            Id_Type,
            Id,
            Measuring_Unit,
            Wastage_Date,
            Description
         }
      )
      .then(Wastage => {
         res.send(Wastage);
         console.log('updated');
      });
});

module.exports = router;
