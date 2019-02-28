const log = require('../../logger').logger;
const nodemailer = require('nodemailer');
const Email = require('../../dbmodels/contact/email');
const config = require('config').email;

/**
 * API Send and store email
 * @param {Object} req
 * @param {Object} res
 */
async function emailToMihajlo(req, res) {
  const message = req.body.message;
  const from = req.body.from;
  const isSent = await sendEmail(from, message);
  const isStoredEmail = await storeEmailToDB(from, message);

  const logMsg = isSent ? 'is sent with success.' :
      'is not sent because of an error!';
  log.info(`Email ${logMsg}`);

  if (isStoredEmail) {
    res.json(isStoredEmail);
    log.info(`Email ${JSON.stringify(isStoredEmail)} stored with success`);
  } else {
    res.send('Email not stored to db');
    log.info('Email not stored in db');
  }
}

/**
 * Store email to database
 * @param {String} from
 * @param {String} message
 */
async function storeEmailToDB(from, message) {
  const newEmail = new Email({from, message});
  const saved = await newEmail.save().catch((err) => {
    return false;
  });
  return saved;
}

/**
 * Email send
 * @param {String} fromEmail
 * @param {String} message
 */
async function sendEmail(fromEmail, message) {
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
    log.error('Error in SMTP connection');
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

  log.info(`Message sent: ${JSON.stringify(info)}`);
  log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  return true;
}

module.exports = {emailToMihajlo};
