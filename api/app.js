var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

require('dotenv').config();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

server = app.listen(port, () => console.log('Example app listening on port ' + port + '!'))
server.setTimeout(14400000);

var products = require('./routes/products');
app.use('/api/products/get', products);

module.exports = app;

