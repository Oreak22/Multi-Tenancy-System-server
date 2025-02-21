const express = require("express");
const router = express.Router();
const { dashboardDetails } = require("../controllers/user.controller");
const { fetch } = require("../controllers/fetch.controller");
const { deleteUser } = require("../controllers/deleteUser");

router.get("/user/:userId/tenant/:tenantId/token/:token", dashboardDetails);
router.get("/fetch/:tenantId/token/:token", fetch);
router.post("/delete/:token", deleteUser);
module.exports = router;
