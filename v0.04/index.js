var server = require('./server')
var router = require('./router')
var reqHandler = require('./reqHandler')

var handle = {}
handle["/"] = reqHandler.start
handle["/start"] = reqHandler.start

server.start(router.route, handle)