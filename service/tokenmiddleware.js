const Usertoken = require("../models/usernew")
const userModel = require("../models/users");

module.exports = async function (req, res, next) {
    try {
        const authToken = req.headers['authorization'].split(" ");
        if (authToken[0] == "Token") {
            await Usertoken.find({
                token: authToken[1]
            }).then(async (resp) => {
                if (resp[0]) {
                    await userModel.find({
                        _id: resp[0].userId
                    }).then(async (userObj) => {
                        if (userObj[0]) {
                            req.User = userObj[0];
                            next();
                        } else {
                            res.status(401).send({
                                message: "Invalid Token"
                            });
                        }
                    })
                } else {
                    res.status(401).send({
                        message: "Invalid Token"
                    });
                }
            })


        } else {
            res.status(401).send({
                message: "Invalid Token"
            });
        }


    } catch (e) {
        console.error(e);
        res.status(401).send({
            message: "Invalid Token"
        });
    }
}