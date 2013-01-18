var qs = require('querystring')
var fs = require('fs')
var formidable = require('formidable')
var executer = require('./executer')

var startFile = fs.readFileSync('./views/init.html')

function start (request, response) {
    response.writeHead(200, {"Content-Type": "text/html"})
    response.end(startFile)
}
exports.start = start
