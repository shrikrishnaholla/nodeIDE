var server = require('./server')
var router = require('./router')
var reqHandler = require('./reqHandler')

var handle = {}
handle["/"] = reqHandler.start
handle["/start"] = reqHandler.start
//handle["/cmpnrun"] = reqHandler.cmpnrun

server.start(router.route, handle)