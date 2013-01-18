var cp = require('child_process')
var fs = require('fs')
var EE = require('events').EventEmitter
var pty = require('pty.js-dl')

var ee = new EE()

function compile (client, args, lang) {
    
    cp.exec(lang.compile.part1+client.id+lang.compile.part2+client.id, function(e, stdout, stderr) {
        if (e !== null) {
            var errorstr = "Compilation failed with the following error<br/><pre>"+ e.message.toString() + "</pre>"
            client.send(errorstr)
            console.log(e, stdout, stderr)
        } else if (stderr.length > 0) {
            client.send("Compilation finished with warnings<br/><pre>"+ stderr + '</pre>')
            ee.emit('compiled')
        } else {
            client.send("Compilation successful")
            ee.emit('compiled')
        }
    })
    
    function run () {
        var exited = false
        function infiniteLoopHandler () {
            if(exited) {
                client.send('Killing process assuming infinite loop')
                exe.kill()
            }
            else {
                client.send('The process is running for a long time. Are you not giving an input or is this an infinite loop?')
                exited = true
            }
        }

        var infiniteLoopChecker = setInterval(infiniteLoopHandler, 30000)
        client.send('Running...')

        var exe = pty.spawn("/tmp/test"+client.id, args)
        exe.on('data', function(data) {
            client.send(data)
            clearInterval(infiniteLoopChecker)
            infiniteLoopChecker = null
            infiniteLoopChecker = setInterval(infiniteLoopHandler, 30000)
        });
        client.on('stdin', function (data) {
            exe.write(data.input+"\r")
            clearInterval(infiniteLoopChecker)
            infiniteLoopChecker = null
            infiniteLoopChecker = setInterval(infiniteLoopHandler, 30000)
        })
        exe.on('exit', function(code){
            clearInterval(infiniteLoopChecker)
            infiniteLoopChecker = null
            ee.emit('stop')
        })
    }

    function exiter () {
        client.send('Done')
        fs.unlink('/tmp/test'+client.id+lang.ext, function (err) {
          if (err) console.log("Error deleting file for client",client.id);
          console.log('successfully deleted /tmp/test'+client.id+lang.ext);
        });
        fs.unlink('/tmp/test'+client.id, function (err) {
          if (err) console.log("Error deleting file for client",client.id);
          console.log('successfully deleted /tmp/test'+client.id);
        });
    }
    ee.once('compiled', run)
    ee.once('stop', exiter)
}

exports.compile = compile