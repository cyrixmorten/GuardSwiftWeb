var Mailer = require("cloud/lib/sendgrid-mailer.js");

var mailer = new Mailer("cyrixmorten", "spinK27N2");

var Buffer = require('buffer').Buffer;

Parse.Cloud.define("sendStaticReport", function (request, response) {
    Parse.Cloud.useMasterKey();

    if (!request.params.reportId) {
        response.error('missing reportId');
        return;
    }

    var owner = request.user;

    Parse.Cloud.run('generatePDFReport', {reportId: request.params.reportId}).then(function (httpResponse) {

        console.log('buffer: ', httpResponse.buffer);

        return mailer
            .mail()
            .property('from', 'jvh@guardswift.com')
            .property('to', 'cyrixmorten@gmail.com')
            .property('subject', 'Fastvagt rapport')
            .property('text', 'Lorem ipsum dolor sit amet')
            .attach('report.pdf', 'application/pdf', new Buffer(httpResponse.buffer))
            .send()

    }).then(function () {
        response.success('Mail sent!');
    }, function (error) {
        console.error(error);
        response.error(error);
    });


});

