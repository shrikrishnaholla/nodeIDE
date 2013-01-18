var qs = require('querystring')
var fs = require('fs')
var formidable = require('formidable')
var executer = require('./executer')
var utils = require('util')

var startFile = fs.readFileSync('init.html')

function start (request, response) {
    response.writeHead(200, {"Content-Type": "text/html"})
    response.end(startFile)
}

function cmpnrun (request, response) {
    request.on('data', function(data){
        var codeStart = data.toString().indexOf("#")        /// Very very very bad - Don't do it!!
        var codeEnd = data.toString().lastIndexOf("}")
        var code = data.toString().slice(codeStart,codeEnd+1)
        if(codeStart!= -1 && codeEnd!= -1)
            response.emit('dataread', code)
        else
            response.end('Please select a C source file first')
    })
    response.on('dataread', function(code) { executer.execute(response, code); })
}

exports.start = start
exports.cmpnrun = cmpnrun
