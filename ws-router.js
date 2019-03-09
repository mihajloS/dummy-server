const log = require('./logger').logger;
const Validator = require('jsonschema').Validator;
const validate = new Validator();
const api = require('./apps/Factory');

// JSONrpc 2.0 protocol
// {"jsonrpc": "2.0", "method": "subtract",
// "params": {"param1": "x", "param2": "y"}, "id": 3}
const rpcRequestSchema = {
  additionalProperties: false,
  properties: {
    'jsonrpc': {type: 'string'},
    'method': {'type': 'string', 'minLength': 2},
    'params': {type: 'object'},
    'id': {type: 'number'},
  },
  required: ['jsonrpc', 'method', 'params', 'id'],
};

/**
 * Route websocket message
 * @param {Object} wsServer Server instance
 * @param {Object} conn Websocket connection
 * @param {Object} rawClientData data
 */
function route(wsServer, conn, rawClientData) {
  log.info('WS Received Message: ' + rawClientData);
  // safe parse FIXME?
  // parse to JSON
  const req = JSON.parse(rawClientData);
  const val = validate.validate(req, rpcRequestSchema);
  if (!val.valid) {
    log.error('Invalid rpc request analyse: ' + val);
    conn.sendUTF('{"jsonrpc": "2.0", "error":' +
      '{"code": -32600, "message": "Invalid Request"}, "id": null}');
    return;
  }

  // try to match request with existing api's
  const reqDesc = getAppAndApiName(req);
  // 'for in' for performance
  if (reqDesc.app in api) {
    if (reqDesc.api in api[reqDesc.app]) {
      api[reqDesc.app][reqDesc.api](req.params, {id: req.id, wsServer, conn});
      return;
    }
  }

  // method not found, return client error
  conn.sendUTF('{"jsonrpc": "2.0", "error": ' +
    '{"code": -32601, "message": "Method not found"}, "id": "1"}');
  log.error('Invalid method called ' + req.method);
}

/**
 * Extract App and api from method string
 * in request object
 * @param {Object} Request object
 * @return {Object} 'app' and 'api' strings
 */
function getAppAndApiName({method: m}) {
  const parts = m.split('.');
  if (parts.length != 2 || parts[1].length === 0) {
    throw Error('Bad method name');
    // fix me, what will happen when this error gets triggered
  }

  return {app: parts[0], api: parts[1]};
}

module.exports = {route};
