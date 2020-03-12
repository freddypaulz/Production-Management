const express = require('express');
const router = express.Router();
const moment = require('moment');
const Production = require('../../models/Reports/Production');

router.get('/production', (req, res, next) => {
   Production.find({}).then(Production => {
      res.send({ Production });
   });
});

router.post('/production', (req, res) => {
   const filters = {};
   let temp = [];
   let flag = false;
   const { start_date, end_date } = req.body;
   if (start_date && end_date) {
      filters.Manufacture_Date = {
         $gte: req.body.start_date,
         $lte: req.body.end_date
      };
   }
   Production.find(filters).then(Production => {
      //console.log(Production);
      Production.map(production => {
         flag = false;
         if (temp.length === 0) {
            temp.push(production);
         } else {
            temp.find(value => {
               console.log(
                  'Production',
                  value.Product_ID,
                  new moment(value.Manufacture_Date).format('YYYY-MM-DD'),
                  new moment(value.Manufacture_Date).format('YYYYMM'),
                  production.Product_ID,
                  new moment(production.Manufacture_Date).format('YYYY-MM-DD'),
                  new moment(production.Manufacture_Date).format('YYYYMM'),
                  new moment(value.Manufacture_Date).format('YYYYMM') ===
                     new moment(production.Manufacture_Date).format('YYYYMM')
               );
               if (
                  value.Product_ID === production.Product_ID &&
                  new moment(value.Manufacture_Date).format('YYYYMM') ===
                     new moment(production.Manufacture_Date).format('YYYYMM')
               ) {
                  //   console.log(
                  //      new moment(production.Manufacture_Date).format('YYYYMM')
                  //   );
                  if (!flag) {
                     flag = true;
                  }
                  return (value.Quantity += production.Quantity);
               }
            });
            // console.log('Hello', flag);
            if (!flag) {
               temp.push(production);
            }
         }
      });
      console.log(temp);
      res.send({ Production: temp });
   });
});

module.exports = router;
