const cron = require("node-cron");
const axios = require("axios");

cron.schedule("*/30 * * * *", async () => {
    try {

        console.log("Starting Sync...");

        const response = await axios.get(
            "http://localhost:5000/api/v1/sync/distributors"
        );

        console.log("Distributor Sync Completed");
        console.log(response.data);

    } catch (error) {

        console.log("Cron Error:");

        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data);
        } else {
            console.log(error.message);
        }

    }
});