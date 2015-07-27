var http = require("http"); // for HTTP requests
var handler = require("./request-handler");
var initialize = require("./initialize.js");

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize();

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handler.handleRequest);
// HTTP.CREATESERVER returns a server object and takes a request handler which get passed the request and response objects

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip); // always add server.listen after having created the server object
  console.log("Listening on http://" + ip + ":" + port);
}

// module.exports = {}

// exports = module.exports;
