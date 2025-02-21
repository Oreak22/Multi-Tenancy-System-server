const { PrismaClient } = require("@prisma/client");
// const Tenant = require("../models/tenate.model");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const register = async (req, res) => {

	try {
		const { companyDetails, formDetails } = req.body;

		// Checking if tenant exists
		let existingTenantByDomain = await prisma.Tenant.findUnique({
			where: {
				domain: companyDetails.domain,
			},
		});
		let existingTenantByEmail = await prisma.Tenant.findUnique({
			where: {
				email: companyDetails.email,
			},
		});
		if (existingTenantByDomain || existingTenantByEmail) {
			console.log([existingTenantByDomain, existingTenantByEmail]);
			return res.status(400).json({
				message: existingTenantByDomain
					? "Domain registed to another company"
					: existingTenantByEmail && "Email registed to another company",
			});
		}

		// Creating new tenant
		const savedTenant = await prisma.tenant.create({
			data: {
				name: companyDetails.companyName,
				email: companyDetails.email,
				domain: companyDetails.domain,
			},
		});
		console.log(savedTenant);

		// hasing password
		const sailRound = process.env.SAILROUND;
		const hashedPassword = await bcrypt.hash(formDetails.password, 10);

		// Creating Admin User in Prisma
		const user = await prisma.user.create({
			data: {
				name: formDetails.name,
				email: formDetails.email,
				password: hashedPassword,
				tenantId: savedTenant.id.toString(),
				role: "admin",
			},
		});

		res.status(201).json({ user, tenant: savedTenant });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error registering tenant", error: error.message });
		console.log(error);
	}
};

const createUser = async (req, res) => {
	try {
		// Creating user
		const user = await prisma.user.create({
			data: {
				name: req.body.name,
				email: req.body.email,
				tenantId: req.body.tenantId,
				password:'',
				role: "user",
			},
		});

		// Generate token for the new user
		

		res.status(201).json({ message: "User created",  user });
	} catch (err) {
		console.error("Error creating user:", err);
		res
			.status(500)
			.json({ message: "Error creating user", error: err.message });
	}
};
module.exports = { register , createUser };
