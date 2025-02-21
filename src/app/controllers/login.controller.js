const { PrismaClient } = require("@prisma/client");
const bycrypt = require("bcryptjs");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
	try {
        // finding user
		const user = await prisma.user.findUnique({
			where: {
				email: req.body.email,
			},
		});
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
        // varlidating password
		const isPasswordValid = await bycrypt.compare(
			req.body.password,
			user.password,
		);
		// Generating JWT Token
		const token = jwt.sign(
			{ userId: user.id, tenantId: user.tenantId },
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			},
		);

		if (isPasswordValid) {
			return res.status(200).json({
				message: "Login successful",
				cache: {
					userId: user.id,
					spaceId: user.tenantId,
					role: user.role,
					status: user.status,
					name: user.name,
					email: user.email,
					token,
				},
			});
		} else {
			console.log(req.body.password, isPasswordValid);
			console.log("not successfull");
			return res.status(401).json({ message: "Invalid password" });
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports = { login };
