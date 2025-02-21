const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const deleteUser = async (req, res) => {
	const { token } = req.params;

	try {
		// Verify JWT token
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return res.status(401).json({ message: "Unauthorized" });
		}
        
		// Ensure user ID is provided in the request body
		const { id } = req.body;
		if (!id) {
            return res.status(400).json({ message: "User ID is required" });
		}
        
		// Check if the user exists
		const existingUser = await prisma.user.findUnique({
            where: { id },
		});
		if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
		}
        
		// Delete the user
		const deletedUser = await prisma.user.delete({
			where: { id },
		});
        console.log("Token received:", token);

		res.status(200).json({ message: "User deleted successfully", deletedUser });
	} catch (error) {
		console.error("Error deleting user:", error);

		if (error.code === "P2025") {
			return res.status(404).json({ message: "User not found" });
		}

		res
			.status(500)
			.json({ message: "Error deleting user", error: error.message });
	} finally {
		await prisma.$disconnect();
	}
};

module.exports = { deleteUser };
