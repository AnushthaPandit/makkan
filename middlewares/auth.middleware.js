const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
	try {
		const token = req.query.token;
		const decoded = jwt.verify(token, process.env.TOKEN_KEY);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).send({ message: "Please login!" });
	}
};
