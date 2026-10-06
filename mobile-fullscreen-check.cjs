const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const hooks=`
 window.mobileTest={start, pauseGame,resumeGame,fitFullscreenLayout,draw,
   ready:()=>{start('adventure');rocks=[];wilds=[];meteors=[];terrain=[];natureOrbs=[];portals=[];food=null;boss=null;bossAttacks=[];upgradeChoices=[];airLockCharge=100;ascentCharge=100;updateHud();updateCombatHud();updateNatureHud(performance.now());draw();},
   boss:()=>{startBoss();updateBossHud(performance.now());},
   status:()=>({state,dir,turnQueue,beam:!!beam,airLockCharge,ascentCharge,active:fullscreenActive()}),
   menu:returnToMenu,
   lang:setLang
 };
`;
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const errors=[],context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
  let source=fs.readFileSync(__dirname+'/index.html','utf8').replace('  // ---------- Jalan ----------',hooks+'\n  // ---------- Jalan ----------').replaceAll('requestAnimationFrame(loop);','/* test clock */');
  await context.route('**/*',r=>r.request().url()==='http://mobile.test/'?r.fulfill({contentType:'text/html',body:source}):r.abort());
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>Object.defineProperty(document,'fullscreenEnabled',{get:()=>false}));
  await page.goto('http://mobile.test/');assert.deepEqual(errors,[]);
  await page.locator('#fullscreenBtn').tap();await page.waitForTimeout(100);
  assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('touch-fullscreen')));
  await page.locator('#startBtn').tap();await page.evaluate(()=>mobileTest.ready());await page.waitForTimeout(100);
  const out=process.env.STORM_TEST_OUTPUT;if(out)fs.mkdirSync(out,{recursive:true});
  async function checkLayout(label){
   await page.waitForTimeout(100);
   const layout=await page.evaluate(()=>{
    const rect=id=>{const e=document.querySelector(id),r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom,display:getComputedStyle(e).display};};
    return {width:innerWidth,height:visualViewport.height,board:rect('.board'),pad:rect('.dpad'),buttons:[...document.querySelectorAll('#dpad button,#fullscreenBtn,#pauseBtn')].map(e=>{const r=e.getBoundingClientRect();return {id:e.id||e.dataset.dir,x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height};})};
   });
   assert.ok(layout.board.w>=160,label+' board readable '+JSON.stringify(layout));
   assert.ok(Math.abs(layout.board.w-layout.board.h)<1,label+' square arena');
   for(const b of layout.buttons){assert.ok(b.w>=44&&b.h>=44,label+' usable target '+JSON.stringify(b));assert.ok(b.x>=-1&&b.y>=-1&&b.right<=layout.width+1&&b.bottom<=layout.height+1,label+' visible control '+JSON.stringify(b));}
   assert.ok(layout.board.x>=0&&layout.board.y>=0&&layout.board.right<=layout.width+1&&layout.board.bottom<=layout.height+1,label+' board fits');
   if(layout.width<layout.height)assert.ok(layout.board.bottom<=layout.pad.y+1,label+' controls do not cover board');
  }
  for(const [width,height] of [[390,844],[320,568],[360,640],[844,390],[667,375],[568,320]]){
   await page.setViewportSize({width,height});await checkLayout(width+'x'+height);
   if(out)await page.screenshot({path:out+'/mobile-fullscreen-'+width+'x'+height+'.png'});
  }
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>mobileTest.ready());await page.waitForTimeout(100);
  await page.locator('[data-dir="up"]').tap();assert.equal((await page.evaluate(()=>mobileTest.status())).turnQueue[0].y,-1);
  await page.locator('#fireBtn').tap();assert.equal((await page.evaluate(()=>mobileTest.status())).beam,true);
  await page.locator('#airTouchBtn').tap();assert.equal((await page.evaluate(()=>mobileTest.status())).airLockCharge,0,'Air Lock touch works');
  await page.locator('#ascentTouchBtn').tap();assert.equal((await page.evaluate(()=>mobileTest.status())).ascentCharge,0,'Ascent touch works');
  await page.locator('#fullscreenBtn').tap();assert.equal((await page.evaluate(()=>mobileTest.status())).state,'paused','leaving focus pauses');
  assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('touch-fullscreen')),false);
  await page.locator('#fullscreenBtn').tap();await page.waitForTimeout(100);await page.locator('#resumeBtn').tap();
  await page.evaluate(()=>mobileTest.boss());await checkLayout('boss');
  await page.locator('#pauseBtn').tap();await page.locator('#pauseMenuBtn').tap();await page.waitForTimeout(100);
  await page.locator('#startBtn').tap();assert.equal((await page.evaluate(()=>mobileTest.status())).state,'playing','menu and restart within focus');
  await page.evaluate(()=>mobileTest.lang('en'));assert.equal(await page.locator('#fullscreenLabel').innerText(),'EXIT FOCUS');
  await page.keyboard.press('Escape');assert.equal((await page.evaluate(()=>mobileTest.status())).active,false);
  // Native Fullscreen API, then a rejected request: both keep the touch controls.
  const native=await context.newPage();native.on('pageerror',e=>errors.push(e.message));await native.goto('http://mobile.test/');
  await native.locator('#fullscreenBtn').tap();await native.waitForTimeout(150);
  assert.equal(await native.evaluate(()=>!!document.fullscreenElement),true,'native fullscreen enters');
  await native.evaluate(()=>mobileTest.ready());await native.waitForTimeout(100);assert.ok(await native.locator('#dpad').isVisible());
  await native.locator('#fullscreenBtn').tap();await native.waitForFunction(()=>!document.fullscreenElement&&mobileTest.status().state==='paused');
  await native.evaluate(()=>{document.documentElement.requestFullscreen=()=>Promise.reject(Error('denied'));});
  await native.locator('#fullscreenBtn').tap();assert.ok(await native.evaluate(()=>document.documentElement.classList.contains('focus-fullscreen')),'request failure falls back');
  assert.deepEqual(errors,[]);console.log('PASS: native/fallback/rejected fullscreen, six portrait/landscape sizes, visible 44px controls, square arena, touch direction/Beam, boss layout, pause on exit, menu/restart, Escape and translations.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
