const express = require("express");
const router = express.Router();
const authRoute = require("./auth");
const syncRoute = require("./sync");

router.use('/auth', authRoute);
router.use('/sync', syncRoute);
module.exports = router;

