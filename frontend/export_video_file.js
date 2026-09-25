import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const desktopVideoDir = 'C:\\Users\\Rohit Singh\\Desktop\\SkillSphere-3D-Assets\\demo_video';
const repoVideoDir = 'C:\\Users\\Rohit Singh\\.gemini\\antigravity\\scratch\\skillsphere-3d\\linkedin_assets\\demo_video';
const htmlPlayerPath = path.join(repoVideoDir, 'SkillSphere_3D_Demo_Video.html');

async function exportVideo() {
  console.log('[Video Exporter] Reading captured frames from HTML player...');
  if (!fs.existsSync(htmlPlayerPath)) {
    throw new Error('HTML player not found at: ' + htmlPlayerPath);
  }

  const content = fs.readFileSync(htmlPlayerPath, 'utf8');
  const match = content.match(/const frames = (\[.*?\]);/s);
  if (!match) {
    throw new Error('Could not parse frames array from HTML player.');
  }

  const framesJson = match[1];
  console.log('[Video Exporter] Launching Chrome to encode native WebM video via MediaRecorder...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,720']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Expose function to receive video base64 buffer
  let videoBase64Result = null;
  await page.exposeFunction('onVideoRecorded', (b64) => {
    videoBase64Result = b64;
  });

  // Inject encoder page
  const encoderHtml = `<!DOCTYPE html>
<html>
<body>
<canvas id="c" width="1280" height="720"></canvas>
<script>
  window.encodeFrames = async function(frames) {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const stream = canvas.captureStream(30);
    
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
    
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4000000 });
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: mimeType });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(',')[1];
        window.onVideoRecorded(base64data);
      };
      reader.readAsDataURL(blob);
    };

    recorder.start();

    for (let i = 0; i < frames.length; i++) {
      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 1280, 720);
          resolve();
        };
        img.src = 'data:image/jpeg;base64,' + frames[i];
      });
      await new Promise(r => setTimeout(r, 45)); // ~22 fps smooth rate
    }

    setTimeout(() => {
      recorder.stop();
    }, 500);
  };
</script>
</body>
</html>`;

  await page.setContent(encoderHtml);
  console.log('[Video Exporter] Rendering and recording frames into video stream...');
  await page.evaluate((json) => {
    const frames = JSON.parse(json);
    window.encodeFrames(frames);
  }, framesJson);

  // Wait for onVideoRecorded callback
  while (!videoBase64Result) {
    await new Promise(r => setTimeout(r, 500));
  }

  await browser.close();

  const buffer = Buffer.from(videoBase64Result, 'base64');
  const webmName = 'SkillSphere_3D_Demo_Video.webm';
  const out1 = path.join(repoVideoDir, webmName);
  const out2 = path.join(desktopVideoDir, webmName);

  fs.writeFileSync(out1, buffer);
  if (fs.existsSync(desktopVideoDir)) {
    fs.writeFileSync(out2, buffer);
  }

  console.log(`[Video Exporter] Successfully exported video (${Math.round(buffer.length / 1024)} KB)!`);
  console.log(`Saved at: ${out2}`);
}

exportVideo().catch(err => {
  console.error('[Video Exporter Error]:', err);
  process.exit(1);
});
