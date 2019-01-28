const PORT = process.env.PORT || 8000

const http = require('http');
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Mihajlos test page');
}).listen(PORT);
