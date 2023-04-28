const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("./libs/pool");
const upload = require("./libs/multer");

const authMiddleware = require("./middlewares/auth.middleware");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Define routes for APIs
const router = express.Router();

router.post("/api/login", async function (req, res) {
	const { email, pass } = req.body;

	const { rowCount, rows } = await pool.query({
		text: "SELECT * FROM users WHERE email=$1",
		values: [email],
	});

	if (!rowCount) {
		res.status(401).send({ message: "Invalid Credentials!" });
		return;
	}

	const table_data = rows[0];

	const isMatched = await bcrypt.compare(pass, table_data.password);

	if (!isMatched) {
		res.status(401).send({ message: "Invalid Credentials!" });
		return;
	}

	// Create token
	const token = jwt.sign({ id: table_data.id }, process.env.TOKEN_KEY, {
		expiresIn: "19h",
	});

	res.send({ token, name: table_data.name });
});

//sign up
router.post("/api/users", async (req, res) => {
	const body = { ...req.body };

	const { rowCount, rows } = await pool.query({
		text: "SELECT * FROM users WHERE email=$1",
		values: [body.email],
	});

	if (rowCount) {
		res.status(400).send({ message: "User with this email already exist!" });
		return;
	}

	// Hashing user's salt and password with 10 iterations,
	const saltRounds = 10;

	// First method to generate a salt and then create hash
	const salt = await bcrypt.genSalt(saltRounds);
	const hashed_pass = await bcrypt.hash(body.pass, salt);

	const { rows: insteredRows } = await pool.query({
		text: "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id",
		values: [body.email, hashed_pass, body.name],
	});

	// Create token
	const token = jwt.sign({ id: insteredRows[0].id }, process.env.TOKEN_KEY, {
		expiresIn: "19h",
	});

	res.send({ token, name: body.name });
});

router.post(
	"/api/events",
	authMiddleware,
	upload.single("imagefile"),
	async (req, res) => {
		const body = req.body;

		//formating body obj
		const entries = Object.entries(body);
		const bodyObj = Object.fromEntries(entries);

		const image_path = "/uploads/" + req.file.filename;

		await pool.query({
			text: "INSERT INTO events(event_title, event_desc, event_date, event_time, address, image_path, user_id, property_type, zipcode) VALUES($1,$2,$3,$4,$5,$6,$7, $8, $9)",
			values: [
				bodyObj.title,
				bodyObj.desc,
				bodyObj.date,
				bodyObj.time,
				bodyObj.add,
				image_path,
				req.user.id,
				body.type,
				body.zipcode,
			],
		});

		res.status(200).send({ message: "successfully inserted!" });
	}
);

router.get("/api/events", async (req, res) => {
	const zipcode = req.query.zipcode;

	if (zipcode) {
		const { rows } = await pool.query({
			text: "SELECT events.*, users.name FROM events INNER JOIN users ON events.user_id=users.id WHERE zipcode=$1",
			values: [zipcode],
		});

		res.send(rows);
		return;
	}

	const { rows } = await pool.query({
		text: "SELECT events.*, users.name FROM events INNER JOIN users ON events.user_id=users.id",
	});

	res.send(rows);
});

router.post(
	"/api/properties",
	authMiddleware,
	upload.single("imagefile"),
	async (req, res) => {
		const body = req.body;

		//formating body obj
		const entries = Object.entries(body);
		const bodyObj = Object.fromEntries(entries);

		const image_path = "/uploads/" + req.file.filename;

		console.log(bodyObj);
		console.log(image_path);

		await pool.query({
			text: "INSERT INTO properties(prop_title, prop_desc, prop_price, prop_size_ft, address, image_path, user_id, property_type, zipcode) VALUES($1,$2,$3,$4,$5,$6,$7, $8, $9)",
			values: [
				bodyObj.title,
				bodyObj.desc,
				bodyObj.price,
				bodyObj.prop_size,
				bodyObj.address,
				image_path,
				req.user.id,
				body.type,
				body.zipcode,
			],
		});

		res.status(200).send({ message: "successfully inserted!" });
	}
);

router.get("/api/properties", async (req, res) => {
	const zipcode = req.query.zipcode;

	if (zipcode) {
		const { rows } = await pool.query({
			text: "SELECT * FROM properties INNER JOIN users ON properties.user_id=users.id WHERE zipcode=$1",
			values: [zipcode],
		});

		res.send(rows);
		return;
	}

	const { rows } = await pool.query({
		text: "SELECT properties.*, users.name FROM properties INNER JOIN users ON properties.user_id=users.id",
	});

	res.send(rows);
});

// Use the router for all API routes
app.use(router);

// Start the server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
