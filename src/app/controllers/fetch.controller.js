const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const fetch = async (req, res) => {
	const { tenantId, token } = req.params;

	try {
		// Verify JWT Token
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Fetch users
		const users = await prisma.user.findMany({
			where: { tenantId },
		});

		// Send response
		res
			.status(200)
			.json({ users: users });
	} catch (err) {
		console.error("Error fetching users:", err);
		res
			.status(500)
			.json({ message: "Error fetching users", error: err.message });
	}
};

module.exports = { fetch };
