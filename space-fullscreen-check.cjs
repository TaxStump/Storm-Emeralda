const fs=require('node:fs');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.abort());
  const html=fs.readFileSync(__dirname+'/index.html','utf8').replace('  // ---------- Jalan ----------',`window.spaceTest={get:()=>({state,beam:!!beam,fullscreen:!!document.fullscreenElement}),ready:()=>{beam=null;beamCooldown=0;}};\n  // ---------- Jalan ----------`).replaceAll('requestAnimationFrame(loop);','/* deterministic input test */');
  await page.setContent(html);
  await page.click('#startBtn');
  await page.click('#fullscreenBtn');
  await page.waitForFunction(()=>!!document.fullscreenElement);
  for(const id of ['fullscreenBtn','pauseBtn','collectionBtn']) {
   await page.evaluate(id=>{spaceTest.ready();document.getElementById(id).focus();},id);
   await page.keyboard.press('Space');
   await page.waitForTimeout(80);
   assert.deepEqual(await page.evaluate(()=>spaceTest.get()),{state:'playing',beam:true,fullscreen:true},id);
  }
  await page.keyboard.down('Space');await page.keyboard.down('Space');await page.keyboard.up('Space');
  assert.equal(await page.evaluate(()=>spaceTest.get().state),'playing');
  await page.focus('#pauseBtn');await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>spaceTest.get().state),'paused');
  await page.focus('#resumeBtn');await page.keyboard.press('Space');
  assert.equal(await page.evaluate(()=>spaceTest.get().state),'playing');
  await page.click('#collectionBtn');await page.focus('#collectionClose');await page.keyboard.press('Space');
  assert.equal(await page.locator('#collectionDialog').evaluate(el=>el.open),false);
  await page.click('#resumeBtn');
  await page.evaluate(()=>document.exitFullscreen());
  await page.waitForFunction(()=>spaceTest.get().state==='paused');
  assert.deepEqual(errors,[]);
  console.log('PASS: focused fullscreen/pause/collection buttons + Space fire without pausing or exiting; held Space; Enter pause; Space resume/dialog close; deliberate fullscreen exit pauses.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
