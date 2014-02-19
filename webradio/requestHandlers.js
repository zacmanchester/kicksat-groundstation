var querystring = require("querystring");
var fs = require("fs");
var exec = require("child_process").exec;
var formidable = require("formidable");

var moment = require("moment");

function start(response) {
	console.log("Request handler 'start' was called.");

	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" '+
		'content="text/html; charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<form action="/upload" enctype="multipart/form-data" '+
		'method="post">'+
		'<input type="file" name="upload" multiple="multiple">'+
		'<input type="submit" value="Upload file" />'+
		'</form>'+
		'</body>'+
		'</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function upload(response, request) {

	console.log("Request handler 'upload' was called.");
	response.writeHead(200, {"Content-Type": "text/html"});

	response.write("Uploading ");


	var demodData = "";
	var form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(request, function(error, fields, files) {
		if(files.upload.path.substr(-4,4) == ".wav") {

			//Copy file to permanent location, fix any wav format issues, then run receiver
			var dateString = moment().format('X');
			var filePath = "~/RadioUploads/"+dateString+".wav";
			exec("cp "+files.upload.path+" "+filePath+" && "+"qwavheaderdump -F "+filePath);
			exec("../SpriteDemodWeb.py "+filePath, function(error, stdout, stderr){
				console.log(stdout);
				response.write(stdout);
				response.end();
			});

			//Write this to the browser for people to look at while they wait
			response.write("<br/>Upload Successful!<br/>");
			response.write("Demodulating PRN Pair (2,3)...<br/>")
		}
		else {
			response.write("Bad file. Try again.");
			response.end();
		}
	});

	form.on('progress', function(bytesReceived, bytesExpected) {
		var percent = 100*(bytesReceived/bytesExpected);
		
		
	});

}

function show(response) {

	console.log("Request handler 'show' was called.");
	response.writeHead(200, {"Content-Type": "image/png"});
	fs.createReadStream("/tmp/test.png").pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;