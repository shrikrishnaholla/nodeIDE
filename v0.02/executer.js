var cp = require('child_process')
var fs = require('fs')

function execute (response, code, ipaddress) {
    response.writeHead(200, {"Content-Type":"text/html"})
    fs.writeFile("/tmp/test.c", code, function(error) {
        if (error) {
            console.log("Error saving file for", ipaddress)
            response.end("Error saving file")
        }
        else {
            response.emit('saved')
        }
    })

    function read () {
        fs.readFile('/tmp/test.c', function(err, data){
            if(!err) { response.emit('read');}
            else{ console.log('Error reading file!\n', err, "for", ipaddress); response.end("Error reading file");}
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

        var infiniteLoopChecker = setTimeout(function() {
            if(!exe.killed) {
                if(exe.exitCode != 0)
                    exe.emit('infiniteloop')
                else {
                    response.emit('exit')
                    exe.kill('SIGSTOP')
                }
            }
        }, 30000)

        var exe = cp.spawn("/tmp/test")
        console.log("Starting execution")
        bufferOvFlow = 0
        exe.stdout.on('data', function (data) {
                if (bufferOvFlow++ > 3) {console.log("buffer size exceeded for client", ipaddress);exe.emit('infiniteloop')};
            response.write("<pre>" + data.toString() + '</pre></br>')
            if(exited){
                clearTimeout(infiniteLoopChecker)
                response.emit('exit');
                exe.kill('SIGSTOP')
            }
        })
        exe.stderr.on('data', function (data) {
            response.write(data.toString() + '</br>')
            if(exited) {
                clearTimeout(infiniteLoopChecker)
                response.emit('exit')
                exe.kill('SIGSTOP')
            }
        })
        exe.on('error', function (error) {
            response.write("Execution failed with message </br><pre>"+error.message+";</pre></br> Return value: "+error.code)
            console.log("Client", ipaddress, "faced a compilation error with the message\n",error.message)
            if (exited) {
                clearTimeout(infiniteLoopChecker)
                response.emit('exit')
                exe.kill('SIGSTOP')
            };
        })

        exe.on('infiniteloop', function(){
            console.log("Stopped execution for", ipaddress, "fearing infinite loop")
            clearTimeout(infiniteLoopChecker)
            response.write("Exectution taking a long time and/or exceeding buffer size. Is there an infinite loop here?</br>");
            response.write("<pre>"+ code + "</pre>");
            response.emit('exit');
            exe.kill('SIGSTOP')
        })

        exe.on('exit', function(code){exited = true; setTimeout(function(){response.emit('exit')},1000);})
        
    }

    function exiter () {
        response.end()
        console.log("Served client", ipaddress)
    }

    response.on('saved', read)
    response.on('read', compiler)
    response.on('compiled', run)
    response.on('exit', exiter)
    
}

exports.execute = execute