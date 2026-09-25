import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = 'https://github.com/rohitsingh83/Cloud-Hobby-Skills-Tracker';

const repoScreenshotsDir = 'C:\\Users\\Rohit Singh\\.gemini\\antigravity\\scratch\\skillsphere-3d\\linkedin_assets\\screenshots';
const desktopScreenshotsDir = 'C:\\Users\\Rohit Singh\\Desktop\\SkillSphere-3D-Assets\\screenshots';

async function captureRepo() {
  console.log(`[GitHub Capture] Launching browser to capture: ${targetUrl}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  console.log('[GitHub Capture] Navigating to GitHub repo page...');
  await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000)); // Allow badges and rendered markdown to load

  const repoFileName = '08_GitHub_Repository_Overview.png';
  const savePath1 = path.join(repoScreenshotsDir, repoFileName);
  const savePath2 = path.join(desktopScreenshotsDir, repoFileName);

  console.log(`[GitHub Capture] Saving to: ${savePath1}`);
  await page.screenshot({ path: savePath1 });

  if (fs.existsSync(desktopScreenshotsDir)) {
    console.log(`[GitHub Capture] Saving copy to Desktop: ${savePath2}`);
    fs.copyFileSync(savePath1, savePath2);
  }

  await browser.close();
  console.log('[GitHub Capture] Successfully captured GitHub repository screenshot!');
}

captureRepo().catch(err => {
  console.error('[GitHub Capture Error]:', err);
  process.exit(1);
});
