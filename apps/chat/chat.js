const log = require('../../logger').logger;
const rrBuilder = require('../RequestBuilder');
rrBuilder.setModuleName('Chat')
const Validator = require('jsonschema').Validator;
const validate = new Validator();

/**
 * Join to chat with nickname
 * @param {Object} Chat nickname
 */

const joinSchema = {
  additionalProperties: false,
  properties: {
    'nickname': {'type': 'string', 'minLength': 2},
  },
  required: ['nickname'],
};

/**
 * Join API
 * @param {Any} data Request data
 * @param {Object} id stands for request id
 * conn stands for websocket connection
 * wsServer is Websocket server instance
 * @return {undefined} Nothing
 */
function join(data, {id, conn, wsServer}) {
  const val = validate.validate(data, joinSchema);
  if (!val.valid) {
    return conn.sendUTF(rrBuilder.buildError(1, 'Invalid request', id));
  }
  const {nickname: name} = data;
  log.info('Joined to chat with nickname', name);

  conn.nickname = name;
  // send join notification to all connections
  const roster = [];
  conn.leaveEvent = leaveFactory(conn.ID, wsServer);
  wsServer.connections.forEach((connInstance, index) => {
    roster.push({userId: connInstance.ID, nickname: connInstance.nickname});
  });
  // return result
  conn.sendUTF(rrBuilder.buildResult({userId: conn.ID, roster}, id));
  wsServer.broadcast(rrBuilder.buildNotification(
      {
        'userId': conn.ID,
        'nickname': name,
      },
      'onJoin'
  ));
}
/**
 * Factory for connection leaving chat function event
 * @param {Number} userId is id of user that is leaving
 * @param {Number} wsServer is instance of Websocket server
 * @return {Function} Leave function
 */
function leaveFactory(userId, wsServer) {
  log.info('This is factory');
  console.log('userId :', userId);
  return () => {
    log.info(`User with id ${userId} is left chat by disconnect`);
    wsServer.broadcast(rrBuilder.buildNotification({userId}, 'onLeave'));
  }
}

// eslint-disable-next-line require-jsdoc
function send({message}, {id, conn, wsServer}) {
  // FIXME: validate params
  // log.info('conn.nickname :', conn.nickname);
  if (!conn.nickname) {
    return conn.sendUTF(rrBuilder.buildError(1, 'First you need to join' +
      ' chat with valid nickname', id));
  }
  // client response
  conn.sendUTF(rrBuilder.buildResult(true, id));
  // log.info(`${nickname} is sending msg ${msg}`);
  // broadcast message to all connections
  wsServer.broadcast(rrBuilder.buildNotification(
      {
        message,
        userId: conn.ID,
      },
      'onMessage'));
}

module.exports = {
  join,
  send,
};
