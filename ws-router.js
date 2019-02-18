const log = require('./logger').logger;
const Validator = require('jsonschema').Validator;
const validate = new Validator();
const api = require('./apps/Factory');

// JSONrpc 2.0 protocol
// {"jsonrpc": "2.0", "method": "subtract",
// "params": {"param1": "x", "param2": "y"}, "id": 3}
const rpcRequestSchema = {
  properties: {
    'jsonrpc': {type: 'string'},
    'method': {'type': 'string', 'minLength': 2},
    'params': {type: 'object'},
    'id': {type: 'number'},
  },
  required: ['jsonrpc', 'method', 'params', 'id'],
};

// validate.addSchema(rpcRequestSchema, '/rpc');
/**
 * Route websocket message
 * @param {Object} conn Websocket connection
 * @param {Object} rawClientData data
 */
function route(conn, rawClientData) {
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
  let matched = false;
  // 'for in' for performance
  for (const item in api) {
    if (api.hasOwnProperty(item)) {
      const module = api[item];
      if (req.method in module) {
        matched = true;
        api.auth.date();
        module[req.method](req.params);
      }
    }
  }

  if (!matched) {
    conn.sendUTF('{"jsonrpc": "2.0", "error": ' +
      '{"code": -32601, "message": "Method not found"}, "id": "1"}');
    log.error('Invalid method called ' + req.method);
  }
}

module.exports = {route};
