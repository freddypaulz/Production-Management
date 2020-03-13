const Sales = require('../../models/Production/Sales');
const express = require('express');
const Production_Stock = require('../../models/Production/Production_Stock');

const router = express.Router();

router.get('/', (req, res) => {
   Sales.find({}, function(err, data) {
      if (err) throw err;
      res.send(data);
      console.log(data);
   });
});

router.post('/', (req, res) => {
   Sales.find({ _id: req.body._id }, function(err, data) {
      if (err) throw err;
      res.send(data);
      console.log(data);
   });
});
// router.get("/productions", (req, res, next) => {
//   Sales.find({}).then(Productions => {
//     res.send({ Productions });
//   });
// });

// router.post("/production", (req, res) => {
//   Sales.find({ _id: req.body._id }).then(Production => {
//     res.send({ Production });
//   });
// });

// router.post("/production-name", (req, res) => {
//   Sales.find({ product_name: req.body.product_name }).then(
//     Production => {
//       res.send({ Production });
//     }
//   );
// });

router.post('/add', (req, res) => {
   const {
      //_id,
      Product_Name,
      Product_ID,
      Quantity,
      Measuring_Unit,
      Box_Id,
      Selling_Date,
      Distributor,
      Payment_Type,
      Price,
      Final_Price,
      Discount,
      Advance,
      Balance,
      error = []
   } = req.body;
   console.log(req.body);
   // if (
   //   !Product_ID ||
   //   !Product_Name ||
   //   !Quantity ||
   //   !Measuring_Unit ||
   //   !Expiry_Duration_Days ||
   //   !Manufacture_Date
   // ) {
   //   res.send("error");
   // }
   const new_Sales = new Sales({
      // _id,
      Product_Name,
      Product_ID,
      Quantity,
      Measuring_Unit,
      Box_Id,
      Selling_Date,
      Distributor,
      Payment_Type,
      Price,
      Final_Price,
      Discount,
      Advance,
      Balance
   });
   new_Sales.save().then(Sales => {
      console.log('added');

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
         return res.send(Sales);
      });
   });
});
// router.post("/delete", (req, res) => {
//   var Delete_Id = req.body._id;
//   console.log(Delete_Id);
//   Sales.findById(Delete_Id).deleteOne(function(err) {
//     if (err) throw err;
//   });
//   var data = req.body._id;
//   res.send("Deleted");
// });
router.post('/delete', (req, res, next) => {
   Sales.findOneAndDelete({ _id: req.body._id }).then(Sales => {
      res.send(Sales);
   });
});
router.post('/edit', (req, res) => {
   const {
      _id,
      Product_Name,
      Product_ID,
      Quantity,
      Measuring_Unit,
      Box_Id,
      Selling_Date,
      Distributor,
      Payment_Type,
      Price,
      Final_Price,
      Discount,
      Advance,
      Balance
   } = req.body;

   Sales.findOneAndUpdate(
      { _id },
      {
         Product_Name,
         Product_ID,
         Quantity,
         Measuring_Unit,
         Box_Id,
         Selling_Date,
         Distributor,
         Payment_Type,
         Price,
         Final_Price,
         Discount,
         Advance,
         Balance
      }
   ).then(Sales => {
      res.send(Sales);
   });
});

module.exports = router;
