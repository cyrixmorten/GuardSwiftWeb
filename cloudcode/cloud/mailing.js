var SendGrid = require("cloud/sendgrid.js");
var _ = require('underscore');

SendGrid.initialize("cyrixmorten", "spinK27N2");

exports.sendTextEmail = function(to, replyto, subject, mail, from) {

	var promise = new Parse.Promise();

	// var email = SendGrid.Email();
	// email.addTo(to);
	// email.setFrom((from) ? from : "noreply@guardswift.com");
	// email.setReplyTo(replyto);
	// email.setSubject(subject);
	// email.setText(mail);
	// SendGrid.send(email, function(err, json) {
	// if (err) {
	// promise.reject(err);
	// console.error(err);
	// } else {
	// promise.resolve(httpResponse);
	// }
	// console.log(json);
	// });
	//	

	SendGrid.sendEmail({
		to : to,
		replyto : replyto,
		from : (from) ? from : "noreply@guardswift.com",
		subject : subject,
		text : mail
	}, {
		success : function(httpResponse) {
			console.log(httpResponse);
			promise.resolve(httpResponse);
			// response.success("Email sent!");
		},
		error : function(httpResponse) {
			console.error(httpResponse);
			promise.reject(httpResponse);
			// response.error("Uh oh, something went wrong");
		}
	});

	return promise;
	// return Parse.Promise.as("Do not send mails");
};

exports.sendHTMLEmail = function(to, replyTo, subject, html, from) {

	var fromMail = (from) ? from : "noreply@guardswift.com";
	var replyMail = (replyTo) ? replyTo : "cyrixmorten@gmail.com";

	console.log("Sending email to: " + JSON.stringify(to));

	var email = SendGrid.Email({
		to : to
	});
	email.setSubject(subject);
	email.setReplyTo(replyTo);
	email.setFrom(fromMail);
	email.setHTML(html);

	return SendGrid
			.send(email)
			.then(
					function(result) {
						if (result.status === 200) {
							// all is well, no further action required
							console.log('mail succesfully sent!');
							return;
						}
						// send an email to replyTo, letting them know that the
						// sending failed
						var message = 'Hej, der var desværre problemer med at afsende en eller flere emails <br/><br/>'
								+ 'Detaljer om mailen:<br/>'
								+ '------------------<br/>'
								+ 'Modtagere: $receivers <br/>'
								+ 'Emne: $subject <br/>'
								+ 'Indhold: <br/>'
								+ '$body <br/>'
								+ '------------------<br/><br/>'
								+ 'Fejlbesked fra serveren: $error';

						message = message.replace('$receivers', JSON
								.stringify(to));
						message = message.replace('$subject', subject);
						message = message.replace('$body', html);
						message = message.replace('$error', result.status
								+ ': ' + JSON.stringify(result.data.message));

						var email = SendGrid.Email({
							to : replyMail
						});
						email.setSubject('GuardSwift - Fejl ved afsendelse af email');
						email.setFrom('noreply@guardswift.com');
						email.setHTML(message);
						SendGrid.send(email);
					});
};

// exports.sendHTMLEmail = function(to, replyto, subject, mail, from) {
//
// var promise = new Parse.Promise();
//
// //var finalMail = htmlHeader + mail + htmlFooter;
//	
// SendGrid.sendEmail({
// to : to,
// replyto : replyto,
// from : (from) ? from : "noreply@guardswift.com",
// subject : subject,
// html : mail
// }, {
// success : function(httpResponse) {
// console.log("Email sent!");
// promise.resolve(httpResponse);
// },
// error : function(httpResponse) {
// var error = {
// httpResponse : httpResponse,
// to : to,
// subject: subject,
// mail : mail
// };
// promise.reject(error);
// }
// });
//
// return promise;
// // return Parse.Promise.as("Do not send mails");
// };

// exports.newCircuitStartedMail = function(circuitStarted) {
// var promise = new Parse.Promise();
//	
// var circuitName = circuitStarted.get('name');
// var timeString = new Date().toLocaleTimeString();
// var User = circuitStarted.get('owner');
// var Circuit = circuitStarted.get('circuit');
// User.fetch().then(function(user) {
// Circuit.fetch().then(function(circuit) {
// var subject = "Ny kreds oprettet " + circuitName;
// var msg = "User: " + user.get('username') + "\n";
// msg += "Servertime: " + timeString + "\n";
// msg += "Circuit timesStart " + circuit.get('timeStart') + "\n";
// msg += "Circuit timesEnd " + circuit.get('timeEnd');
//			
// exports.sendTextEmail("cyrixmorten@gmail.com", subject, msg).then(function()
// {
// promise.resolve();
// }, function(error) {
// console.log("Send mail: " + error.message);
// promise.reject(error.message);
// });
//			
// }, function(error) {
// console.log("Fetch circuit: " + error.message);
// promise.reject(error.message);
// });
// }, function(error) {
// console.log("Fetch user: " + error.message);
// promise.reject(error.message);
// });
//	
// return promise;
// };
//
//
// exports.circuitClosedMail = function(circuitStarted) {
// var promise = new Parse.Promise();
//	
// var circuitName = circuitStarted.get('name');
// var timeString = new Date().toLocaleTimeString();
// var User = circuitStarted.get('owner');
// var Circuit = circuitStarted.get('circuit');
// User.fetch().then(function(user) {
// Circuit.fetch().then(function(circuit) {
// var subject = "Kreds lukket " + circuitName;
// var msg = "User: " + user.get('username') + "\n";
// msg += "Servertime: " + timeString + "\n";
// msg += "Circuit timesStart " + circuit.get('timeStart') + "\n";
// msg += "Circuit timesEnd " + circuit.get('timeEnd');
//			
// exports.sendTextEmail("cyrixmorten@gmail.com", subject, msg).then(function()
// {
// promise.resolve();
// }, function(error) {
// console.log("Send mail: " + error.message);
// promise.reject(error.message);
// });
//			
// }, function(error) {
// console.log("Fetch circuit: " + error.message);
// promise.reject(error.message);
// });
// }, function(error) {
// console.log("Fetch user: " + error.message);
// promise.reject(error.message);
// });
//	
// return promise;
// };
