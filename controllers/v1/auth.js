const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Otp = require("../../models/otp");



exports.sendOtp = async (req, res) => {
    try {

        const { mobile } = req.body;

        if (!mobile) {
            return res.status(400).json({
                status: false,
                message: "Mobile is required"
            });
        }

        const response = await axios.get(
            `${process.env.DISTRIBUTER_API_URL}/${mobile}`
        );
        

       const distributorData = response?.data?.data;

        if (!response?.data?.status || !distributorData) {
            return res.status(404).json({
                status: false,
                message: "Distributor Not Found"
            });
        }

        const otp = "123456";
        // const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.deleteMany({ mobile });

        await Otp.create({
            mobile,
            otp,
            expires_at: new Date(
                Date.now() + 5 * 60 * 1000
            )
        });

        return res.json({
            status: true,
            message: "OTP Sent",
            otp
        });

    } catch (error) {

        if(process.env.ENVIRONMENT === "development"){
             return res.status(500).json({
                status: false,
                message: error.message
            });
        }else{
            return res.status(500).json({
                status: false,
                message: "Internal Server Error"
            });
        }
       

    }
};



exports.verifyOtp = async (req, res) => {

    try {

        const {
            mobile,
            otp,
            device_token,
            device_id,
            device_type
        } = req.body;

        const otpData = await Otp.findOne({
            mobile,
            otp
        });

        if (!otpData) {

            return res.status(400).json({
                status: false,
                message: "Invalid OTP"
            });
        }

        if (otpData.expires_at < new Date()) {
            return res.status(400).json({
                status: false,
                message: "OTP expired"
            });
        }

        const response = await axios.get(
            `${process.env.DISTRIBUTER_API_URL}/${mobile}`
        );

       const distributorData = response?.data?.data;

        if (!response?.data?.status || !distributorData) {
            return res.status(404).json({
                status: false,
                message: "Distributor Not Found"
            });
        }

        const distributor = response?.data?.data;

        const user = await User.findOneAndUpdate(

            {
                distributor_id: distributor.id
            },

            {
                $set: {

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

                    distributor_data:
                        distributor,

                    device_token,

                    device_id,

                    device_type,

                    last_login:
                        new Date(),

                    last_sync_at:
                        new Date(),

                    is_active:
                        true
                },

                $inc: {
                    login_count: 1
                }
            },

            {
                new: true,
                upsert: true
            }
        );

        const token =
            jwt.sign(
                {
                    user_id: user._id,
                    distributor_id:distributor.id,
                    mobile:distributor.mobile1
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
            status: true,
            message: "Login Successful",
            token,
            user
        });

    } catch (error) {

        if(process.env.ENVIRONMENT === "development"){
             return res.status(500).json({
                status: false,
                message: error.message
            });
        }else{
            return res.status(500).json({
                status: false,
                message: "Internal Server Error"
            });
        }
        

    }

};

exports.profile = async (req, res) => {
    const user = await User.findById(req.user.user_id)
        .select("mobile distributor_data.user_profile.name distributor_data.user_profile.profile_image distributor_data.verification_details_gst distributor_data.user_profile.pan_no distributor_data.user_profile.dl_no distributor_data.email distributor_data.division user_profile.emp_id user_profile.org_id user_profile.designation");

    const formatted = {
        name: user?.distributor_data?.user_profile?.name,
        image: user?.distributor_data?.user_profile?.profile_image,
        mobile: user?.mobile,
        gstnumber: user?.distributor_data?.verification_details_gst,
        pancard_number: user?.distributor_data?.user_profile?.pan_no,
        dl_21b: user?.distributor_data?.user_profile?.dl_no, // adjust mapping if different
        dl_21c: null, // only if exists in DB
        email: user?.distributor_data?.email?.email, // only if exists in DB
        division: user?.distributor_data?.division?.division,
        emp_id: user?.user_profile?.emp_id?.emp_id,
        org_id: user?.user_profile?.org_id?.org_id,
        designation: user?.user_profile?.designation?.designation,
    };

    return res.json({
        status: true,
        data: formatted
    });
};


exports.resendOtp = async (req, res) => {
    try{

        const { mobile } = req.body;

        const response = await axios.get(
            `${process.env.DISTRIBUTER_API_URL}/${mobile}`
        );

        const distributorData = response?.data?.data;

        if (!response?.data?.status || !distributorData) {
            return res.status(404).json({
                status: false,
                message: "Distributor Not Found"
            });
        }

        const otp = "123456";
        // const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.deleteMany({ mobile });

        await Otp.create({
            mobile,
            otp,
            expires_at: new Date(
                Date.now() + 5 * 60 * 1000
            )
        });

        return res.json({
            status: true,
            message: "OTP Sent",
            otp
        });


    }catch(error){
        if(process.env.ENVIRONMENT === "development"){
            return res.status(500).json({
                status:false,
                message:error.message
            });
        }else{
            return res.status(500).json({
                status:false,
                message:"Internal Server Error"
            });
        }
    }
}

exports.logout = async (req, res) => {

    await User.findByIdAndUpdate(
        req.user.user_id,
        {
            device_token: null
        }
    );

    return res.json({
        status: true,
        message: "Logged Out"
    });
};