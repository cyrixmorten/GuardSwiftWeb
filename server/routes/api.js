exports.pdfmake = function(req, res) {
  var fonts = {
    Roboto: {
      normal: 'fonts/Roboto-Regular.ttf',
      bold: 'fonts/Roboto-Medium.ttf',
      italics: 'fonts/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto-Italic.ttf'
    }
  };

  var PdfPrinter = require('pdfmake/src/printer');
  var printer = new PdfPrinter(fonts);


  if (req.body && req.body.content) {
    var pdfDoc = printer.createPdfKitDocument(req.body);
    //pdfDoc.pipe(fs.createWriteStream('basics.pdf'));
    pdfDoc.pipe(res);
    pdfDoc.end();
  } else {
    res.writeHead(500, {
      'Content-Type': 'text/html'
    });
    res.write('Document definition missing');
    res.end();
  }
};