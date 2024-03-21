const express = require('express');
const bodyParser = require('body-parser');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

app.post('/generate-pdf', async (req, res) => {
  try {
    const text = req.body.content;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Add text to the page
    page.drawText(text, {
      x: 50,
      y: height - 100,
      size: 12,
    });

    // Save the PDF document as bytes
    const pdfBytes = await pdfDoc.save();

    // Generate a unique file name for the PDF
    const fileName = `generated-pdf-${Date.now()}.pdf`;
    const filePath = `./public/${fileName}`;

    // Write the PDF bytes to a file
    fs.writeFileSync(filePath, pdfBytes);

    // Send a JSON response indicating success and the file name
    res.json({ success: true, fileName });
  } catch (error) {
    // If an error occurs, send a JSON response indicating failure
    console.error('Error generating PDF:', error);
    res.json({ success: false, error: 'Failed to generate PDF' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
