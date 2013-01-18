 function route (handle, pathname, request, response) {
    if (typeof handle[pathname] == 'function') {
        return handle[pathname](request, response)
    } else {
        if (!pathname == '/favicon.ico') {
            console.log("No handler found for " + pathname)
            response.writeHead(404, {"Content-Type":"text/html"})
            response.write("Page not found")
            response.end()
        }
    }
}

exports.route = route