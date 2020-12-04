//------------import packages-------------------------
const express = require("express");
const router = express.Router();

//------------import usercontroller file---------------
const userController = require("../Controller/userController");
const snnozecontroller = require("../Controller/snoozeController")
const checkUserToken = require("../service/tokenmiddleware")


//*****************************Defined the Router api*****************************************

//------------register user Route api----------------------------
router.post("/register", userController.registerNewUser);

//------------loginUser user Route api----------------------------
router.post("/login", userController.loginUser);

//------------loginUser get user Route api----------------------------
router.get("/profile", checkUserToken, userController.getloginuser);

//------------logout user Route api----------------------------
router.get("/logout", checkUserToken, userController.logout);

//------------emailshedule  Route api----------------------------
router.post('/sheduleemail', checkUserToken, userController.emailshedule);

//------------updateshedule  Route api----------------------------
router.put('/updateShedule/:id', checkUserToken, userController.updateshedule);

//------------updateStatus  Route api----------------------------
router.put('/status/:id', checkUserToken, userController.updateStatus);

//------------getemailshedule  Route api----------------------------
router.get('/getemailshedule', checkUserToken, userController.getemailshedule);

//------------deleteShedule  Route api----------------------------
router.delete('/deletshedule/:id', checkUserToken, userController.deleteShedule);

//------------getSnoozeshedule  Route api----------------------------
router.get('/getsnooze', checkUserToken, snnozecontroller.getSnoozeshedule)

//------------snoozeupdate  Route api----------------------------
router.put('/snoozeupdate/:id', checkUserToken, snnozecontroller.snoozeupdate);

//-----------getuser------------------------------------------- 
router.get('/getusers', checkUserToken, userController.getuser);

//-----------useremail add--------------------------------------
router.put('/adduser/:id', checkUserToken, userController.getemailuseradd);

//-----------update user login status---------------------------------------
router.get('/updateuserStatus/:id', checkUserToken, userController.userLoginStatus)

//------------get notification ---------------------------
router.get('/getnotification', checkUserToken, snnozecontroller.getnotification);

//-----------notification status----------------------------------------------- 
router.put('/notificationstatus/:id', checkUserToken, snnozecontroller.notificationreadunread);

//-----------Get unread Notification status-------------------------------------
router.get('/getunreadstatus', checkUserToken, snnozecontroller.getunreaddata)

//------------export router-------------------------------------------------
module.exports = router;