const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authenticationRouter = require("../routers/authentication.router");
const dashboardRouter = require("../routers/user.router");

dotenv.config();
// database connection
const databaseUrl = process.env.DATABASE_URL;
mongoose
	.connect(databaseUrl)
	.then(() => {
		console.log("connected");
	})
	.catch((err) => {
		console.log(err);
	});

//  Middleware Connections
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());

// routes
app.use("/api", authenticationRouter);
app.use("/user", dashboardRouter);
app.get("/", (req, res) => {
	res.send("Hello from Vercel!");
});

// connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
