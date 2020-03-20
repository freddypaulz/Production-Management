const request_details = require("../../models/Purchase/Request_Details");
const Production_Raw_Material_Stock = require("../../models/Purchase/Production_Raw_Material_Stock");
const Logs = require("../../models/Administrator/Logs/Logs");
const express = require("express");
const router = express.Router();
const app = express();

router.get("/", (req, res) => {
  request_details.find({}, function(err, data) {
    if (err) throw err;
    res.send(data);
    console.log(data);
  });
});
router.post("/", (req, res) => {
  request_details.find({ _id: req.body._id }, function(err, data) {
    if (err) throw err;
    res.send(data);
    console.log(data);
  });
});

router.post("/add", (req, res) => {
  const {
    // _id,
    Raw_Material_Id,
    Raw_Material_Code,
    Quantity,
    Measuring_Unit,
    Priority,
    Due_Date,
    Status,
    Comments,
    Created_By,
    logs
  } = req.body;
  console.log(req.body);

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
    Total_Price: 0,
    Vendor: "",
    Quotation_Document_URL: [],
    Created_By,
    Invoice_Quantity: "",
    Invoice_Measuring_Unit: "",
    Id_Type: "",
    Id: [],
    Invoice_Amount: 0,
    Invoice_Date: null,
    Invoice_Document: []
  });
  new_request_details.save().then(request_details => {
    console.log("added");

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
        return res.send({ request_details });
      })
      .catch(err => {
        console.log(err);
      });

    // return res.send(request_details);
    if (Status === "Purchase-Completed") {
      let flag = false;
      Production_Raw_Material_Stock.find({}).then(stock_entry => {
        for (let i = 0; i < stock_entry.length; i++) {
          if (stock_entry[i].Raw_Material_Code === Raw_Material_Code) {
            flag = true;
            console.log("rmstoc:", Quantity);
            let new_stock = stock_entry[i].Quantity + Quantity;
            Production_Raw_Material_Stock.findOneAndUpdate(
              { Raw_Material_Code: Raw_Material_Code },
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
              const new_Production_Raw_Material_Stock = new Production_Raw_Material_Stock(
                {
                  Raw_Material_Id,
                  Raw_Material_Code,
                  Quantity,
                  Measuring_Unit
                  // Id_Type,
                  // Id: []
                }
              );
              new_Production_Raw_Material_Stock
                .save()
                .then(Production_Raw_Material_Stock => {
                  console.log("stock added");
                });
            }
            console.log("Id Not Matched");
          }
        }

        if (stock_entry.length === 0) {
          console.log("add");
          const new_Production_Raw_Material_Stock = new Production_Raw_Material_Stock(
            {
              Raw_Material_Id,
              Raw_Material_Code,
              Quantity,
              Measuring_Unit
              // Id_Type,
              // Id: []
            }
          );
          new_Production_Raw_Material_Stock
            .save()
            .then(Production_Raw_Material_Stock => {
              console.log("stock added");
            });
        }
      });
    }
  });
});

router.post("/delete", (req, res, next) => {
  request_details
    .findOneAndDelete({ _id: req.body._id })
    .then(requestdetails => {
      res.send(request_details);
    });
});
router.post("/edit", (req, res) => {
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
    logs,
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
      if (logs) {
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
            return res.send({ request_details });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
});
router.post("/invoice", (req, res) => {
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
      res.send(request_details);
      // console.log(request_details);
    });
});

module.exports = router;
