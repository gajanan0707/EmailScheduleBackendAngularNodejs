//---------------import packages-------------------------
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//--------------create User modal-----------------
const userToken = new Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model("userToken", userToken);