const mongoose = require("mongoose");

const connectDb = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ MONGO_URI is not defined in environment variables");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDb;
