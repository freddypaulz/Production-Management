const QC_Method = require("../../models/Production/QC_Method");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  QC_Method.find({}, function(err, data) {
    if (err) throw err;
    res.send(data);
    console.log(data);
  });
});
router.post("/", (req, res) => {
  QC_Method.find({ _id: req.body._id }, function(err, data) {
    if (err) throw err;
    res.send(data);
    console.log(data);
  });
});
// router.get("/productions", (req, res, next) => {
//   QC_Method.find({}).then(Productions => {
//     res.send({ Productions });
//   });
// });

// router.post("/production", (req, res) => {
//   QC_Method.find({ _id: req.body._id }).then(Production => {
//     res.send({ Production });
//   });
// });

// router.post("/production-name", (req, res) => {
//   QC_Method.find({ product_name: req.body.product_name }).then(
//     Production => {
//       res.send({ Production });
//     }
//   );
// });

router.post("/add", (req, res) => {
  const { Method_Name, Description, Value } = req.body;
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
  const new_QC_Method = new QC_Method({
    Method_Name,
    Description,
    Value
  });
  new_QC_Method.save().then(res1 => {
    console.log("added");
    return res.send(res1);
  });
});

router.post("/delete", (req, res) => {
  QC_Method.findOneAndDelete({ _id: req.body._id }).then(QC_Method => {
    res.send(QC_Method);
  });
});
router.post("/edit", (req, res) => {
  const { _id, Method_Name, Description, Value } = req.body;

  QC_Method.findOneAndUpdate(
    { _id },
    {
      Method_Name,
      Description,
      Value
    }
  ).then(QC_Method => {
    res.send(QC_Method);
    console.log(QC_Method);
  });
});

module.exports = router;
