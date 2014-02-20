//Import Dependencies
var http = require("http");
var url = require("url");
var querystring = require("querystring");
var fs = require("fs");
var exec = require("child_process").exec;
var formidable = require("formidable");
var moment = require("moment");

//Load HTML from disk
var indexPage = fs.readFileSync("html/index.html");
var radioPage = fs.readFileSync("html/radio.html");
var demodPage = fs.readFileSync("html/demod.html");

//This function gets called when we have an HTTP request
function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
	console.log("Request for " + pathname + " received.");
	switch(pathname) {
		case '/':
			index(request, response);
			break;
		case '/radio':
			radio(request, response);
			break;
		case '/demod':
			demod(request, response);
			break;
		default:
			console.log("No request handler found for " + pathname);
			response.writeHead(404, {"Content-Type": "text/html"});
			response.write("404 Not found");
			response.end();
			break;
	}
}

//Start HTTP server
var server = http.createServer(onRequest).listen(8888);

//Start Socket.io server
//var io = require("socket.io").listen(server);

function index(request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(indexPage);
	response.end();
}

function radio(request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(radioPage);
	response.end();
}

function demod(request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(demodPage);

	// var mySocket;
	// io.sockets.on('connection', function(socket) {
	// 	console.log("Socket Connected");
	// 	mySocket = socket;
	// });

	var demodData = "";

	var form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.hash = 'md5';
	form.parse(request, function(error, fields, files) {
		//Copy file to permanent location, fix any .wav format issues, then run receiver
		console.log(files.upload.path);
		console.log(files.upload.hash);
		//var dateString = moment().format('X');
		var fileDir = "~/RadioUploads/"+files.upload.hash;
		var filePath = fileDir+"/Recording.wav";
		fs.exists(path, function(exists) {
			if(!exists) {
				exec("cp "+files.upload.path+" "+filePath+" && "+"qwavheaderdump -F "+path);
			}
		});
		
		// exec("../SpriteDemodWeb.py "+filePath, function(error, stdout, stderr){
		// 	console.log(stdout);
		// 	response.write(stdout);
		// 	response.end();
		// });

		//Write this to the browser for people to look at while they wait
		response.write("Demodulating PRN Pair (2,3)...<br/>")
	});

	//Sends the current upload progress back to the client throguh a socket
	// form.on('progress', function(bytesReceived, bytesExpected) {
	// 	mySocket.emit('progressFraction', { progressFraction: bytesReceived/bytesExpected });
	// });

}

