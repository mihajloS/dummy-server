const log = require('../logger').logger;
const jwt = require('jsonwebtoken');
const secretTokenKey = 'secretTokenWorkdThatOnlyBackendKnows';


/**
 * Sign new JWT token
 * @param {Object} data Data to sign to token
 * @return {undefined}
 */
function signToken(data) {
  return new Promise((resolve, reject) => {
    jwt.sign(data, secretTokenKey, (err, token) => {
      if (err) {
        log.error('Token generate: ' + err);
        reject(err);
        return;
      }
      resolve(token);
    });
  });
}

/**
 * Validate token extracted from request object
 * @param {Object} req
 * @return {undefined}
 */
function validateToken(req) {
  let token = req.get('Authorization');
  log.info('validateToken token = ' + token);
  if (!token) {
    throw new Error('Token was not provided.');
  }
  // Extract token from string 'Bearer xxxyyyzzz'
  token = token.split(' ')[1];
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretTokenKey, (err, data) => {
      if (err) {
        log.error('Token validate: ' + err);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

module.exports = {signToken, validateToken};
