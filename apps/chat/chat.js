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

// eslint-disable-next-line require-jsdoc
function join(data, {id, conn, wsServer}) {
  const val = validate.validate(data, joinSchema);
  if (!val.valid) {
    return conn.sendUTF(rrBuilder.buildError(1, 'Invalid request', id));
  }
  const {nickname: name} = data;
  // console.log('Joined to chat with nickname', name);

  conn.nickname = name;
  // console.log('conn.nickname :', conn.nickname);
  // return result
  conn.sendUTF(rrBuilder.buildResult({userId: conn.ID}, id));
  // send join notification to all connections
  wsServer.broadcast(rrBuilder.buildNotification(
      {
        'userId': conn.ID,
        'nickname': name,
      },
      'onJoin'
  ));

}

// eslint-disable-next-line require-jsdoc
function send({message}, {id, conn, wsServer}) {
  // FIXME: validate params
  // console.log('conn.nickname :', conn.nickname);
  if (!conn.nickname) {
    return conn.sendUTF(rrBuilder.buildError(1, 'First you need to join' +
      ' chat with valid nickname', id));
  }
  // client response
  conn.sendUTF(rrBuilder.buildResult(true, id));
  // console.log(`${nickname} is sending msg ${msg}`);
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
