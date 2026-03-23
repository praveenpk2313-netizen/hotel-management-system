const PDFDocument = require('pdfkit');

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

      // --- Brand Header ---
      doc
        .fillColor('#0f172a')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('StayNow Hotels', 50, 50)
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#c5a059')
        .text('Elite Stays • Verified Luxury', 50, 80)
        .text('www.staynow.app', 200, 50, { align: 'right' })
        .text('support@staynow.app', 200, 65, { align: 'right' })
        .moveDown();

      doc.rect(50, 110, 500, 2).fill('#f1f5f9');

      // --- Identity & Meta ---
      const metaTop = 140;
      doc
        .fillColor('#64748b')
        .fontSize(20)
        .text('INVOICE / RECEIPT', 50, metaTop);

      doc
        .fontSize(9)
        .fillColor('#0f172a')
        .text(`Invoice ID:`, 350, metaTop)
        .font('Helvetica-Bold')
        .text(`STAY-${booking._id.toString().substr(-8).toUpperCase()}`, 430, metaTop)
        .font('Helvetica')
        .text(`Issue Date:`, 350, metaTop + 15)
        .text(new Date().toLocaleDateString(), 430, metaTop + 15)
        .text(`Reference:`, 350, metaTop + 30)
        .text(booking.transactionId || 'Confirmed', 430, metaTop + 30);

      // --- Customer ---
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text('Guest Account:', 50, metaTop + 60)
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#475569')
        .text(booking.userId?.name || 'StayNow Guest', 50, metaTop + 80)
        .text(booking.userId?.email || '', 50, metaTop + 95);

      // --- Line Items Table ---
      const tableTop = 270;
      doc.rect(50, tableTop, 500, 20).fill('#f8fafc');
      
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor('#64748b')
        .text('DESCRIPTION', 60, tableTop + 6)
        .text('PROPERTY / ROOM', 180, tableTop + 6)
        .text('TOTAL PAID', 450, tableTop + 6, { align: 'right' });

      // Row 1
      const rowTop = tableTop + 35;
      const price = Number(booking.totalPrice) || 0;

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#0f172a')
        .text('Luxury Accommodation', 60, rowTop)
        .font('Helvetica-Bold')
        .text(`${booking.hotelName || 'StayNow Property'}`, 180, rowTop)
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#64748b')
        .text(`${booking.roomType}`, 180, rowTop + 12)
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text(`$${price.toFixed(2)}`, 450, rowTop, { align: 'right' });

      // --- Calculations ---
      const calcTop = 400;
      doc.rect(300, calcTop, 250, 1).stroke('#f1f5f9');
      
      doc
        .fontSize(10)
        .fillColor('#64748b')
        .text('Subtotal:', 300, calcTop + 20)
        .text(`$${price.toFixed(2)}`, 450, calcTop + 20, { align: 'right' })
        .text('Taxes & Fees:', 300, calcTop + 35)
        .text('$0.00', 450, calcTop + 35, { align: 'right' });

      doc.rect(300, calcTop + 55, 250, 40).fill('#0f172a');
      doc
        .fillColor('#ffffff')
        .fontSize(12)
        .text('TOTAL AMOUNT', 320, calcTop + 68)
        .fontSize(14)
        .text(`$${price.toFixed(2)}`, 430, calcTop + 66, { align: 'right' });

      // --- Footer ---
      doc
        .fillColor('#94a3b8')
        .fontSize(8)
        .text('This is a computer-generated document. No signature required.', 50, 700, { align: 'center', width: 500 })
        .text('Copyright © 2026 StayNow. All rights reserved.', 50, 715, { align: 'center', width: 500 });

      doc.end();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      reject(error);
    }
  });
};

module.exports = { generateInvoice };
