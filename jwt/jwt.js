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
 * Validate token and return data from it
 * @param {String} token
 * @return {undefined}
 */
function validateToken(token) {
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
