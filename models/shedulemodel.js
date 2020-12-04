//---------------import packages-------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//--------------Define collection and schema-----------------
let SheduleEmail = new Schema({
   email: {
      type: String
   },
   date: {
      type: Date
   },
   time: {
      type: String
   },
   day: {
      'type': {
         type: String
      },
      'value': [String]
   },
   status: {
      type: Boolean
   },
   stepday: {
      type: String
   },
   snoozeTime: {
      type: String
   },
   stopsnooze: {
      type: Boolean
   },
   userId: {
      type: mongoose.Schema.Types.ObjectID,
      ref:"User"
   },
   useremail: {
      'type': {
         type: String
      },
      'value': [String]
   },
}, {
   collection: 'sheduleEmail'
})

//----------------export modal-------------------
module.exports = mongoose.model('SheduleEmail', SheduleEmail)