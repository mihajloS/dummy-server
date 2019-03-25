let moduleName = '';

/**
 * Set module name
 * @param {String} name Module name
 */
function setModuleName(name) {
  moduleName = name;
}

/**
 * Build full method name
 * @param {String} name Function name
 * @return {String} Full method name
 */
function buildMethodName(name) {
  return `${moduleName}.${name}`;
}

/**
* Build RPC result string
* @param {Any} data Response data
* @param {Number} reqId Request id
* @return {String} Rpc result
*/
function buildResult(data, reqId) {
  if (!reqId) {
    return buildNoReqIdError();
  }
  const ret = {jsonrpc: '2.0', method: 'result', params: data, id: reqId};
  return JSON.stringify(ret);
}

/**
 * Build RPC error String
 * @param {Number} errorCode
 * @param {String} errorMessage
 * @param {Number} reqId Request id
 * @return {String} Rpc error
 */
function buildError(errorCode, errorMessage, reqId) {
  if (!reqId) {
    return buildNoReqIdError();
  }
  const ret = {jsonrpc: '2.0', method: 'error', params: {code: errorCode,
    message: errorMessage}, id: reqId};
  return JSON.stringify(ret);
}

/**
 * Build RPC error String
 * @param {Any} data Response data
 * @param {String} method Notification method name
 * @return {String} Rpc notification
 */
function buildNotification(data, method) {
  const ret = {jsonrpc: '2.0', method: buildMethodName(method), params: data};
  return JSON.stringify(ret);
}

/**
 * Buld rpc error for scenario
 * when RPC req was not passed.
 * This is usually developer error
 * @return {String}
 */
function buildNoReqIdError() {
  return '{"jsonrpc": "2.0", "error": {"code": -32603,' +
    '"message": "Server Req ID RPC error"}, "id": null}';
}

module.exports = {buildResult, buildError, buildNotification, setModuleName};
