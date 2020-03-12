const logs = require('../../models/Logs/Logs');
const express = require('express');
const router = express.Router();

router.get('/logs', (req, res) => {
   logs.find({}, function(err, data) {
      if (err) {
         throw err;
      } else {
         res.send(data);
      }
   });
});

router.post('/logs', (req, res) => {
   if (req.body.Request_Id) {
      logs
         .find({ Request_Id: req.body.Request_Id })
         .then(log => {
            res.send(log);
         })
         .catch(err => console.log(err));
   }
});

router.post('/comment', (req, res) => {
   console.log('Req: ', req.body);
   if (req.body.logs) {
      var reqId = req.body.logs.reqId;
      var from = req.body.logs.from;
      var to = req.body.logs.to;
      var comments = req.body.logs.comments;
      const log = new logs({
         Request_Id: reqId,
         Address: {
            From: from,
            To: to
         },
         Comments: comments
      });
      log.save(function(err, data) {
         if (err) {
            throw err;
         } else {
            res.send(data);
            console.log(data._id);
         }
      });
   }
});
module.exports = router;
