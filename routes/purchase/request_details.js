const request_details = require('../../models/Purchase/Request_Details');
const express = require('express');
const router = express.Router();
const app = express();

router.get('/', (req, res) => {
   request_details.find({}, function(err, data) {
      if (err) throw err;
      res.send(data);
      //  console.log(data);
   });
});

router.post('/', (req, res) => {
   request_details.find({ _id: req.body._id }, function(err, data) {
      if (err) throw err;
      res.send(data);
      //console.log(data);
   });
});

router.post('/add', (req, res) => {
   const {
      //    _id,
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
   //console.log(req.body);

   const new_request_details = new request_details({
      //  _id,
      Raw_Material_Id,
      Raw_Material_Code,
      Quantity,
      Measuring_Unit,
      Priority,
      Due_Date,
      Status,
      Comments,
      Total_Price: 0,
      Vendor: '',
      Quotation_Document_URL: [],
      Created_By: {
         Employee_Id: '5e4a727601f32b18b45bac9b',
         Role_Id: '5e4a8cdbce0f9c2244ca9fb1'
      }
   });
   new_request_details.save().then(request_details => {
      console.log('added');
      return res.send(request_details);
   });
});

router.post('/delete', (req, res, next) => {
   request_details
      .findOneAndDelete({ _id: req.body._id })
      .then(requestdetails => {
         res.send(request_details);
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
      Comments,
      Total_Price,
      Vendor,
      Quotation_Document_URL
   } = req.body;

   request_details
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
            Comments,
            Total_Price,
            Vendor,
            Quotation_Document_URL
         }
      )
      .then(request_details => {
         res.send(request_details);
         console.log(request_details);
      });
});
router.post('/invoice', (req, res) => {
   const {
      _id,
      Invoice_Quantity,
      Invoice_Measuring_Unit,
      Id_Type,
      Id,
      Invoice_Amount,
      Invoice_Date,
      Status,
      Invoice_Document
   } = req.body;

   request_details
      .findOneAndUpdate(
         { _id },
         {
            _id,
            Invoice_Quantity,
            Invoice_Measuring_Unit,
            Id_Type,
            Id,
            Invoice_Amount,
            Invoice_Date,
            Status,
            Invoice_Document
         }
      )
      .then(request_details => {
         res.send(Invoice_Quantity);
         console.log(request_details);
      });
});

module.exports = router;
