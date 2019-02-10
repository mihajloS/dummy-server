const nodemailer = require("nodemailer");
const Email = require('../dbmodels/contact/email')
const config = require("config").email

function emailToMihajlo(req, res) {
  console.log('email to mihajlo', req.body)
  const message = req.body.message
	const from = req.body.from
	let promise = main(from, message).catch(e => console.log("main email error", e))

    promise.then((success) => {
			if (!success) return res(success)
			const new_email = new Email({from, message})
			new_email.save((err, email )=> {
				if (err) {
					console.error('Email error', err)
					res.send(err)
				}
				else {
					console.log('email sent', email)
					res.json(email)
				}
			})
    })
}

async function main(from_email, message) {
	let transport = nodemailer.createTransport({
	  host: config.sender.host,
	  port: config.sender.port,
	  secure: config.sender.secure,
	  auth: {
	    user: config.sender.user,
	    pass: config.sender.pass
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
		from: config.recipient.from,
		to: config.recipient.to,
		subject: "Portfolio poruka ✔", // Subject line
		text: "Portfolio poruka text", // plain text body
		html: `<b>Contact email: ${from_email}</b><br/><p>${message}</p>` // html body
	};

	// send mail with defined transport object
	let info = await transport.sendMail(mailOptions)

	console.log("Message sent: %s", JSON.stringify(info));
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	return true
}

module.exports = { emailToMihajlo }