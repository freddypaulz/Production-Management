const express = require("express");
const router = express.Router();
const Qualitycheck = require("../../models/Production/Quality_Check");
const Production = require("../../models/Production/Production");
const Production_Stock = require("../../models/Production/Production_Stock");

router.get("/", (req, res) => {
  Qualitycheck.find({}, function(err, data) {
    if (err) throw err;
    res.send(data);
  });
});
router.get("/lastcode", (req, res) => {
  Qualitycheck.findOne()
    .sort({ Id: -1 })
    .exec(function(err, data) {
      res.send(data);
    });
});
router.get("/blcode", (req, res) => {
  Qualitycheck.findOne()
    .sort({ Box_Id: -1 })
    .exec(function(err, data) {
      res.send(data);
    });
});
router.post("/", (req, res) => {
  Qualitycheck.find({ _id: req.body._id }, function(err, data) {
    if (err) throw err;
    res.send(data);
  });
});

router.post("/add", (req, res) => {
  console.log("Qualitycheck list");
  const {
    QC_Type,
    Product_Name,
    Product_ID,
    Batch_Id,
    Measuring_Unit,
    Quantity,
    Id_Type,
    Id,
    Box_Id,
    I_Capacity,
    B_Capacity,
    Method,
    QC_Date,
    Result,
    Status,
    Comments
  } = req.body;
  console.log(req.body);
  let error = [req.body.error];

  const new_Qualitycheck = new Qualitycheck({
    QC_Type,
    Product_Name,
    Product_ID,
    Batch_Id,
    Measuring_Unit,
    Quantity,
    Id_Type,
    Id,
    Box_Id,
    I_Capacity,
    B_Capacity,
    Method,
    QC_Date,
    Result,
    Comments,
    Status
  });
  new_Qualitycheck.save().then(result => {
    let flag = "";

    if (QC_Type === "Product" && Result === "Pass") {
      flag = "Product QC Success";
    } else if (QC_Type === "Product" && Result === "Fail") {
      flag = "Product QC Failed";
    } else if (QC_Type === "Packing" && Result === "Pass") {
      flag = "Packing QC Success";
      let Add = false;
      Production_Stock.find({}).then(stock_entry => {
        for (let i = 0; i < stock_entry.length; i++) {
          if (stock_entry[i].Product_ID === Product_ID) {
            Add = true;
            //console.log("stoc:", Quantity);
            let new_stock = stock_entry[i].Quantity + Quantity;
            Production_Stock.findOneAndUpdate(
              { Product_ID: Product_ID },
              {
                $set: {
                  Quantity: new_stock
                }
              }
            )
              .then(stock_Quantity => {
                console.log("Quantity added");
                res.send("Added successfully");
              })
              .catch(err => {
                res.send(err);
              });
          } else {
            if (i === stock_entry.length - 1 && flag !== true) {
              const new_Production_Stock = new Production_Stock({
                Product_ID,
                Product_Name,
                Quantity,
                Measuring_Unit
              });
              new_Production_Stock.save().then(Production_Stock => {
                console.log("stock added");
              });
            }
            console.log("Id Not Matched");
          }
        }

        if (stock_entry.length === 0) {
          console.log("add");
          const new_Production_Stock = new Production_Stock({
            Product_ID,
            Product_Name,
            Quantity,
            Measuring_Unit
          });
          new_Production_Stock.save().then(Production_Stock => {
            console.log("stock added");
          });
        }
      });
    } else if (QC_Type === "Packing" && Result === "Fail") {
      flag = "Packing QC Failed";
      console.log(flag);
    }
    Production.findOneAndUpdate(
      {
        Batch_Id
      },
      {
        $set: { Status: flag }
      }
    )
      .then(production => {
        console.log(production);
        //return res.send(result);
      })
      .catch(err => {
        res.send(err);
      });
  });
});

router.post("/delete", (req, res) => {
  Qualitycheck.findOneAndDelete({ _id: req.body._id }).then(result1 => {
    res.send(result1);
  });
});
router.post("/edit", (req, res) => {
  const {
    _id,
    QC_Type,
    Product_Name,
    Product_ID,
    Batch_Id,
    Measuring_Unit,
    Quantity,
    Id_Type,
    Id,
    Box_Id,
    I_Capacity,
    B_Capacity,
    Method,
    QC_Date,
    Result,
    Comments,
    Status
  } = req.body;

  let errors = [];

  Qualitycheck.findOneAndUpdate(
    { _id },
    {
      QC_Type,
      Product_Name,
      Product_ID,
      Measuring_Unit,
      Quantity,
      Id_Type,
      Id,
      Box_Id,
      I_Capacity,
      B_Capacity,
      Method,
      QC_Date,
      Result,
      Comments,
      Status
    }
  ).then(qualitycheck => {
    res.send(qualitycheck);
    console.log("updated");
  });
});

module.exports = router;
