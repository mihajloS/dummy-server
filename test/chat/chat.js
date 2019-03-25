/* eslint max-len: ["error", { "ignoreComments": true }]*/
process.env.NODE_ENV = 'test';

const WebSocketClient = require('websocket').client;
const client = new WebSocketClient();
const chai = require('chai');
const server = require('../../server');
const should = chai.should();
let conn = null;

before((done)=> {

  client.on('connectFailed', function(error) {
    console.warn('>>Connect Error: ' + error.toString());
    done('>> WS Connection error', error);
  });

  client.on('connect', function(connection) {
    conn = connection;
    done();
  });

  client.connect('ws://localhost:8000/', 'm-protocol');
});

after((done)=> {
  if (conn) {
    conn.on('close', function() {
      conn = null;
      done();
    });
    conn.close();
  }
  else {
    done();
  }
});

describe('Chat', ()=> {
  describe('Send join Request.', () => {
    it('join request', (done)=> {
      const requestObject = {
        'jsonrpc': '2.0',
        'method': 'Chat.join',
        'params': {'nickname': 'Mika'},
        'id': 1,
      }
      conn.on('message', (data) => {
        data = JSON.parse(data.utf8Data);
        // {"jsonrpc":"2.0","method":"result","params":{"userId":1},"id":1}
        if (data.id === requestObject.id) {
          data.should.have.property('jsonrpc', '2.0');
          data.should.have.property('method', 'result');
          data.should.have.property('id', 1);
          data.should.have.property('params');
          data.params.should.have.property('userId');
        }
        // {"jsonrpc":"2.0","method":"Chat.onJoin","params":{"userId":1,"nickname":"Mika"}}
        if (data.method === 'Chat.onJoin') {
          data.should.have.property('jsonrpc', '2.0');
          data.should.have.property('method', 'Chat.onJoin');
          data.should.have.property('params');
          data.params.should.have.property('nickname', requestObject.params.nickname);
          data.params.should.have.property('userId');
          done();
        }
      });
      conn.sendUTF(JSON.stringify(requestObject));
    });
  });

  describe('Send chat msg', () => {
    it('send chat and receive response', (done)=> {
      const requestObject = {
        'jsonrpc': '2.0',
        'method': 'Chat.send',
        'params': {'message': 'Unit test message'},
        'id': 2,
      };
      conn.on('message', (data) => {
        data = JSON.parse(data.utf8Data);
        // {"jsonrpc":"2.0","method":"result","params":true,"id":2}
        if (data.id === requestObject.id) {
          data.should.have.property('jsonrpc', '2.0');
          data.should.have.property('method', 'result');
          data.should.have.property('id', 2);
          data.should.have.property('id', 2);
          data.should.have.property('params', true);
        }
        // {"jsonrpc":"2.0","method":"Chat.onMessage","params":{"message":"My message","userId":1}}
        if (data.method == 'Chat.onMessage') {
          data.should.have.property('jsonrpc', '2.0');
          data.should.have.property('method', 'Chat.onMessage');
          data.should.have.property('params');
          data.params.should.have.property('message', requestObject.params.message);
          data.params.should.have.property('userId');
          done();
        }
      });
      conn.sendUTF(JSON.stringify(requestObject));
    });
  });
});
