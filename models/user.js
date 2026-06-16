const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
     distributor_id: {
        type: Number,
        required: true,
        unique: true
    },

    app_id: String,

    sap_code: String,

    firm: String,

    mobile: String,

    email: String,

    city: String,

    district: String,

    state: String,

    pincode: String,

    address: String,

    device_token: {
        type: String,
        default: null
    },

    device_id: {
        type: String,
        default: null
    },


    device_type: {
        type: String,
        default: "android"
    },


    login_count: {
        type: Number,
        default: 0
    },

    last_login: Date,

    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});




module.exports = mongoose.model("User", userSchema);
