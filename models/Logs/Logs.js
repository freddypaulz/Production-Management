const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
   Request_Id: { type: String, required: true },
   Address: {
      From: { type: String, required: true },
      To: { type: String, required: true }
   },
   Entry_Date: { type: Date, default: Date.now, required: true },
   Comments: { type: String, default: '-', required: true }
});

const Logs = mongoose.model('Logs', logSchema);

module.exports = Logs;
