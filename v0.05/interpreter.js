var cp = require('child_process')
var fs = require('fs')
var EE = require('events').EventEmitter
var pty = require('pty.js-dl')

var ee = new EE()

function interpret (client, args, lang) {

    var waiting = false
    function infiniteLoopHandler () {
        if(waiting) {
            client.send('Killing process assuming infinite loop')
            exe.kill()
        }
        else {
            client.send('The process is running for a long time. Are you not giving an input or is this an infinite loop?')
            waiting = true
        }
    }
    client.send("Interpreting...")
    var arguments = ["/tmp/test"+client.id+lang.ext]
    for (var i = 0; i < args.length; i++) {
        arguments.push(args[i])
    };

    var exe = pty.spawn(lang.interpret.cmd, arguments)
    exe.on('data', function(data) {
        waiting = false
        client.send(data)
        clearInterval(infiniteLoopChecker)
        infiniteLoopChecker = null
        infiniteLoopChecker = setInterval(infiniteLoopHandler, 30000)
    });
    client.on('stdin', function (data) {
        waiting = false
        exe.write(data.input+"\r")
        clearInterval(infiniteLoopChecker)
        infiniteLoopChecker = null
        infiniteLoopChecker = setInterval(infiniteLoopHandler, 30000)
    })
    exe.on('exit', function(code){
        waiting = false
        clearInterval(infiniteLoopChecker)
        infiniteLoopChecker = null
        console.log("Exiting...")
        ee.emit('stop')
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