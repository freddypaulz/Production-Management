const express = require('express');
const router = express.Router();
const ProductionStocks = require('../../models/Reports/Production_Stock');

router.get('/production-stocks', (req, res, next) => {
   ProductionStocks.find({}).then(ProductionStocks => {
      res.send({ ProductionStocks });
   });
});

router.post('/production-stock', (req, res) => {
   const filters = {};
   const { start_date, end_date } = req.body;
   if (start_date && end_date) {
      filters.date = {
         $gte: req.body.start_date,
         $lte: req.body.end_date
      };
   }
   ProductionStocks.find(filters).then(ProductionStock => {
      res.send({ ProductionStock });
   });
});

module.exports = router;
