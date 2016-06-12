require("cloud/app.js");

// global variables API keys etc,..
require("cloud/static.js");

//require("cloud/alarmFunctions.js");

// trigger functions
require("cloud/beforeSave.js");
require("cloud/afterSave.js");
require("cloud/afterDelete.js");

// helper functions
require("cloud/fileDelete.js");
require("cloud/fileToDatauri.js");
require("cloud/mailing.js");

// cleanup/statistics
require("cloud/cleanUp.js");
require("cloud/compatibility.js");
require("cloud/usageFunctions.js");

// payment
require("cloud/payment.js");

// daily upkeep
require("cloud/manageDailyReset.js");

// reports
//require("cloud/reportRegularMails.js");
require("cloud/pdfUtils.js");
require("cloud/reportToPDF.js");
require("cloud/reportSend.js");
require("cloud/reportSendDaily.js");

