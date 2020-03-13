const Pre_Production = require('../../models/Production/Pre_Production');
const Production_Raw_Material_Stock = require('../../models/Purchase/Production_Raw_Material_Stock');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   Pre_Production.find({}, function(err, data) {
      if (err) throw err;
      res.send(data);
      console.log(data);
   });
});
router.get('/qc', (req, res) => {
   Pre_Production.find({ Status: { $ne: 'Packing QC Success' } }, function(
      err,
      data
   ) {
      if (err) throw err;
      res.send(data);
      console.log(data);
   });
});
router.post('/', (req, res) => {
   Pre_Production.find({ _id: req.body._id }, function(err, data) {
      if (err) throw err;
      res.send(data);
      console.log(data);
   });
});
// router.get("/productions", (req, res, next) => {
//   Pre_Production.find({}).then(Productions => {
//     res.send({ Productions });
//   });
// });

// router.post("/production", (req, res) => {
//   Pre_Production.find({ _id: req.body._id }).then(Production => {
//     res.send({ Production });
//   });
// });

// router.post("/production-name", (req, res) => {
//   Pre_Production.find({ product_name: req.body.product_name }).then(
//     Production => {
//       res.send({ Production });
//     }
//   );
// });

router.post('/add', (req, res) => {
   const {
      _id,
      Product_ID,
      Product_Name,
      Quantity,
      Measuring_Unit,
      Raw_Material_Details,

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
   const new_Pre_Production = new Pre_Production({
      _id,
      Product_ID,
      Product_Name,
      Quantity,
      Measuring_Unit,
      Raw_Material_Details
   });
   new_Pre_Production.save().then(Pre_Production => {
      console.log('added');
      Production_Raw_Material_Stock.find({}).then(stock_entry => {
         for (let i = 0; i < stock_entry.length; i++) {
            if (
               stock_entry[i].Raw_Material_Code ===
               Raw_Material_Details[i].material_code
            ) {
               console.log('rmstoc:', Quantity);
               let new_stock =
                  stock_entry[i].Quantity - Raw_Material_Details[i].quantity;
               Production_Raw_Material_Stock.findOneAndUpdate(
                  { Raw_Material_Code: Raw_Material_Details[i].material_code },
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
               console.log('Id Not Matched');
            }
         }
         return res.send(Pre_Production);
      });
   });
});
// router.post("/delete", (req, res) => {
//   var Delete_Id = req.body._id;
//   console.log(Delete_Id);
//   Pre_Production.findById(Delete_Id).deleteOne(function(err) {
//     if (err) throw err;
//   });
//   var data = req.body._id;
//   res.send("Deleted");
// });
router.post('/delete', (req, res, next) => {
   Pre_Production.findOneAndDelete({ _id: req.body._id }).then(Production => {
      res.send(Pre_Production);
   });
});
router.post('/edit', (req, res) => {
   const {
      _id,
      Product_ID,
      Product_Name,

      Quantity,
      Measuring_Unit,
      Raw_Material_Details
   } = req.body;

   Pre_Production.findOneAndUpdate(
      { _id },
      {
         Product_ID,
         Product_Name,

         Quantity,
         Measuring_Unit,
         Raw_Material_Details
      }
   ).then(Pre_Production => {
      res.send(Pre_Production);
   });
});

module.exports = router;
