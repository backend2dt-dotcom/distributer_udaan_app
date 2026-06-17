const express = require("express");
const router = express.Router();

const syncDistributer = require("../../controllers/v1/syncDistributer");
router.get("/distributors", syncDistributer.syncDistributers);

module.exports = router;