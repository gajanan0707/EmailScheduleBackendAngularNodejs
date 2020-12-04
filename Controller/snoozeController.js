//----------import model---------------------------------------------
const SnoozeShedule = require('../models/SnoozeModel')
const notificationmodel = require('../models/Notificationmodel')

//----------get EmailShedule DAta----------------------------------------
exports.getSnoozeshedule = async (req, res) => {
  try {
    let datas = await SnoozeShedule.find()
    res.status(200).json({
      data: datas,
    })
  } catch (err) {}
}


//---------------Update Snooze status-------------------------------------------
exports.snoozeupdate = async (req, res, next) => {
  var ObjectId = require('mongodb').ObjectID;
  const snoozeupdate = {
    snoozeStatus: req.body.snoozeStatus
  }
  SnoozeShedule.findByIdAndUpdate({
    _id: ObjectId(req.params.id)
  }, {
    $set: snoozeupdate
  }, (error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      res.json(data)
      return ("update Snooze")
    }
  })
}


//----------get notificationmodel DAta-----------------------------
exports.getnotification = async (req, res) => {
  try {
    let notification = await notificationmodel.find({
      userId: req.User._id
    }).sort({statusRead:false}) 
    res.status(200).json({
      data: notification
    })
  } catch (err) {
    res.status(400)
  }
}

//----------notification read unread
exports.notificationreadunread = async (req, res) => {
  var ObjectId = require('mongodb').ObjectID;
  const statusupdate = {
    statusRead: req.body.statusRead
  }
  notificationmodel.findByIdAndUpdate({
    _id: ObjectId(req.params.id)
  }, {
    $set: statusupdate,
    upsert: true,
    new: true
  }, (error, data) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      res.json(data)
      return ("update Notification")
    }
  })
}

//----------get unread notificationmodel------------------
exports.getunreaddata= async (req, res)=>{
  try {
    let notification = await notificationmodel.find({
      userId: {
        $in:req.User._id
      },statusRead: false}, {
        statusRead: 1
      })
    res.status(200).json({
      data: notification
    })
  } catch (err) {
    res.status(400)
  }

}