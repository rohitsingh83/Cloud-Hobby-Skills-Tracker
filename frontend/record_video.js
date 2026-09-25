import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const videoDir = 'C:\\Users\\Rohit Singh\\.gemini\\antigravity\\scratch\\skillsphere-3d\\linkedin_assets\\demo_video';

if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

async function recordWalkthrough() {
  console.log('[Video Recorder] Starting automated demo session...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,720', '--enable-webgl']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const client = await page.target().createCDPSession();
  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 85,
    maxWidth: 1280,
    maxHeight: 720,
    everyNthFrame: 2
  });

  const frames = [];
  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    frames.push(data);
    try {
      await client.send('Page.screencastFrameAck', { sessionId });
    } catch (e) {}
  });

  console.log('[Video Recorder] Loading application...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Step 1: Orbit 3D canvas with mouse movement
  console.log('[Video Recorder] Action: Orbiting 3D Skill Galaxy Canvas...');
  for (let x = 400; x < 900; x += 30) {
    await page.mouse.move(x, 300);
    await new Promise(r => setTimeout(r, 60));
  }

  // Step 2: Scroll down to 3D tilt cards
  console.log('[Video Recorder] Action: Exploring dynamic 3D skill cards...');
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, 100));
    await new Promise(r => setTimeout(r, 200));
  }
  await new Promise(r => setTimeout(r, 800));

  // Step 3: Scroll back up & Open Practice Logger
  console.log('[Video Recorder] Action: Opening Practice Session Modal...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const logBtn = btns.find(b => b.textContent.includes('Log Practice'));
    if (logBtn) logBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Step 4: Fill activity and submit
  console.log('[Video Recorder] Action: Logging session & triggering 3D confetti...');
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="text"]');
    if (inputs.length > 0) inputs[0].value = 'Acoustic fingerstyle chords';
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Commit Session'));
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000)); // Allow celebration to play

  // Step 5: Switch to Skills Galaxy
  console.log('[Video Recorder] Action: Filtering Skills Galaxy...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('nav button'));
    const skillsTab = tabs.find(t => t.textContent.includes('Skills Galaxy'));
    if (skillsTab) skillsTab.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Step 6: Switch to Community Feed
  console.log('[Video Recorder] Action: Browsing Community Social Feed...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('nav button'));
    const feedTab = tabs.find(t => t.textContent.includes('Community Feed'));
    if (feedTab) feedTab.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Step 7: Like a post
  await page.evaluate(() => {
    const likeBtn = document.querySelector('article button');
    if (likeBtn) likeBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await client.send('Page.stopScreencast');
  await browser.close();

  console.log(`[Video Recorder] Captured ${frames.length} frames.`);

  // Generate self-contained high-framerate HTML5 video player
  const playerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SkillSphere 3D — Official Demo Walkthrough Video</title>
  <style>
    body { background: #090A10; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .video-container { max-width: 1000px; width: 100%; background: #171A2C; border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 240, 255, 0.2); }
    img#frame { width: 100%; display: block; aspect-ratio: 16/9; background: #000; }
    .controls { padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; background: rgba(15, 17, 29, 0.9); }
    button { background: #00F0FF; color: #000; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; }
    button:hover { background: #38bdf8; }
    .timeline { flex: 1; margin: 0 20px; height: 6px; background: #334155; border-radius: 3px; position: relative; cursor: pointer; }
    .progress { height: 100%; background: #00F0FF; width: 0%; border-radius: 3px; }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 16px;">
    <h1 style="margin: 0; font-size: 24px; color: #00F0FF;">SkillSphere 3D: Live Walkthrough Video</h1>
    <p style="margin: 4px 0 0 0; font-size: 14px; color: #94a3b8;">Recorded Demo: 3D Galaxy Canvas, Practice Logging, Streaks, Confetti, and Community Sharing</p>
  </div>
  <div class="video-container">
    <img id="frame" src="data:image/jpeg;base64,${frames[0] || ''}" alt="Video Frame">
    <div class="controls">
      <button id="playBtn" onclick="togglePlay()">Pause</button>
      <div class="timeline" onclick="seek(event)">
        <div class="progress" id="progress"></div>
      </div>
      <span id="counter" style="font-family: monospace; font-size: 13px; color: #94a3b8;">Frame 1 / ${frames.length}</span>
    </div>
  </div>
  <script>
    const frames = ${JSON.stringify(frames)};
    let current = 0;
    let playing = true;
    const img = document.getElementById('frame');
    const progress = document.getElementById('progress');
    const counter = document.getElementById('counter');
    const playBtn = document.getElementById('playBtn');

    function step() {
      if (playing && frames.length > 0) {
        current = (current + 1) % frames.length;
        img.src = 'data:image/jpeg;base64,' + frames[current];
        progress.style.width = ((current / frames.length) * 100) + '%';
        counter.textContent = 'Frame ' + (current + 1) + ' / ' + frames.length;
      }
      setTimeout(step, 80);
    }
    step();

    function togglePlay() {
      playing = !playing;
      playBtn.textContent = playing ? 'Pause' : 'Play';
    }

    function seek(e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      current = Math.floor(pct * frames.length);
      img.src = 'data:image/jpeg;base64,' + frames[current];
      progress.style.width = (pct * 100) + '%';
    }
  </script>
</body>
</html>`;

  const videoFilePath = path.join(videoDir, 'SkillSphere_3D_Demo_Video.html');
  fs.writeFileSync(videoFilePath, playerHtml);
  console.log(`[Video Recorder] Demo video successfully saved at: ${videoFilePath}`);
}

recordWalkthrough().catch(err => {
  console.error('[Video Recorder Error]:', err);
});
