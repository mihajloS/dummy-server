const log = require('./logger').logger;
const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 8000;
const contact = require('./routes/contact/contact');
const authenticate = require('./routes/authenticate/login');
const mongoose = require('mongoose');
const server = require('http').createServer();
const WebSocketServer = require('websocket').server;
const config = require('config').db;
const dataRouter = require('./ws-router');

// Database init
mongoose.connect(config.dbUri, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', log.error.bind(log, 'Db error:'));
db.on('open', () => {
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

// Quick test page
app.get('/', (req, res) => {
  res.send('Index page');
});

// email api
app.route('/contact_mihajlo')
    .post(contact.emailToMihajlo);

app.use('/auth', authenticate);

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

/**
 * Validate origin
 * @param {Object} origin
 * @return {Boolean} true if valid
 */
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

server.on('request', app);

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    logger.error((new Date()) + ' Connection from origin ' +
      request.origin + ' rejected.');
    return;
  }

  // craches on wrong protocol FIXME
  const connection = request.accept('m-protocol', request.origin);
  log.info((new Date()) + ' Connection accepted.');

  connection.on('message', function(message) {
    log.info('>> >> msg ' + message);
    if (message.type === 'utf8') {
      dataRouter.route(connection, message.utf8Data);
    } else if (message.type === 'binary') {
      log.info('Received Binary Message of ' +
        message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on('close', function(reasonCode, description) {
    log.info((new Date()) + ' Peer ' +
      connection.remoteAddress + ' disconnected.');
  });
});

server.listen(PORT, () => {
  log.info(`App listening on port ${PORT}`);
});

module.exports = app; // for testing
