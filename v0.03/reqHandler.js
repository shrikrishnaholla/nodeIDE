var qs = require('querystring')
var fs = require('fs')
var formidable = require('formidable')
var executer = require('./executer')

var startFile = fs.readFileSync('./views/init.html')

function start (request, response) {
    response.writeHead(200, {"Content-Type": "text/html"})
    response.end(startFile)
}
/*
function cmpnrun (request, response) {
    var body = ''
    request.on('data', function(data){
        body += data
    })

    request.on('end', function () {
        console.log(qs.parse(body))
        executer.execute(response, qs.parse(body).codesnippet, request.connection.remoteAddress)
    })
}
*/
exports.start = start
//exports.cmpnrun = cmpnrun
