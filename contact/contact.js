const nodemailer = require('nodemailer');
const Email = require('../dbmodels/contact/email');
const config = require('config').email;

/**
 * Send and store email
 * @param {Object} req
 * @param {Object} res
 */
function emailToMihajlo(req, res) {
  console.log('email to mihajlo', req.body);
  const message = req.body.message;
  const from = req.body.from;
  const promise = main(from, message)
      .catch((e) => console.log('main email error', e));

  promise.then((success) => {
    if (!success) return res(success);
    const newEmail = new Email({from, message});
    newEmail.save((err, email )=> {
      if (err) {
        console.error('Email error', err);
        res.send(err);
      } else {
        console.log('email sent', email);
        res.json(email);
      }
    });
  });
}

/**
 * Email send
 * @param {String} fromEmail
 * @param {String} message
 */
async function main(fromEmail, message) {
  const transport = nodemailer.createTransport({
    host: config.sender.host,
    port: config.sender.port,
    secure: config.sender.secure,
    auth: {
      user: config.sender.user,
      pass: config.sender.pass,
    },
  });

  // verify connection configuration
  const transpromise = transport.verify();
  const verifyResult = await transpromise;
  if (!verifyResult) {
    console.log('Error in SMTP connection');
    return false;
  }

  // setup email data with unicode symbols
  const mailOptions = {
    from: config.recipient.from,
    to: config.recipient.to,
    subject: 'Portfolio poruka ✔', // Subject line
    text: 'Portfolio poruka text', // plain text body
    html: `<b>Contact email: ${fromEmail}</b><br/><p>${message}</p>`,
  };

  // send mail with defined transport object
  const info = await transport.sendMail(mailOptions);

  console.log('Message sent: %s', JSON.stringify(info));
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  return true;
}

module.exports = {emailToMihajlo};
