//---------------import packages-------------------------
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//--------------create User modal-----------------
const userstatus = new Schema({
    isStatus: {
        type: Boolean,    
    },
    userId: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model("userStatus", userstatus);