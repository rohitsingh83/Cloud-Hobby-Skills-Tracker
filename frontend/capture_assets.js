import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

const executablePath = CHROME_PATHS.find(p => fs.existsSync(p));
const screenshotsDir = 'C:\\Users\\Rohit Singh\\.gemini\antigravity\\scratch\\skillsphere-3d\\linkedin_assets\\screenshots';
const videoDir = 'C:\\Users\\Rohit Singh\\.gemini\\antigravity\\scratch\\skillsphere-3d\\linkedin_assets\\demo_video';

if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

async function run() {
  console.log(`[Asset Generator] Launching browser at: ${executablePath}`);
  const browser = await puppeteer.launch({
    executablePath,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--enable-webgl']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  console.log('[Asset Generator] Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000)); // Allow Three.js WebGL canvas to initialize

  // 1. Dashboard & 3D Hero
  console.log('Capturing: 01_Hero_3D_Galaxy_Dashboard.png');
  await page.screenshot({ path: path.join(screenshotsDir, '01_Hero_3D_Galaxy_Dashboard.png') });

  // 2. Scroll to 3D Cards
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 1000));
  console.log('Capturing: 02_Interactive_3D_Tilt_Cards.png');
  await page.screenshot({ path: path.join(screenshotsDir, '02_Interactive_3D_Tilt_Cards.png') });

  // 3. Open Practice Log Modal
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const logBtn = btns.find(b => b.textContent.includes('Log Practice'));
    if (logBtn) logBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  console.log('Capturing: 03_Practice_Logging_Modal.png');
  await page.screenshot({ path: path.join(screenshotsDir, '03_Practice_Logging_Modal.png') });

  // 4. Fill and submit practice log
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="text"]');
    if (inputs.length > 0) inputs[0].value = 'Acoustic fingerstyle chords and rhythm';
    const textareas = document.querySelectorAll('textarea');
    if (textareas.length > 0) textareas[0].value = 'Clean transitions on F-major bar chord';
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Commit Session'));
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing: 04_Milestone_Celebration.png');
  await page.screenshot({ path: path.join(screenshotsDir, '04_Milestone_Celebration.png') });

  // 5. Skills Galaxy Tab
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('nav button'));
    const skillsTab = tabs.find(t => t.textContent.includes('Skills Galaxy'));
    if (skillsTab) skillsTab.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  console.log('Capturing: 05_Skills_Galaxy_Portfolio.png');
  await page.screenshot({ path: path.join(screenshotsDir, '05_Skills_Galaxy_Portfolio.png') });

  // 6. Community Feed Tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('nav button'));
    const feedTab = tabs.find(t => t.textContent.includes('Community Feed'));
    if (feedTab) feedTab.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  console.log('Capturing: 06_Community_Social_Feed.png');
  await page.screenshot({ path: path.join(screenshotsDir, '06_Community_Social_Feed.png') });

  // 7. Cloud Architecture Tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('nav button'));
    const archTab = tabs.find(t => t.textContent.includes('Cloud Architecture'));
    if (archTab) archTab.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  console.log('Capturing: 07_Cloud_Architecture_Showcase.png');
  await page.screenshot({ path: path.join(screenshotsDir, '07_Cloud_Architecture_Showcase.png') });

  await browser.close();
  console.log('[Asset Generator] All high-resolution screenshots generated successfully!');
}

run().catch(err => {
  console.error('[Asset Generator Error]:', err);
  process.exit(1);
});
