Building a web based text editor/compiler/interpreter/executer
==============================================================
This is a collection of all the versions I created during the making of a web-based online text editor/compiler/interpreter/executer. In short a __mini IDE__
A full fledged tutorial explanation for every version is in the works

# Log

Version 1
=========
## Upload a C file. It parses the body of the post data, creates a .c file in temporary location and executes it as a child process. stdout and stderr are sent as reply

## Things learnt
  * How to structure a nodejs application
  * Handling requests and sending responses
  * Parsing POST data
  * Asynchronous writing into file
  * Properly designing control flow in Nodejs through EventEmitters
  * Executing commands in child processes - exec() and spawn()
  * Utilizing timeouts
  * Hacks to check for infinite loop/excessive buffer usage

Version 2
=========
## Write code in a textbox. Everything else almost the same as v0.01

## Things learnt
  * Usage of [Highlight.js](http://softwaremaniacs.org/soft/highlight/en/) to highlight code
  * Accepting code in a way better than what is done in v0.01
  * Clearing Infinite loop checking timer on getting exit code from spawned process

Version 3
=========
## Socket.io is used to send and receive data from the client in real time. No need to send response to another page

## Things learnt
  * WebSockets
  * Usage of [socket.io](http://socket.io/) library, both on server and on client

Version 4
=========
## New Languages added. Code made more modular and more generic to allow for easy extension to more languages.

## Things learnt
  * Importance of modularity of operations
  * Improving application code to allow for easy scalability

Version 5
=========
## More features added. The user can send command line arguments and can give inputs during execution too

## Things learnt
  * Buffering of Streams (stdio)
  * Usage [pty.js-dl](https://github.com/chjj/pty.js/) library and pseudo ttys (Making a non-terminal application believe it is one)
