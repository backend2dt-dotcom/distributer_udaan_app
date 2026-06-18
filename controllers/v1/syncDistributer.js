const axios = require("axios");
const User = require("../../models/user");
const uploadToS3 = require("../../helpers/uploadToS3");
// const {syncDocuments} = require("../../helpers/syncDocuments");

exports.syncDistributers = async (req, res) => {
    try {

        const response = await axios.get(
            process.env.SYNC_DISTRIBUTER_API_URL
        );

        const distributers =
            response?.data?.data || [];

        let syncCount = 0;

        for (const distributer of distributers) {
            // distributer = await syncDocuments(distributer);

            await User.updateOne(
                {
                    distributor_id: distributer.id
                },
                {
                    $set: {

                        distributor_id:
                            distributer.id,

                        app_id:
                            distributer.app_id,

                        sap_code:
                            distributer.sap_code,

                        firm:
                            distributer.firm,

                        mobile:
                            distributer.mobile1,

                        email:
                            distributer.email,

                        distributor_data:
                            distributer,

                        last_sync_at:
                            new Date(),

                        is_active: true
                    }
                },
                {
                    upsert: true
                }
            );

            syncCount++;
        }

        return res.status(200).json({
            status: true,
            message: "Distributors Synced Successfully",
            synced_count: syncCount
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};