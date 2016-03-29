var pdfMake = require('cloud/lib/pdfmake/pdfmake.js');
var vfs_fonts = require('cloud/lib/pdfmake/vfs_fonts.js');
var moment = require('cloud/lib/moment/moment.min.js');
var _ = require('underscore');




Parse.Cloud.job("GeneratePDFReports", function(request, status) {
	Parse.Cloud.useMasterKey();

	var query = new Parse.Query("Report");
	query.doesNotExist("pdf_test");
	query.first(function(report) {

		var pdf = createPDF(report);

		report.set("pdf_test", pdf);

		return object.save();
	}).then(function() {
		status.success("completed successfully.");
	}, function(err) {
		console.error(err);
		status.error(err.message);
	});

});

var createPDF = function (report) {

	var client = {
		name: report.clientName,
		address: report.clientAddress + ' ' + report.clientAddressNumber,
	};

	var guard = {
		id: report.guardId,
		name: report.guardName
	};

	var reportentries = _.where(report.eventLogs, {taskEvent: 'OTHER'});

	var timestamps = _.map(reportentries, function(entry) {
		return moment(entry.deviceTimestamp).format('MM:SS')
	});

	var remarks = _.map(reportentries, 'remarks');

	var docDefinition = {
		pageMargins: [40, 60, 40, 60],

		header:
		{
			columns: [
				{
					width: 'auto',
					text: [
						{text: 'Vagt: ', bold: true}, guard.name + ' ' + guard.id
					]
				},
				{
					width: '*',
					text: 'Dato: ' + moment(report.deviceTimestamp).format('DD-MM-YYYY'),
					alignment: 'right'
				}
			],
			margin: [10, 10]
		},

		content: [
			{
				text: [
					{text: client.name, style: 'header'}, ' ', { text: client.address, style: ['header', 'subHeader']}
				],
				margin: [0,0,0,40]
			},
			{
				table: {
					headerRows: 0,
					body: _.zip(timestamps, remarks)
				},
				layout: 'noBorders',
				margin: [0, 30]
			}
		],

		footer: [
			{text: 'YDERLIGERE OPLYSNINGER PÅ TLF. 86 16 46 44', alignment: 'center'},
			{
				text: 'Rapporten er genereret af GuardSwift - elektroniske vagtrapporter via smartphones',
				alignment: 'center'
			}
		],


		styles: {
			header: {
				fontSize: 22,
				bold: true,
				alignment: 'center'
			},
			subHeader: {
				fontSize: 16,
				color: 'grey'
			}
		}

	};


	return pdfMake.createPdf(docDefinition);


};
