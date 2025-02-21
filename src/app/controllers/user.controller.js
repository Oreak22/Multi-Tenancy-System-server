const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const dashboardDetails = async (req, res) => {
	try {
		const { userId, tenantId, token } = req.params;

		// Verify JWT token
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		// Fetch user
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Fetch tenant
		const tenant = await prisma.tenant.findUnique({
			where: { id: tenantId },
		});

		if (!tenant) {
			return res.status(404).json({ message: "Tenant not found" });
		}

		res.status(200).json({ data: { user, tenant } });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { dashboardDetails };
