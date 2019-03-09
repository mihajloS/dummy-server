const rrBuilder = require('../RequestBuilder');

/**
 * Join to chat with nickname
 * @param {Object} Chat nickname
 */

// eslint-disable-next-line require-jsdoc
function join({nickname: name}, {id, conn, wsServer}) {
  // FIXME: validate params
  console.log('Joined to chat with nickname', name);
  // conn.sendUTF(rrBuilder.buildError(1, 'proba', id));
  conn.nickname = name;
  wsServer.broadcast(rrBuilder.buildNotification(
      {'joined': name},
      'chat.onJoin'
  ));
  conn.sendUTF(rrBuilder.buildResult(true, id));
}

// eslint-disable-next-line require-jsdoc
function send({message: msg}, {id, conn, wsServer}) {
  // FIXME: validate params
  if (!conn.nickname) {
    return conn.sendUTF(rrBuilder.buildError(1, 'First you need to join' +
      ' chat with valid nickname', id));
  }
  // console.log(`${nickname} is sending msg ${msg}`);
  wsServer.broadcast(rrBuilder.buildNotification(msg, 'chat.onMessage'));
  conn.sendUTF(rrBuilder.buildResult(true, id));
}

module.exports = {
  join,
  send,
};
