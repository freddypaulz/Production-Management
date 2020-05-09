const Production = require("../../models/Production/Production");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  Production.find({}, function (err, data) {
    if (err) throw err;
    res.send(data);
    console.log(data);
  });
});
router.get("/qc", (req, res) => {
  Production.find({ Status: { $ne: "Packing QC Success" } }, function (
    err,
    data
  ) {
    if (err) throw err;
    res.send(data);
    console.log(data);
  });
});
router.post("/", (req, res) => {
  Production.find({ _id: req.body._id }, function (err, data) {
    if (err) throw err;
    res.send(data);
    console.log(data);
  });
});
// router.get("/productions", (req, res, next) => {
//   Production.find({}).then(Productions => {
//     res.send({ Productions });
//   });
// });

// router.post("/production", (req, res) => {
//   Production.find({ _id: req.body._id }).then(Production => {
//     res.send({ Production });
//   });
// });

// router.post("/production-name", (req, res) => {
//   Production.find({ product_name: req.body.product_name }).then(
//     Production => {
//       res.send({ Production });
//     }
//   );
// });

router.post("/add", (req, res) => {
  const {
    _id,
    Product_ID,
    Product_Name,
    Batch_Id,
    Quantity,
    Measuring_Unit,
    Expiry_Duration_Days,
    Manufacture_Date,
    Status,
    error = [],
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
  const new_Production = new Production({
    _id,
    Product_ID,
    Product_Name,
    Batch_Id,
    Quantity,
    Measuring_Unit,
    Expiry_Duration_Days,
    Manufacture_Date,
    Status,
  });
  new_Production.save().then((Production) => {
    console.log("added");
    res.send(Production);
  });
});
// router.post("/delete", (req, res) => {
//   var Delete_Id = req.body._id;
//   console.log(Delete_Id);
//   Production.findById(Delete_Id).deleteOne(function(err) {
//     if (err) throw err;
//   });
//   var data = req.body._id;
//   res.send("Deleted");
// });
router.post("/delete", (req, res, next) => {
  Production.findOneAndDelete({ _id: req.body._id }).then((Production) => {
    res.send(Production);
  });
});
router.post("/edit", (req, res) => {
  const {
    _id,
    Product_ID,
    Product_Name,
    Batch_Id,
    Quantity,
    Measuring_Unit,
    Expiry_Duration_Days,
    Manufacture_Date,
    Status,
  } = req.body;

  Production.findOneAndUpdate(
    { _id },
    {
      Product_ID,
      Product_Name,
      Batch_Id,
      Quantity,
      Measuring_Unit,
      Expiry_Duration_Days,
      Manufacture_Date,
      Status,
    }
  ).then((Production) => {
    res.send(Production);
  });
});

module.exports = router;
