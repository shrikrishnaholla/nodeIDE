var cp = require('child_process')
var fs = require('fs')

function execute (response, code) {
    response.writeHead(200, {"Content-Type":"text/html"})
    var source = ""
    fs.writeFile("/tmp/test.c", code, function(error) {
        if (error) {
            console.log("Error saving file")
            response.end("Error saving file")
        }
        else {
            response.emit('saved')
        }
    })

    function read () {
        fs.readFile('/tmp/test.c', function(err, data){
            if(!err) { response.emit('read');}
            else{ console.log('Error reading file!\n' + err); response.end("Error reading file");}
        })
    }
    
    function compiler () {
        cp.exec("cc -Wall /tmp/test.c -o /tmp/test", function(e, stdout, stderr) {
            if (e) {
                response.end("Compilation failed with the following error</br>"+ e.message)
            } else if (stderr.length > 0) {
                response.write("Compilion finished with warnings</br>"+ stderr + '</br>')
                response.emit('compiled')
            } else {
                response.write("Compilation successful</br>")
                response.emit('compiled')
            }
        })
        
    }
    
    function run () {
        var exited = false

        var exe = cp.spawn("/tmp/test")
        bufferOvFlow = 0
        exe.stdout.on('data', function (data) {
            if (bufferOvFlow++ > 3) {console.log("buffer size exceeded");exe.emit('infiniteloop')};
            response.write("<pre>" + data.toString() + '</pre></br>')
            if(exited){
                response.emit('exit');
                exe.kill('SIGSTOP')
            }
        })
        exe.stderr.on('data', function (data) {
            response.write(data.toString() + '</br>')
            if(exited) {
                response.emit('exit')
                exe.kill('SIGSTOP')
            }
        })
        exe.on('error', function (error) {
            response.write("Execution failed with message </br><pre>"+error.message+";</pre></br> Return value: "+error.code)
            if (exited) {
                response.emit('exit')
                exe.kill('SIGSTOP')
            };
        })

        setTimeout(function() {
            if(!exe.killed) {exe.emit('infiniteloop')}
        }, 30000)

        exe.on('infiniteloop', function(){
            response.write("Exectution taking a long time and/or exceeding buffer size. Is there an infinite loop here?</br>");
            response.write("<pre>"+ code + "</pre>");
            response.emit('exit');
            exe.kill('SIGSTOP')
        })

        exe.on('exit', function(code){exited = true; console.log("Executed");})
        
    }

    function exiter () {
        response.end()
    }

    response.on('saved', read)
    response.on('read', compiler)
    response.on('compiled', run)
    response.on('exit', exiter)
    
}

exports.execute = execute