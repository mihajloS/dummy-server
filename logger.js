const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: 'combined.log'}),
  ],
});

// Disable logs for unit testing
if (process.env.NODE_ENV === 'test') {
  logger.clear()
  logger.add(new winston.transports.Console({silent: true}));
}

module.exports = {logger};
