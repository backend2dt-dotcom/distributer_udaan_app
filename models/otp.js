const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        mobile:{
            type: String,
            required:true
        },
        type:String,
        otp:String,
        expires_at : Date

    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model("Otp", otpSchema);
