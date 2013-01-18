var cp = require('child_process')
var fs = require('fs')
var EE = require('events').EventEmitter

var ee = new EE()

function interpret (client, lang) {
    var exited = false
    client.send("Interpreting...")

    var exe = cp.spawn(lang.interpret.cmd, ["/tmp/test"+client.id+lang.ext])
    console.log("Starting execution")
    var infiniteLoopChecker = setTimeout(function() {
        if(!exe.killed) {
            if(exe.exitCode != 0)
                exe.emit('infiniteloop')
            else {
                ee.emit('stop')
                exe.kill('SIGSTOP')
            }
        }
    }, 30000)
    bufferOverFlowWarn = 0
    exe.stdout.on('data', function (data) {
        if (bufferOverFlowWarn++ > 3)
            ee.emit('buffOvrFlow')
        else
            client.send("<pre>" + data.toString() + '</pre>')

        if(exited){
            clearTimeout(infiniteLoopChecker)
            infiniteLoopChecker = null
            ee.emit('stop')
            exe.kill('SIGSTOP')
        }
    })
    exe.stderr.on('data', function (data) {
        client.send("<pre>" + data.toString() + '</pre>')
        if(exited) {
            clearTimeout(infiniteLoopChecker)
            infiniteLoopChecker = null
            ee.emit('stop')
            exe.kill('SIGSTOP')
        }
    })
    exe.on('error', function (error) {
        var errormsg = "Execution failed with message </br><pre>"+error.message+";</pre></br> Return value: "+error.code
        client.send(errormsg)
        if (exited) {
            clearTimeout(infiniteLoopChecker)
            infiniteLoopChecker = null
            ee.emit('stop')
            exe.kill('SIGSTOP')
        };
    })

    exe.on('infiniteloop', function(){
        clearTimeout(infiniteLoopChecker)
        infiniteLoopChecker = null
        client.send("Exectution taking a long time. Is there an infinite loop here?");
        ee.emit('stop')
        exe.kill('SIGSTOP')
    })

    exe.on('exit', function(code){
        exited = true; 
        setTimeout(function(){ee.emit('stop');},1000);
        clearTimeout(infiniteLoopChecker)
        infiniteLoopChecker = null
    })

    ee.once('buffOvrFlow', function(){
        clearTimeout(infiniteLoopChecker)
        infiniteLoopChecker = null
        client.send("Buffer Limit exceeded. Hence stopping execution")
        ee.emit("stop")
        exe.kill("SIGSTOP")
    })

    function exiter () {
        client.send('Done')
        fs.unlink('/tmp/test'+client.id+lang.ext, function (err) {
          if (err) console.log("Error deleting file for client",client.id);
          console.log('successfully deleted /tmp/test'+client.id+lang.ext);
        });
    }

    ee.once('stop', exiter)
}

exports.interpret = interpret