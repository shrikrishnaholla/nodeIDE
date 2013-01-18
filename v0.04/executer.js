
var langs = require("./languages")
var writer = require("./writer")
var compiler = require("./compiler")
var interpreter = require("./interpreter")

function execute (client, code, language) {

    var lang
    if (language === "perl") {lang = langs.options.c} // Because highlight.js doesn't have C; instead uses perl for C too
    else if(language === "cpp") {lang = langs.options.cc}
    else if(language === "python") {lang = langs.options.python}
    else if(language === "ruby") {lang = langs.options.ruby}
    else if(language === "javascript") {lang = langs.options.javascript}
    else {lang = langs.options.bash}

    writer.write(client, code, lang, function(client, lang) {
        if (lang.compiler) {
            compiler.compile(client, lang)
        } else{
            interpreter.interpret(client, lang)
        };
    })
    
}

exports.execute = execute