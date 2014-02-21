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
		fs.exists(filePath, function(exists) {
			if(!exists) {
				//Copy the .wav file and check it's validity with qwavheaderdump
				exec("cp "+files.upload.path+" "+filePath+" && "+"qwavheaderdump -F "+filePath, function(error, stdout, stderr) {
					var lines = stdout.split('\n');
					console.log(lines[1]);
					console.log(lines[3]);
					console.log(lines[8].split(' ')[2]);

					if(lines[1] == "riff: 'RIFF'" && lines[3] == "wave: 'WAVE'") {
						if(lines[8].split(' ')[2] == '250000') {
							//File is a valid .wav with correct sample rate
							response.write("Your file looks good. We'll get to work demodulating it and email you the results. Thanks!");
						} else {
							//File is a valid .wav with bad sample rate
							response.write("Sorry, our website is only set up to handle .wav files with a sample rate of 250KHz. Email us if you need help.");
						}
						
					}
					else {
						//File is not a valid .wav
						response.write("The file you uploaded is not a valid .wav file. Please try again.");
					}
				});
			}
			else {
				//Duplicate file upload
				response.write("It looks you've already uploaded this file. Thanks!");
			}

			response.end();
		});
		

		
	});
}

