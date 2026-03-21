const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a booking invoice PDF
 * @param {Object} booking - Booking data
 * @returns {Promise<Buffer>} - PDF Buffer
 */
const generateInvoice = (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc
        .fillColor('#444444')
        .fontSize(20)
        .text('Grand Horizon Hotels', 110, 57)
        .fontSize(10)
        .text('Luxury Redefined', 110, 80)
        .text('123 Luxury Ave, Marina Bay', 200, 65, { align: 'right' })
        .text('Singapore, 018956', 200, 80, { align: 'right' })
        .moveDown();

      doc.rect(0, 120, 600, 2).fill('#c5a059');

      // Invoice Details
      doc
        .fillColor('#444444')
        .fontSize(25)
        .text('INVOICE', 50, 160);

      doc
        .fontSize(10)
        .text(`Invoice Number: INV-${booking._id.toString().substr(-6).toUpperCase()}`, 50, 200)
        .text(`Date: ${new Date().toLocaleDateString()}`, 50, 215)
        .text(`Booking ID: ${booking._id}`, 50, 230)
        .moveDown();

      // Customer Details
      doc
        .fontSize(12)
        .text('Billed To:', 50, 260)
        .fontSize(10)
        .text(booking.userId?.name || 'Valued Guest', 50, 280)
        .text(booking.userId?.email || '', 50, 295)
        .moveDown();

      // Table Header
      const tableTop = 330;
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Description', 50, tableTop)
        .text('Details', 200, tableTop)
        .text('Amount', 400, tableTop, { align: 'right' });

      doc.rect(50, tableTop + 15, 500, 1).stroke('#eeeeee');

      // Table Row
      const rowTop = tableTop + 30;
      doc
        .font('Helvetica')
        .text('Hotel Stay', 50, rowTop)
        .text(`${booking.hotelId?.name} - ${booking.roomId?.type}`, 200, rowTop)
        .text(`$${booking.totalPrice.toFixed(2)}`, 400, rowTop, { align: 'right' });

      // Footer
      doc.rect(50, rowTop + 20, 500, 1).stroke('#eeeeee');
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Total Amount:', 300, rowTop + 40)
        .text(`$${booking.totalPrice.toFixed(2)}`, 400, rowTop + 40, { align: 'right' });

      doc
        .fontSize(10)
        .font('Helvetica')
        .text('Thank you for choosing Grand Horizon Hotels. Have a pleasant stay!', 50, 700, { align: 'center', width: 500 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateInvoice };
