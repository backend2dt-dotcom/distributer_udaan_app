const axios = require("axios");
const time= require("mime-types");

const { PutobjectCommand } = require("@aws-sdk/client-s3");

const s3 = require("../config/s3");

module.exports = async (imageUrl, key) => {
    const response = await axios.get(imageUrl,{
        responseTyoe:"arraybuffer"
    });

    const command = new PutobjectCommand({
        Bucket: process.env.AWS_BUCKET,

        Key:key,

        Body: response.data,

        ContentType: mime.lookup(key) || "application/octet-stream"
    });

    await s3.send(command);

    return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazoneaws.com/${key}`;


};