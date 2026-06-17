const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    distributor_id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },

    app_id: {
        type: String,
        index: true
    },

    mobile: {
        type: String,
        index: true
    },

    firm: String,

    sap_code: String,

    email: String,

    distributor_data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

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

    last_sync_at: Date,

    is_active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);