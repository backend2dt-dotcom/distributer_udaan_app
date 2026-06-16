const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        mobile:String,
        type:String,
        otp:String,
        expires_at : Date

    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model("Otp", otpSchema);