const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(email, subject, message) {
	let testAccount = await nodemailer.createTestAccount();

	let transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: testAccount.user, // generated ethereal user
			pass: testAccount.pass, // generated ethereal password
		},
	});

	let info = await transporter.sendMail({
		from: '"Fred Foo 👻" <foo@example.com>', // sender address
		to: email, // list of receivers
		subject: subject, // Subject line
		text: message, // plain text body
	});

	console.log("Message sent: %s", info.messageId);

	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function sendGmail(email, subject, message) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.smtp_email,
			pass: process.env.smtp_pass,
		},
	});

	let info = await transporter.sendMail({
		from: '"Fred Foo 👻" <foo@example.com>', // sender address
		to: email, // list of receivers
		subject: subject, // Subject line
		text: message, // plain text body
	});
}

module.exports = main;
