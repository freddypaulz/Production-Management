const Production_Raw_Material_Stock = require('../../models/Purchase/Production_Raw_Material_Stock');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   Production_Raw_Material_Stock.find({}, function (err, data) {
      if (err) throw err;
      res.send(data);
   });
});

router.post('/', (req, res) => {
   Production_Raw_Material_Stock.find({ _id: req.body._id }, function (
      err,
      data
   ) {
      if (err) throw err;
      res.send(data);
      console.log(data);
   });
});

router.post('/add', (req, res) => {
   const {
      Raw_Material_Id,
      Raw_Material_Code,
      Quantity,
      Measuring_Unit,
      Id_Type,
      Id: []
   } = req.body;
   console.log(req.body);

   const new_Production_Raw_Material_Stock = new Production_Raw_Material_Stock({
      Raw_Material_Id,
      Raw_Material_Code,
      Quantity,
      Measuring_Unit,
      Id_Type,
      Id: []
   });
   new_Production_Raw_Material_Stock
      .save()
      .then(Production_Raw_Material_Stock => {
         console.log('added');
         return res.send(Production_Raw_Material_Stock);
      });
});

router.post('/delete', (req, res, next) => {
   Production_Raw_Material_Stock.findOneAndDelete({ _id: req.body._id }).then(
      Production => {
         res.send(Production_Raw_Material_Stock);
      }
   );
});
router.post('/edit', (req, res) => {
   const {
      _id,
      Raw_Material_Id,
      Raw_Material_Code,
      Quantity,
      Measuring_Unit,
      Id_Type,
      Id: []
   } = req.body;

   Production_Raw_Material_Stock.findOneAndUpdate(
      { _id },
      {
         Raw_Material_Id,
         Raw_Material_Code,
         Quantity,
         Measuring_Unit,
         Id_Type,
         Id: []
      }
   ).then(Production_Raw_Material_Stock => {
      res.send(Production_Raw_Material_Stock);
   });
});

module.exports = router;