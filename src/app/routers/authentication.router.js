const express = require("express");
const { register, createUser } = require("../controllers/register.controller");
const { login } = require("../controllers/login.controller");
const router = express.Router();

router.post("/register", register);
router.post("/register/:token", createUser);
//
router.post("/login", login);

module.exports = router;
