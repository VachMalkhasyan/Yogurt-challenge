const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerLogSchema = new Schema({
  customerId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = CustomerLog = mongoose.model("customerLog", CustomerLogSchema);
