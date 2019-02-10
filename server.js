const log = require('./logger').logger;
const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 8000;
const contact = require('./contact/contact');
const mongoose = require('mongoose');
const config = require('config').db;

mongoose.connect(config.dbUri, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', log.error.bind(log, 'Db error:'));
db.on('open', ()=>{
  log.info(`Db connection success [${config.description}]`);
  app.emit('appStarted');
});

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);

app.use(express.json()); // for parsing application/json
app.use(morgan('dev')); // for loging requests

app.get('/', (req, res) => {
  res.send('Index page');
});

app.route('/contact_mihajlo').post(contact.emailToMihajlo);

app.listen(PORT, () => {
  log.info(`App listening on port ${PORT}`);
});

module.exports = app; // for testing
