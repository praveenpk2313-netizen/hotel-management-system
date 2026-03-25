const { generateInvoice } = require('./utils/pdfService');
(async () => {
  try {
    console.log('starting');
    const buf = await generateInvoice({_id: '123456789012345678901234'});
    console.log('success', buf.length);
  } catch (e) {
    console.error('fail', e);
  }
  process.exit();
})();
