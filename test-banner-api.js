const fetch = require('node-fetch'); // or use native fetch if Node 18+

async function testBanner() {
  try {
    const response = await fetch('http://localhost:3000/api/banners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Banner Script',
        link: '/test',
        imageUrl: '/images/test.jpg',
        order: 99,
        active: true
      }),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testBanner();
