const Production_Stock = require("../../models/Production/Production_Stock");
const express = require("express");
const router = express.Router();
const Pre_Production = require("../../models/Production/Pre_Production");

router.get("/stock", (req, res) => {
  Production_Stock.find({}, function(err, data) {
    if (err) throw err;
    res.send(data);
  });
});

router.post("/", (req, res) => {
  Production_Stock.find({ _id: req.body._id }, function(err, data) {
    if (err) throw err;
    res.send(data);
    console.log(data);
  });
});

router.post("/add", (req, res) => {
  const {
    Product_ID,
    Product_Name,
    Quantity,
    Measuring_Unit,
    Id,
    Box_Id
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
  const new_Production_Stock = new Production_Stock({
    Product_ID,
    Product_Name,
    Quantity,
    Measuring_Unit,
    Id,
    Box_Id
  });
  new_Production_Stock.save().then(Production_Stock => {
    console.log("added");
    return res.send(Production_Stock);
  });
});

router.post("/delete", (req, res, next) => {
  Production_Stock.findOneAndDelete({ _id: req.body._id }).then(Production => {
    res.send(Production_Stock);
  });
});
router.post("/edit", (req, res) => {
  const { _id, Product_ID, Product_Name, Quantity, Measuring_Unit } = req.body;

  Production_Stock.findOneAndUpdate(
    { _id },
    {
      Product_ID,
      Product_Name,
      Quantity,
      Measuring_Unit
    }
  ).then(Production_Stock => {
    res.send(Production_Stock);
  });
});

module.exports = router;
