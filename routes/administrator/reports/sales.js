const express = require('express');
const router = express.Router();
const moment = require('moment');
const Sales = require('../../../models/Administrator/Reports/Sales');

router.get('/sales', (req, res, next) => {
   Sales.find({}).then(Sales => {
      res.send({ Sales });
   });
});

router.post('/sale', (req, res) => {
   const filters = {};
   let temp = [];
   let flag = false;
   const { start_date, end_date } = req.body;
   if (start_date && end_date) {
      filters.Selling_Date = {
         $gte: req.body.start_date,
         $lte: req.body.end_date
      };
   }
   Sales.find(filters)
      .sort({ date: -1 })
      .then(Sale => {
         Sale.map(sale => {
            flag = false;
            if (temp.length === 0) {
               temp.push(sale);
            } else {
               temp.find(value => {
                  console.log(
                     'Sales',
                     value.Product_ID,
                     new moment(value.Selling_Date).format('YYYY-MM-DD'),
                     new moment(value.Selling_Date).format('YYYYMM'),
                     sale.Product_ID,
                     new moment(sale.Selling_Date).format('YYYY-MM-DD'),
                     new moment(sale.Selling_Date).format('YYYYMM'),
                     new moment(value.Selling_Date).format('YYYYMM') ===
                        new moment(sale.Selling_Date).format('YYYYMM')
                  );
                  if (
                     value.Product_ID === sale.Product_ID &&
                     new moment(value.Selling_Date).format('YYYYMM') ===
                        new moment(sale.Selling_Date).format('YYYYMM')
                  ) {
                     if (!flag) {
                        flag = true;
                     }
                     return (value.Quantity += sale.Quantity);
                  }
               });
               if (!flag) {
                  temp.push(sale);
               }
            }
         });
         res.send({ Sale: temp });
      });
});

module.exports = router;
