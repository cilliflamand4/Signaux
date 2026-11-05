const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('file:///home/claude/signaux/index.html'); await p.waitForTimeout(1200);
  const r = sel => p.evaluate(s => { const el = document.querySelector(s); const b = el.getBoundingClientRect(); return { top: b.top + window.scrollY, bottom: b.bottom + window.scrollY }; }, sel);
  // 1. accueil : accroche + recherche "jalousie" + résultats + 2 tuiles
  await p.fill('#accueil input[type=search]', 'jalousie'); await p.waitForTimeout(700);
  const a1 = await r('#accueil .portes'), a2 = await r('#accueil .resultats');
  const t3 = await p.evaluate(() => { const li = document.querySelectorAll('#accueil ul.tuiles > li')[1]; const b = li.getBoundingClientRect(); return b.bottom + window.scrollY; });
  console.log('accueil', a1, a2, t3);
  await p.screenshot({ path: 'cap1.png', fullPage: true, clip: { x: 0, y: a1.top - 10, width: 390, height: a2.bottom - a1.top + 16 } });
  // 2 & 3 : fiche relation
  await p.fill('#accueil input[type=search]', '');
  await p.click('#accueil button[data-go="relation"]'); await p.waitForTimeout(900);
  const info = await p.evaluate(() => {
    const sec = document.querySelector('#relation'); const h3s = [...sec.querySelectorAll('h3')];
    const ecrire = h3s.find(h => h.textContent.includes('Tu peux écrire')); const imsg = sec.querySelector('.imsg');
    const demain = h3s.find(h => h.textContent.includes('Et demain')); const appels = demain.nextElementSibling;
    const rr = el => { const b = el.getBoundingClientRect(); return { top: b.top + window.scrollY, bottom: b.bottom + window.scrollY }; };
    return { ecrire: rr(ecrire), imsg: rr(imsg), demain: rr(demain), appels: rr(appels), on: sec.classList.contains('on') };
  });
  console.log(info);
  await p.screenshot({ path: 'cap2.png', fullPage: true, clip: { x: 0, y: info.ecrire.top - 10, width: 390, height: info.imsg.bottom - info.ecrire.top + 20 } });
  await p.screenshot({ path: 'cap3.png', fullPage: true, clip: { x: 0, y: info.demain.top - 10, width: 390, height: info.appels.bottom - info.demain.top + 20 } });
  await b.close();
})();
