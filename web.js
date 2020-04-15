const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy');

const compression = require('compression');
const proxy = httpProxy.createProxyServer();

const app = express();

const port = process.env.PORT || 8080;
;
app.use(express.static(__dirname + '/dist/web'));

app.use('/api', function(req, res){
	proxy.web(req, res, {
		target: 'http://localhost:3000/api/'
	});
});

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/web/index.html'));
});

const server = http.createServer(app);

server.listen(port, () => console.log(`Server running on localhost:${port}`));
server.timeout = 14400000;

