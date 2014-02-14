var http = require("http");
var url = require("url");
var formidable = require("formidable");

function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 Not found");
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");