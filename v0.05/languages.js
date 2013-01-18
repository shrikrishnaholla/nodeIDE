var options = {
    c : {
        name: "C",
        compiler: true,
        ext: ".c",
        compile : {
            part1: "cc -Wall /tmp/test",
            part2: ".c -o /tmp/test"
        }
    },
    cc : {
        name: "C++",
        compiler: true,
        ext: ".cc",
        compile : {
            part1: "g++ -Wall /tmp/test",
            part2: ".cc -o /tmp/test"
        }
    },
    python : {
        name: "Python",
        compiler: false,
        ext: ".py",
        interpret : {
            cmd: "python"
        }
    },
    ruby : {
        name: "Ruby",
        compiler: false,
        ext: ".rb",
        interpret : {
            cmd: "ruby"
        }
    },
    javascript: {
        name: "JavaScript",
        compiler: false,
        ext: ".js",
        interpret : {
            cmd: "node"
        }
    },
    bash : {
        name: "Bourne Again Shell",
        compiler: false,
        ext: ".sh",
        interpret : {
            cmd: "sudo -u nodejs sh"
        }
    }
}

exports.options = options