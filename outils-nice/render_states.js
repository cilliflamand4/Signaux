const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
(async () => {
  const file=process.argv[2], out=process.argv[3], W=+process.argv[4], H=+process.argv[5];
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:W,height:H}});
  await p.goto('file://'+path.resolve(file)); await p.waitForTimeout(1000);
  await p.addStyleTag({content:'.hud,.barre{display:none!important}.slide{padding:3vh 3vw 3vh!important}body{padding-left:0!important;padding-right:0!important}'});
  await p.waitForTimeout(300);
  const n=await p.evaluate(()=>document.querySelectorAll('.slide').length); fs.mkdirSync(out,{recursive:true});
  const meta=[];
  for(let s=0;s<n;s++){
    const total=await p.evaluate(()=>{const sl=document.querySelector('.slide.on');return sl.querySelectorAll('.b:not(.on), .step:not(.on)').length;});
    const notes=await p.evaluate(()=>{const a=document.querySelector('.slide.on .notes');return a?a.textContent.trim():'';});
    const title=await p.evaluate(()=>{const h=document.querySelector('.slide.on h1, .slide.on h2');return h?h.textContent.trim():'';});
    let k=0;
    while(true){
      const f=`${out}/s${String(s+1).padStart(2,'0')}_${String(k).padStart(2,'0')}.png`;
      await p.screenshot({path:f}); meta.push({slide:s+1,click:k,total,notes,title,file:f});
      const more=await p.evaluate(()=>document.querySelector('.slide.on').querySelectorAll('.b:not(.on), .step:not(.on)').length);
      if(!more) break; await p.keyboard.press('ArrowRight'); await p.waitForTimeout(450); k++; if(k>40) break;
    }
    await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
  }
  fs.writeFileSync(`${out}/meta.json`,JSON.stringify(meta,null,1)); console.log(meta.length,'states');
  await b.close();
})();
