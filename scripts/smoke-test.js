const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const url = process.argv[2] || 'http://localhost:5173/';
  console.log('Opening', url);
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const logs = [];
  page.on('console', msg => logs.push({ type: 'console', text: msg.text() }));
  page.on('pageerror', err => logs.push({ type: 'pageerror', text: err.message }));
  page.on('requestfailed', req => logs.push({ type: 'requestfailed', url: req.url(), error: req.failure().errorText }));

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    console.log('HTTP', resp && resp.status());
  } catch (err) {
    console.error('Failed to load page:', err.message);
  }

  await page.waitForTimeout(1000);
  const screenshotPath = '/tmp/ems_smoke.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to', screenshotPath);

  const out = '/tmp/ems_smoke_logs.json';
  fs.writeFileSync(out, JSON.stringify(logs, null, 2));
  console.log('Logs saved to', out);

  await browser.close();
})();
