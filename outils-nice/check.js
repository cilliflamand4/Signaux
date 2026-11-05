const { chromium } = require('playwright'); const path=require('path');
(async () => {
  const file=process.argv[2]; const sizes=[[1920,1080],[1363,936],[1280,720],[1024,768]];
  const b = await chromium.launch();
  for (const [W,H] of sizes) {
    const p = await b.newPage({ viewport:{width:W,height:H} }); await p.goto('file://'+path.resolve(file)); await p.waitForTimeout(800);
    const n = await p.evaluate(()=>document.querySelectorAll('.slide').length); const probs=[];
    for (let s=0;s<n;s++){
      let k=0;
      while(true){
        const r = await p.evaluate(()=>{ const sl=document.querySelector('.slide.on'); const H=innerHeight, W=innerWidth; const out=[];
          const inner=sl.querySelector('.inner'); const ib=inner.getBoundingClientRect();
          if (ib.bottom>H-40 || ib.top<0 || ib.right>W+1 || ib.left<-1) out.push('inner '+Math.round(ib.top)+'..'+Math.round(ib.bottom));
          sl.querySelectorAll('.fil').forEach(f=>{ const fb=f.getBoundingClientRect(); const vis=[...f.querySelectorAll('.b.on')]; if(vis.length){ const first=vis[0].getBoundingClientRect(), last=vis[vis.length-1].getBoundingClientRect(); if(first.top<fb.top-1) out.push('fil clipped at top by '+Math.round(fb.top-first.top)+'px'); if(last.bottom>fb.bottom+1) out.push('fil clipped at bottom'); } });
          sl.querySelectorAll('.carte, .kpi div, .cap, .action, .bulle-seule').forEach(c=>{ if(c.scrollWidth>c.clientWidth+2) out.push('wide '+c.className); const cb=c.getBoundingClientRect(); if(cb.bottom>H-40) out.push('low '+c.className);});
          return out; });
        if (r.length) probs.push(`s${s+1}@${k}: ${r.join(' | ')}`);
        const more = await p.evaluate(()=>document.querySelector('.slide.on').querySelectorAll('.b:not(.on), .step:not(.on)').length);
        if(!more) break; await p.keyboard.press('ArrowRight'); await p.waitForTimeout(400); k++; if(k>30)break;
      }
      await p.keyboard.press('ArrowRight'); await p.waitForTimeout(120);
    }
    console.log(`${W}x${H}: ${probs.length? probs.join('\n  '):'OK'}`);
    await p.close();
  }
  await b.close();
})();
