"use strict"
const nodemailer = require("nodemailer");

async function sendEmail(from_email, message) {
	let promise = main(from_email, message).catch(e => console.log("main email error", e))
	return await promise
}

async function main(from_email, message) {
	let transport = nodemailer.createTransport({
	  // move to config
	  host: "smtp.mail.yahoo.com",
	  port: 465,
	  secure: true,
	  auth: {
	    user: "mihajlosupic.cv@yahoo.com",
	    pass: "Mojacvadresa" // hide
	  }
	});

	// verify connection configuration
	const transpromise = transport.verify()
	const verify_result = await transpromise
	if (!verify_result) {
		console.log('Error in SMTP connection')
		return false
	}

	// setup email data with unicode symbols
	let mailOptions = {
		from: '"Mihajlo Supic CV 👻" <mihajlosupic.cv@yahoo.com>', // sender address
		to: "mihajlosupic@gmail.com", // list of receivers
		subject: "Portfolio poruka ✔", // Subject line
		text: "Hello world?", // plain text body
		html: `<b>Contact email: ${from_email}</b><br/><p>${message}</p>` // html body
	};

	// send mail with defined transport object
	let info = await transport.sendMail(mailOptions)

	console.log("Message sent: %s", JSON.stringify(info));
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	return true
}

exports.sendEmail = sendEmail