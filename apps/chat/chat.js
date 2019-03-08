const rrBuilder = require('../RequestBuilder');

/**
 * Join to chat with nickname
 * @param {Object} Chat nickname
 */

let nickname = null;

// eslint-disable-next-line require-jsdoc
function join({nickname: name}, {id, conn}) {
  nickname = name;
  console.log('Joined to chat with nickname', name);
  conn.sendUTF(rrBuilder.buildError(1, 'proba', id));
  conn.sendUTF(rrBuilder.buildResult(true, id));
}

// eslint-disable-next-line require-jsdoc
function send({message: msg}, {id, conn}) {
  console.log(`${nickname} is sending msg ${msg}`);
  conn.sendUTF(rrBuilder.buildResult(true, id));
}

module.exports = {
  join,
  send,
};
