const request_details = require('../../models/Requests/RequestDetails');
const Logs = require('../../models/Logs/Logs');
const express = require('express');
const fileupload = require('express-fileupload');
const router = express.Router();
const moment = require('moment');
router.use(fileupload());
router.get('/', (req, res) => {
   request_details.find({}, function(err, data) {
      if (err) throw err;
      res.send(data);
      console.log(data);
   });
});
router.post('/', (req, res) => {
   request_details.find({ _id: req.body._id }, function(err, data) {
      if (err) throw err;
      res.send(data);
      console.log(data);
   });
});
router.post('/upload', (req, res) => {
   if (req.files !== null) {
      let i = '25-10-2020';
      const file = req.files.file;
      const fileType = file.name.split('.');
      const fileName = `quotation ${new moment().format('DD_MM_YYYY HH_m_s')}.${
         fileType[1]
      }`;
      file.mv(
         `${__dirname}/../../administrator/public/uploads/${fileName}`,
         err => {
            if (err) {
               res.send(err);
            } else {
               res.json({
                  fileName: file.name,
                  filePath: `/uploads/${fileName}`
               });
            }
         }
      );
   }
});

router.post('/add', (req, res) => {
   const errors = [];
   const {
      // _id,
      Raw_Material_Id,
      Raw_Material_Code,
      Quantity,
      Measuring_Unit,
      Priority,
      Due_Date,
      Status,
      Vendor,
      Quotation_Document_URL,
      Comments,
      Created_By,
      Total_Price,
      logs
   } = req.body;
   if (
      !Raw_Material_Id ||
      !Raw_Material_Code ||
      !Quantity ||
      !Measuring_Unit ||
      !Priority ||
      !Due_Date ||
      !Status ||
      !Vendor ||
      !Quotation_Document_URL ||
      !Comments ||
      !Created_By ||
      !Total_Price ||
      !logs
   ) {
      errors.push('Enter all required field');
   }

   if (errors.length > 0) {
      return res.send({ errors });
   } else {
      const new_request_details = new request_details({
         //_id,
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
         Quotation_Document_URL,
         Created_By
      });
      new_request_details
         .save()
         .then(request_details => {
            const newLogs = new Logs({
               Request_Id: request_details._id,
               Address: {
                  From: logs.from,
                  To: logs.to
               },
               Comments: logs.comments
            });
            newLogs
               .save()
               .then(logs => {
                  return res.send({ request_details, errors });
               })
               .catch(err => {
                  console.log(err);
               });
         })
         .catch(err => {
            console.log(err);
         });
   }
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
      })
      .catch(err => {
         console.log(err);
      });
});

router.post('/request-details-filter', (req, res) => {
   console.log('req body: ', req.body);

   const {
      from_date,
      to_date,
      from_due_date,
      to_due_date,
      from_quantity,
      to_quantity,
      measuring_unit,
      raw_material_id,
      status,
      raw_material_code,
      from_total_price,
      to_total_price,
      vendor
   } = req.body;

   let conditions = {};
   if (from_date && to_date) {
      conditions.date = {
         $gte: new Date(from_date),
         $lte: new Date(to_date)
      };
   }

   if (from_due_date && to_due_date) {
      conditions.Due_Date = {
         $gte: new Date(from_due_date),
         $lte: new Date(to_due_date)
      };
   }

   if (status) {
      conditions.Status = status;
   }

   if (raw_material_id) {
      conditions.Raw_Material_Id = raw_material_id;
   }

   if (vendor) {
      conditions.Vendor = vendor;
   }

   if (raw_material_code) {
      conditions.Raw_Material_Code = raw_material_code;
   }

   if (measuring_unit) {
      conditions.Measuring_Unit = measuring_unit;
   }

   if (from_quantity && to_quantity) {
      conditions.Quantity = {
         $gte: from_quantity,
         $lte: to_quantity
      };
   }

   if (from_total_price && to_total_price) {
      conditions.Total_Price = {
         $gte: from_total_price,
         $lte: to_total_price
      };
   }
   console.log('query: ', conditions);
   request_details.find(conditions).then(reqDetails => {
      console.log(reqDetails);
      res.send(reqDetails);
   });
});

module.exports = router;
