const puppeteer = require('puppeteer');
const Tesseract = require('tesseract.js');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the NSE webpage for Tata Motors
  await page.goto('https://www.nseindia.com/get-quotes/equity?symbol=TATAMOTORS');

  // Wait for the relevant data to load
  await page.waitForSelector('.symbol-summary-container');

  // Capture a screenshot of the specific area containing data
  const elementHandle = await page.$('.volume strong');
  const screenshot = await elementHandle.screenshot();

  // Perform OCR on the screenshot using Tesseract
  const ocrResult = await Tesseract.recognize(screenshot, 'eng');
  const ocrText = ocrResult.data.text;

  // Define regular expression to extract required data
  const regex = /(\d+\.\d+)/;
  const matches = ocrText.match(regex);

  // Extracted data
  const extractedVolume = matches && matches[1];

  // Create a JSON object
  const data = {
    symbol: 'TATAMOTORS',
    volume: extractedVolume
  };

  // Convert the data object to JSON format
  const jsonData = JSON.stringify(data, null, 2); // Pretty formatting with 2-space indentation

  console.log('Extracted Data:', jsonData);

  await browser.close();
})();

