var http = require('http')
var url = require('url')

function start (route, handle) {
    function onStart (request, response) {
        var pathname = url.parse(request.url).pathname
        route(handle, pathname, request, response)
    }

    http.createServer(onStart).listen(1031)
}

exports.start = start