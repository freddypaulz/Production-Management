const reqDetails = require('../../models/Purchase/Request_Details');
const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const date = new Date();

router.use(fileUpload());

router.get('/', (req, res) => {
   reqDetails.find({}, { Quotation_Document_URL: 1, _id: 0 }).then(file => {
      res.send(file);
   });
});

router.post('/', (req, res) => {
   if (req.files) {
      const file = req.files.file;
      var storeFile = [];
      console.log('File received:', file);
      if (file.length) {
         for (let i = 0; i < file.length; i++) {
            file[i].mv(
               `${__dirname}/../../client/src/file storage/${file[i].name}`,
               err => {
                  if (err) res.send(err);
                  else {
                     storeFile.push(file[i].name);
                     if (i === file.length - 1) {
                        res.send(storeFile);
                     }
                     console.log('FileName: ', file[i].name);
                  }
               }
            );
         }
      } else {
         file.mv(
            `${__dirname}/../../client/src/file storage/${file.name}`,
            err => {
               if (err) {
                  console.log(err);
                  res.send(err);
               } else {
                  console.log('date: ', file);
                  res.send(file.name);
               }
            }
         );
         //res.send(file.name)
      }
   }
});

module.exports = router;
