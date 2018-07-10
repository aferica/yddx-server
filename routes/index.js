var express = require('express')
var app = express()

app.get('/', function(req, res) {
	res.jsonp({code: '0', mag: '服务器正常'})
})

module.exports = app;
