//----------------import packages---------------------------------
var nodemailer = require('nodemailer');
const notifier = require('node-notifier');

//---------sheduler Package import ----------------------
const scheduler = require('node-schedule');

//---------------import modal---------------------------------------
const snoozeshedule = require('../models/SnoozeModel')
const UserStatus = require('../models/UserStatus')
const User = require('../models/users')
const notificationmodel = require('../models/Notificationmodel')

//-----------------Send Mail function using Nodemailer----------- 
async function sendMailsnooze(req, res, next) {
    try {
        scheduler.scheduleJob("*/5 * * * *", function () {
            const snoozeshedules = snoozeshedule.find().then((response) => {
                response.map(async a => {
                    const allemail = a.email
                    const getnotification = a.notification
                    //----------get user status------------------
                    const UserIdArray = [a.userId]
                    UserStatus.find({
                            userId: {
                                $in: UserIdArray
                            },
                            isStatus: true
                        }, {
                            userId: 1
                        })
                        .then(async result => {

                            let loginUserIdArray = [];
                            result.map((userObj) => {
                                loginUserIdArray.push(userObj.userId)
                            })
                            //----------find user login-------------------
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

                                getid = a._id
                                const setlimit = a.limitsend
                                const getstatusOfSnooze = a.snoozeStatus
                                var maillist = [
                                    a.email,
                                ];

                                //----------------call schedular & Send Email---------------------------------------
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
                                    to: a.email,
                                    subject: "The answer to life, the universe, and everything!❤️",
                                    html: '<button style="background-color: gold"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Start Snooze</a></button> <hr><button style="background-color: red"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Stop Snooze</a></button>',
                                };
                                //---------------check status snooze------------------------------
                                if (getstatusOfSnooze === true) {
                                    //----------check limit-----------------------------------------
                                    if (setlimit > 0) {
                                        //--------------- mail send-----------------------------------
                                        mailTransporter.sendMail(mailDetails,
                                            function (err, data) {
                                                if (err) {
                                                    return ("Error Occurs", err)
                                                } else {
                                                    //----------decreament limit and update ---------------------------
                                                    if (data) {
                                                        let getmessageTime = data.messageTime
                                                        let getfrom = data.envelope.from

                                                        let getdatanotification = new notificationmodel({
                                                            messageTime: getmessageTime,
                                                            from: getfrom,
                                                            message: "a new notifications",
                                                            useremail: a.email,
                                                            userId:a.userId,
                                                            statusRead:false
                                                        })
                                                        getdatanotification.save()

                                                        let ab = setlimit - 1
                                                        let note = getnotification + 1
                                                        const snoozeLimit = {
                                                            limitsend: ab,
                                                            notification: note
                                                        }
                                                        snoozeshedule.findOneAndUpdate({
                                                            _id: (a._id)
                                                        }, {
                                                            $set: snoozeLimit
                                                        }, (error, data) => {
                                                            if (error) {
                                                                return (error)
                                                            } else {
                                                                return (data)
                                                            }
                                                        })
                                                    } //end limit update-------------------------------------------------

                                                    //--display notification login user------------------
                                                    if (userEmailList == allemail) {
                                                        notifier.notify({
                                                            title: '🤩New Snooze Email Recieve🤩 ',
                                                            message: userEmailList,
                                                            icon: 'http://localhost:4001/public/img-01.png',
                                                            sound: true,
                                                            wait: true,
                                                            open: void 0,
                                                            wait: false,
                                                        })
                                                    }
                                                    //----------------------------------------------------

                                                }
                                            });


                                    }
                                    //----------if limit == 0 update status false and limit reset--------------------------------- 
                                    else if (setlimit <= 0) {
                                        var ObjectId = require('mongodb').ObjectID;
                                        const snoozestop = {
                                            snoozeStatus: false,
                                            limitsend: 12
                                        }
                                        snoozeshedule.findOneAndUpdate({
                                            _id: ObjectId(getid)
                                        }, {
                                            $set: snoozestop
                                        }, (error, data) => {
                                            if (error) {
                                                return (error)
                                            } else {
                                                return ("update Snooze")
                                            }
                                        })
                                        //----------For limit over then send email for continue--------------------
                                        let mailDetails = {
                                            from: "abd.bodara@gmail.com",
                                            to: a.email,
                                            subject: "Your Snooze Email Sending limit is Over if u continue to Send Mail click on start snooze buttone",
                                            html: '<button style="background-color: gold"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Start Snooze</a></button> <hr><button style="background-color: red"><a style="color: #040404;" href="http://localhost:4200/snoozegetOn">Stop Snooze</a></button>',
                                        };
                                        mailTransporter.sendMail(mailDetails, function (err, data) {
                                            if (err) {
                                                return ("Error Occures", err)
                                            } else {

                                            }

                                        }) //end here limit sending email
                                    } //end if else for check limit 

                                } else if (getstatusOfSnooze === false) {} else(err) => {

                                    return err
                                } //if part end getstatus check
                            })
                        })
                });
            })
            return snoozeshedules
        })
    } catch (err) {
        return (err)
    }


}
//-----------------export function-----------------------------------------
module.exports = {
    sendMailsnooze
}