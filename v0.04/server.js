var http = require('http')
var url = require('url')
var socketio = require('socket.io')
var executer = require('./executer')

function start (route, handle) {
    function onStart (request, response) {
        var pathname = url.parse(request.url).pathname
        route(handle, pathname, request, response)
    }

    var server = http.createServer(onStart)
    server.listen(1033)

    var socket = socketio.listen(server)
    socket.on('connection', function(client){
        console.log('Client connected')
        client.send('Your output will appear here')
        
        client.on('run', function(data){
            console.log(data.language)
            executer.execute(client, data.contents, data.language)
        })
    })
    socket.set('log level', 1); // reduce logging
}

exports.start = start