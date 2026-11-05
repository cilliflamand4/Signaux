const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const file = process.argv[2], out = process.argv[3], W = +process.argv[4]||1363, H = +process.argv[5]||936;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(1200);
  const n = await p.evaluate(() => document.querySelectorAll('.slide').length);
  fs.mkdirSync(out, { recursive: true });
  for (let s = 0; s < n; s++) {
    let k = 0;
    while (true) {
      await p.screenshot({ path: `${out}/s${String(s+1).padStart(2,'0')}_${String(k).padStart(2,'0')}.png` });
      const more = await p.evaluate(() => { const sl = document.querySelector('.slide.on'); return sl.querySelectorAll('.b:not(.on), .step:not(.on)').length; });
      if (!more) break;
      await p.keyboard.press('ArrowRight'); await p.waitForTimeout(350); k++;
      if (k > 30) break;
    }
    await p.keyboard.press('ArrowRight'); await p.waitForTimeout(350);
  }
  await b.close();
})();
