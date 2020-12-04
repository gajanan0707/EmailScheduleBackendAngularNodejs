//---------------import packages-------------------------
const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

//--------------create User modal-----------------
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isStatus:{
        type: Boolean
    },
}, {
    timestamps: true,
});

//--------------hashpassword---------------------------------
userSchema.methods.hashPassword = async (password) => {
    return await bcrypt.hashSync(password, 10);
}

//--------------compare password------------------------------
userSchema.methods.compareUserPassword = async (inputtedPassword, hashedPassword) => {
    return await bcrypt.compare(inputtedPassword, hashedPassword)
}

//--------------genrate token---------------------------------
userSchema.methods.generateJwtToken = async (payload, secret, expires) => {
    return jwt.sign(payload, secret, expires)
}

//--------------export user modal------------------------------
module.exports = mongoose.model("User", userSchema);
userSchema.plugin(uniqueValidator, {
    message: '{PATH} Already in use'
});