// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views'); // Specify the folder to find templates
app.set('view engine', 'ejs'); // Set the template engine
app.use(express.bodyParser()); // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
	res.render('hello', {
		message : 'Congrats, you just set up your app!'
	});
});

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
// // GET http://example.parseapp.com/test?message=hello
// res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
// // POST http://example.parseapp.com/test (with request body "message=hello")
// res.send(req.body.message);
// });

app.post('/alarm',
//		express.basicAuth('cyrixmorten', 'cH99fvFx'),
		function(req, res) {
			var to = req.body.to;
			var from = req.body.from;
			var subject = req.body.subject;
			var body = req.body.text;
			
			console.log(to);
			console.log(from);
			console.log(subject);
			console.log(body);
			
			res.send('Success');
			
		});

//if (isset($_POST["to"]) && $_POST["to"] == "alarm@guardswift.com") {
//
//    // Extract POST values
//
//    $to = $_POST["to"];
//    $from = $_POST["from"];
//    $body = $_POST["text"];
//    $subject = $_POST["subject"];
//    $num_attachments = $_POST["attachments"];
//
//    // Extract email from to and from
//    $pattern = '/[a-z0-9_\-\+]+@[a-z0-9\-]+\.([a-z]{2,3})(?:\.[a-z]{2})?/i';
//    preg_match_all($pattern, $to, $matches_to);
//    preg_match_all($pattern, $from, $matches_from);
//
//    $to = $matches_to[0][0];
//    $from = $matches_from[0][0];
//
//    // Extract body values
//    $parseVars = [
//            "type",
//            "zone",
//            "alarmTime",
//            "securityLevel",
//            "installation",
//            "hardwareId",
//            "serial",
//            "name",
//            "addressName",
//            "addressNumber",
//            "floor",
//
//"addressName2",
//"zipcode",
//"cityName",
//"installer",
//"guard",
//"drivingGuidance",
//"accessRoute",
//"keyboxLocation",
//"bypassLocation",
//"controlpanelLocation",
//"smokecannonLocation",
//"guardCode",
//"bypassCode",
//"remark"
//];
//
//$cloudArgs = [
//"to" => $to,
//"from" => $from,
//"subject" => $subject,
//"body" => $body
//];
//
//$separator = "\r\n";
//$line = strtok($body, $separator);
//
//$lineNumber = 0;
//while ($line !== false) {
//# do something with $line
//if (strpos($line, ';') !== FALSE) {
//$parts = explode(";", $line);
//
//$key = $parseVars[$lineNumber];
//$value = trim($parts[1]);
//
//$cloudArgs[$key] = $value;
//
//$lineNumber++;
//}
//$line = strtok( $separator );
//}
//
//// Send to cloud function
//ParseCloud::run('addAlarm', $cloudArgs);


// Attach the Express app to Cloud Code.
app.listen();
