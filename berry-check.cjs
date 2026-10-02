// Local-only timing and animation checks; all external requests are blocked.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');
(async () => {
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1100,height:900}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>r.abort());
    let html=fs.readFileSync(__dirname+'/index.html','utf8');
    html=html.replace('  // ---------- Jalan ----------',`
      let stages={};
      const timed=(name,fn)=>(...args)=>{const begin=performance.now();const result=fn(...args);stages[name]=(stages[name]||0)+performance.now()-begin;return result;};
      eat=timed('eat',eat);spawnFood=timed('spawnFood',spawnFood);syncRocks=timed('syncRocks',syncRocks);syncWilds=timed('syncWilds',syncWilds);syncPortals=timed('syncPortals',syncPortals);checkProgression=timed('progression',checkProgression);draw=timed('draw',draw);
      for(const name of ['drawBiomeAtmosphere','drawBossDomain','drawRock','drawWildMonster','drawNature','drawPortal','drawFood','drawLegendEffects','drawRings','drawParticles']) eval(name+'=timed("'+name+'",'+name+')');drawUpgradeChoices=timed('drawUpgrades',drawUpgradeChoices);drawPopups=timed('drawPopups',drawPopups);drawSnake=timed('drawSnake',drawSnake);drawBackground=timed('drawBackground',drawBackground);drawBoss=timed('drawBoss',drawBoss);
      window.perfTest={
        cache:()=>{const original=document.createElement.bind(document);let canvases=0;document.createElement=(tag,...args)=>{if(tag==='canvas')canvases++;return original(tag,...args);};const saved=upgradeChoices;try {upgradeChoices=UPGRADES.map((upgrade,i)=>({x:2+i*2,y:5,upgrade}));drawUpgradeChoices(0);drawUpgradeChoices(170);return {canvases,cached:upgradeSprites.size,expected:UPGRADES.length};} finally {upgradeChoices=saved;document.createElement=original;}},
        motion:()=>{start();tick();const duration=speedMs();return {step:duration,animation:moveDuration,late:renderedSnake(lastTick+duration*.8)[0],end:renderedSnake(lastTick+duration)[0]};},
        frames:()=>{pauseGame();const observer=new MutationObserver(()=>{});observer.observe(document.querySelector('.wrap'),{subtree:true,childList:true,attributes:true,characterData:true});const samples=[];for(let i=0;i<90;i++){const start=performance.now();loop(start);samples.push(performance.now()-start);}const mutations=observer.takeRecords().length;observer.disconnect();samples.sort((a,b)=>a-b);return {medianMs:samples[45],p95Ms:samples[85],mutations};},
        berry:()=>{restart();const samples=[],details=[];const board=document.querySelector('.board');const topBefore=board.getBoundingClientRect().top;for(let i=0;i<12;i++){snake=[{x:5,y:10},{x:4,y:10},{x:3,y:10}];dir=DIRS.right;nextDir=dir;rocks=[];wilds=[];portals=[];boss=null;bossAttacks=[];upgradeChoices=[];food={x:6,y:10,type:FOODS[0],shiny:false};stages={};const start=performance.now();tick();draw();const elapsed=performance.now()-start;samples.push(elapsed);if(elapsed>15)details.push({score,elapsed,stages});}const topAfter=board.getBoundingClientRect().top;samples.sort((a,b)=>a-b);return {medianMs:samples[6],maxMs:samples[11],topBefore,topAfter,details};}
      };
      // ---------- Jalan ----------`).replaceAll('requestAnimationFrame(loop);','/* controlled benchmark */');
    await page.setContent(html);
    const cache=await page.evaluate(()=>perfTest.cache());assert.equal(cache.canvases,0);assert.equal(cache.cached,cache.expected);
    console.log('PASS: all upgrade art cached before play; repeated draws create no canvases.');
    console.log(JSON.stringify(await page.evaluate(()=>({motion:perfTest.motion(),frames:perfTest.frames(),berry:perfTest.berry()})),null,2));
    if(errors.length)throw new Error(errors.join('\n'));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
