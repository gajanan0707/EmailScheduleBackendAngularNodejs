//----------------import packages---------------------------------
var nodemailer = require('nodemailer');
const notifier = require('node-notifier');

const scheduler = require('node-schedule');
//---------------import modal---------------------------------------
const EmailShedule = require('../models/shedulemodel');
const snoozeEmail = require('../models/SnoozeModel');
const User = require('../models/users')
const UserStatus = require('../models/UserStatus')
const notificationmodel = require('../models/Notificationmodel')



//-----------------Send Mail function using Nodemailer----------- 
async function sendMail(req, res, next) {
  try {
    const EmailSchedule = EmailShedule.find().then((response) => {
      response.map(a => {
        let UserIdArray = [a.userId]
        if (a.useremail) {
          UserIdArray.concat(a.useremail)
        }

        UserStatus.find({
          userId: {
            $in: UserIdArray
          },
          isStatus: true
        }, {
          userId: 1
        }).then((response) => {
     
          let loginUserIdArray = [];
          response.map((userObj) => {
            loginUserIdArray.push(userObj.userId)
          })
          User.find({
            _id: {
              $in: loginUserIdArray
            }
          }, {
            email: 1
          }).then((response) => {
            let userEmailList = []
            response.map((userEmailObj) => {
              userEmailList.push(userEmailObj.email)
            });


            //---------------DayOfWeek Get -----------------------------------------
             let  daysget = JSON.parse(JSON.stringify(a.day));
              const dayconvert=daysget.map(item => item.id) 
              const dayOfWeeks=dayconvert.toString()

            //---------------get status On off----------------------------------- ----
            const getstatus = a.status
            //----------------get step days----------------------------------------
            let step = a.stepday.split(":")
            const getstep = step[0]
            //-----------------Date get to converted----------------------------------
            let dates = new Date(a.date)
            let getdate = dates.toLocaleDateString()
            let datetext = getdate.split(" ")

            //-----------------Tiime get to converted----------------------------------------------------------------
            let time = new Date(a.time)
            let timeget = time.toTimeString()
            datetext = timeget.split(':');

            //------------------Assign time in hour and minute -----------------------------------------------------
            const hour = datetext[0]
            const minute = datetext[1]


            //-----------------Assign Date In month and Date
            const date = dates.getDate()


            let mailTransporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "abd.bodara@gmail.com",
                pass: "password123#"
              }
            });
            //---------------Setting credentials-----------------------------
            let mailDetails = {
              from: "abd.bodara@gmail.com",
              to: userEmailList,
              subject: "The answer to life, the universe, and everything!❤️",
              html: '<button style="background-color: gold"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Start Snooze</a></button> <hr><button style="background-color: red"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn"">Stop Snooze</a></button>',

            };
            //----------------rules schedular-------------------------------------
            var rule = new scheduler.RecurrenceRule();
            rule.hour = hour == null ? null : hour;
            rule.minute = minute == null ? null : minute;
            rule.dayOfWeek = [0, new scheduler.Range(0, 6)];
            // rule.date = date == null ? null : date;

            //----------------call schedular & Send Email---------------------------------------
            scheduler.scheduleJob(rule, function () {
              if (getstatus === true) {
                mailTransporter.sendMail(mailDetails,
                  function (err, data) {
                    if (err) {
                      return ("Error Occurs", err)
                    } else {
                      //----------sending login user notification--------------------------------------
                      notifier.notify({
                        title: '🤩Email First Recieve🤩',
                        message: userEmailList,
                        icon:'http://localhost:4001/public/img-01.png',
                        sound: true,
                        wait: true,
                      });

                      //---------------create snooze -----------------------------
                      let datas = new snoozeEmail({
                        email: a.email,
                        time: time,
                        snoozeStatus: true,
                        limitsend: 12,
                        notification: 0,
                        userId: a.userId,
                        notification: 0,
                        sendsnoozetime:1
                      })
                      datas.save()

                      
                     //----------crate notification-------------------
                      let getmessageTime = data.messageTime
                      let getfrom = data.envelope.from
                      let getdatanotification = new notificationmodel({
                          messageTime: getmessageTime,
                          from: getfrom,
                          message: "a First notifications",
                          useremail: a.email,
                          userId:a.userId,
                          statusRead:false
                      })
                      getdatanotification.save()


                      //----------new user add email snooze--------------------
                      getuseridemail = [a.useremail]
                      let allUserEmail
                      let useremailall
                      let idget
                      getuseridemail.map(res => {
                        User.find({
                          _id: {
                            $in: res
                          }
                        }).then((response) => {
                          allUserEmail = response
                          allUserEmail.map(res => {
                            useremailall = res.email
                            idget = res._id 
                            //----------create snooze  user 
                            let multidata = new snoozeEmail({
                              email: useremailall,
                              time: time,
                              snoozeStatus: true,
                              limitsend: 12,
                              userId: idget,
                              notification: 0,
                              statusRead:false,
                              sendsnoozetime:1
                            })
                            let mailDetails = {
                              from: "abd.bodara@gmail.com",
                              to: useremailall,
                              subject: "The answer to life, the universe, and everything!❤️",
                              html: '<button style="background-color: gold"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Start Snooze</a></button> <hr><button style="background-color: red"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn"">Stop Snooze</a></button>',
                            };
                            mailTransporter.sendMail(mailDetails,
                              function (err, data) {
                                if (err) {
                                  return ("Error Occurs", err)
                                } else {
                                  if (useremailall == userEmailList) {
                                    notifier.notify({
                                      title: '🤩First Email Recieve🤩',
                                      message:useremailall,
                                      icon:'Terminal Icon',
                                      sound: true,
                                      wait: true,
                                    });
                                  }
                                }
                              })
                            multidata.save()
                          })
                        })
                      })
                      return ("☑Email sent successfully")
                    }
                  });

              } else {}
            });

          })
        })

      })
    })
    return EmailSchedule
  } catch (err) {
    return (err)
  }


}

//-----------------export function-----------------------------------------
module.exports = {
  sendMail
}