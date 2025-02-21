const mongoose = require("mongoose");
require("dotenv").config();

const TenantSchema = new mongoose.Schema({
	name: { type: String, required: true },
	domain: { type: String, unique: true, required: true },
	email: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tenant", TenantSchema);
