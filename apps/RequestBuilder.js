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
  return `{"jsonrpc": "2.0", "result": ${data}, "id": ${reqId}}`;
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
  return `{"jsonrpc": "2.0", "error": {"code": ${errorCode}, "message": ${errorMessage}}, "id": ${reqId}}`;
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

module.exports = {buildResult, buildError};
