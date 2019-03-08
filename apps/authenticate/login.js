const rrBuilder = require('../RequestBuilder');
/**
* Handle Authentication tasks
*/


/**
   * Authenticate user
   * @param {String} user
   * @param {String} pass
   * @param {String} type
 */
function login({user, pass, type}, {id, conn}) {
  console.log(user);
  console.log(pass);
  console.log(type);
  conn.sendUTF(rrBuilder.buildResult(true, id));
}

module.exports = {
  login,
};
