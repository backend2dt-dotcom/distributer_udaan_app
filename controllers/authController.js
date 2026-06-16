const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");

exports.sendOtp = async (req, res) => {
    try {

        const { mobile } = req.body;

        const response = await axios.get(
            `${process.env.DISTRIBUTER_API_URL}/${mobile}`
        );

        if (
            !response.data.status ||
            !response.data.data.length
        ) {
            return res.status(404).json({
                success: false,
                message: "Distributor Not Found"
            });
        }

        const otp = "123456";

        await Otp.deleteMany({ mobile });

        await Otp.create({
            mobile,
            otp,
            expires_at: new Date(
                Date.now() + 5 * 60 * 1000
            )
        });

        return res.json({
            success: true,
            message: "OTP Sent",
            otp
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



exports.verifyOtp = async (req, res) => {

    try {

        const {
            mobile,
            otp,
            device_token,
            device_id,
            device_name,
            device_type,
            app_version
        } = req.body;

        const otpData = await Otp.findOne({
            mobile,
            otp
        });

        if (!otpData) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const response = await axios.get(
            `${process.env.DISTRIBUTER_API_URL}/${mobile}`
        );

        if (
            !response.data.status ||
            !response.data.data.length
        ) {

            return res.status(404).json({
                success: false,
                message: "Distributor Not Found"
            });
        }

        const distributor =
            response.data.data[0];

        let user =
            await User.findOne({
                distributor_id:
                    distributor.id
            });

        const address =
            `${distributor.oaddress1 || ''} ${distributor.oaddress2 || ''} ${distributor.oaddress3 || ''}`;

        if (!user) {

            user = await User.create({

                distributor_id:
                    distributor.id,

                app_id:
                    distributor.app_id,

                sap_code:
                    distributor.sap_code,

                firm:
                    distributor.firm,

                mobile:
                    distributor.mobile1,

                email:
                    distributor.email,

                city:
                    distributor.city,

                district:
                    distributor.district,

                state:
                    distributor.state,

                pincode:
                    distributor.pincode,

                address,

                device_token,

                device_id,

                device_name,

                device_type,

                app_version,

                login_count: 1,

                last_login:
                    new Date()
            });

        } else {

            user.firm =
                distributor.firm;

            user.mobile =
                distributor.mobile1;

            user.email =
                distributor.email;

            user.address =
                address;

            user.device_token =
                device_token;

            user.device_id =
                device_id;

            user.device_name =
                device_name;

            user.device_type =
                device_type;

            user.app_version =
                app_version;

            user.last_login =
                new Date();

            user.login_count += 1;

            await user.save();
        }

        const token =
            jwt.sign(
                {
                    user_id:
                        user._id,

                    distributor_id:
                        distributor.id,

                    mobile:
                        distributor.mobile1
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "30d"
                }
            );

        await Otp.deleteMany({
            mobile
        });

        return res.json({
            success: true,
            message: "Login Successful",
            token,
            user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.profile = async (req, res) => {
    try{

        const user = User.findById(req.user.user_id);

        return res.json({
            status:true,
            data:user
        });
            
        
    }catch(error){
        return res.status(500).json({
            status:false,
            message:error.message
        });
    }
}