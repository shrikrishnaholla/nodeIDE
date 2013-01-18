var fs = require('fs')

function write (client, code, lang, callback) {
    fs.writeFile("/tmp/test"+client.id+lang.ext, code, function(error) {
        if (error) {
            client.send("Error reading code. Please try again")
        }
        else {
            console.log("Saved file "+"/tmp/test"+client.id+lang.ext)
            return callback(client, lang)
        }
    })
}

exports.write = write