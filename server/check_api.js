const axios = require('axios');

async function check() {
  try {
    const res = await axios.get('http://localhost:5000/api/hotels');
    console.log('API Status:', res.status);
    console.log('Hotels returned:', res.data.length);
    res.data.forEach(h => {
      console.log(`Hotel: ${h.name}, isApproved: ${h.isApproved}, minPrice: ${h.minPrice}`);
    });
  } catch (err) {
    console.error('API Error:', err.message);
  }
}

check();
