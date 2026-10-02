const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const hooks=`
 const check=(value,message)=>{if(!value)throw Error(message);};
 function arena(mode='adventure') {
  selectedPartner='none';start(mode);rocks=[];wilds=[];portals=[];meteors=[];terrain=[];natureOrbs=[];boss=null;bossAttacks=[];food=null;upgradeChoices=[];
  snake=[{x:5,y:10},{x:4,y:10},{x:3,y:10}];dir=DIRS.right;nextDir=dir;turnQueue=[];shield=0;shieldGraceUntil=0;
 }
 window.skyTest={arena,draw,pauseGame,resumeGame,setLang,loop,
 run:()=>{
  arena();let now=performance.now();updateSkyRift(now);check(nextSkyRift-now>=60000&&nextSkyRift-now<=90000,'60-90s schedule');
  check(spawnSkyRift(now)&&skyRift.entries.length===3,'three offers');
  check(new Set(skyRift.entries.map(c=>c.x+','+c.y)).size===3,'unique offers');
  for(const c of skyRift.entries)check(occupied(c.x,c.y),'reserved offers');
  const gate=skyRift.entries.find(c=>c.kind==='berry');skyRift.entries=[{...gate,x:6,y:10}];
  tick();check(skyRift.phase==='active'&&skyRift.kind==='berry'&&state==='playing','enter on movement');
  const length=snake.length;
  for(let i=0;i<3;i++){skyRift.token={x:snake[0].x+1,y:10};food=null;tick();}
  check(!skyRift&&snake.length===length&&multiplier===2&&ascentCharge===20,'berry reward/no growth');
  const charge=ascentCharge;collectSkyRift(9,10,performance.now());check(ascentCharge===charge,'reward once');
  arena();now=performance.now();spawnSkyRift(now);let c=skyRift.entries.find(c=>c.kind==='golden');collectSkyRift(c.x,c.y,now);const old=skyRift.token;
  updateSkyRift(now+2401);check(skyRift.token&&!(old.x===skyRift.token.x&&old.y===skyRift.token.y),'gold moves');
  c=skyRift.token;collectSkyRift(c.x,c.y,now+2402);check(!skyRift&&ascentCharge===20,'gold reward');
  arena();now=performance.now();spawnSkyRift(now);c=skyRift.entries.find(c=>c.kind==='meteor');collectSkyRift(c.x,c.y,now);updateSkyRift(now);
  check(meteors.length===2&&meteors.every(m=>m.landAt===now+1800&&m.skyRift&&!snake.some(s=>s.x===m.x&&s.y===m.y)),'meteor warning');
  updateSkyRift(now+15001);check(!skyRift&&meteors.length===0&&ascentCharge===20,'survival reward cleanup');
  arena();now=performance.now();spawnSkyRift(now);updateSkyRift(now+15001);check(!skyRift&&ascentCharge===0,'ignore offer');
  spawnSkyRift(now);c=skyRift.entries[0];collectSkyRift(c.x,c.y,now);updateSkyRift(now+15001);check(!skyRift&&ascentCharge===0,'failed collection');
  arena();now=performance.now();spawnSkyRift(now);cinematicsEnabled=true;startBoss();openCinematic();check(state==='playing'&&bossNotice&&!skyRift&&!document.querySelector('dialog[open]'),'boss notice without pause/modal');
  const oldTick=lastTick;tick();check(lastTick>=oldTick&&state==='playing','boss allows movement');
  damageBoss(Math.ceil(boss.maxHp/2));openCinematic();check(state==='playing'&&bossNotice.kind==='awakening','phase notice');
  arena();now=performance.now();bossAttacks=[{type:'blades',cells:[{x:5,y:10}],activeAt:now+100,until:now+1000,blocked:[]}];
  tick();check(bossAttacks[0].dodgeFrom,'late escape recorded');updatePerfectDodge(now+101);check(ascentCharge===15&&airLockCharge===10,'dodge charge');
  updatePerfectDodge(now+102);check(ascentCharge===15,'dodge once');
  arena();now=performance.now();bossAttacks=[{type:'blades',cells:[{x:5,y:10}],activeAt:now+1000,until:now+2000,blocked:[]}];tick();updatePerfectDodge(now+1001);check(ascentCharge===0,'no early dodge');
  arena();now=performance.now();bossAttacks=[{type:'psycho',x:5,y:10,activeAt:now+100,until:now+1000,blocked:[]}];recordPerfectDodge({x:5,y:10},{x:6,y:9},now,true);check(!bossAttacks[0].dodgeFrom,'no portal dodge');
  bossAttacks=[{type:'blades',cells:[{x:5,y:10}],activeAt:now+100,until:now+1000,blocked:['5,10']}];tick();updatePerfectDodge(now+101);check(ascentCharge===0,'no cleared attack dodge');
  arena();now=performance.now();bossAttacks=[{type:'blades',cells:[{x:5,y:10}],activeAt:now+100,until:now+1000,blocked:[]}];shieldGraceUntil=now+2000;tick();updatePerfectDodge(now+101);check(ascentCharge===0,'no grace dodge');
  arena();now=performance.now();spawnSkyRift(now);bossNotice={type:'groudon',kind:'arrival',until:now+3200};const until=skyRift.until,notice=bossNotice.until;pauseGame();pausedAt-=1500;resumeGame();check(skyRift.until-until>=1500&&bossNotice.until-notice>=1500,'pause shifts timers');
  reset();check(!skyRift&&!bossNotice&&!skyMessage&&dodgeCooldown===0&&nextSkyRift===0,'reset');
  arena('rush');check(!spawnSkyRift(performance.now()),'rush excluded');arena('training');check(!spawnSkyRift(performance.now()),'training excluded');
  arena('daily');now=performance.now();spawnSkyRift(now);const first=JSON.stringify(skyRift.entries);arena('daily');spawnSkyRift(now);check(first===JSON.stringify(skyRift.entries),'daily deterministic');
  arena();now=performance.now();spawnSkyRift(now);const before=JSON.stringify({skyRift,rngState,score});for(let i=0;i<20;i++)drawSkyRift(now+i*16);check(before===JSON.stringify({skyRift,rngState,score}),'render is pure');
  const samples=[];for(let i=0;i<90;i++){const at=performance.now();draw();samples.push(performance.now()-at);}samples.sort((a,b)=>a-b);updateSkyHud(now);
  return {median:samples[45],p95:samples[85]};
 },
 scene:()=>{arena();cinematicsEnabled=true;startBoss();},
 status:()=>({state,notice:!!bossNotice,head:{...snake[0]}}),
 preview:()=>{arena();spawnSkyRift(performance.now());updateSkyHud(performance.now());pauseGame();draw();}
 };
`;
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1100,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.abort());
  const source=fs.readFileSync(__dirname+'/index.html','utf8').replace('  // ---------- Jalan ----------',hooks+'\n  // ---------- Jalan ----------');
  await page.setContent(source.replaceAll('requestAnimationFrame(loop);','/* test clock */'));
  console.log('Sky Rift rendering:',await page.evaluate(()=>skyTest.run()));
  for(const width of [320,390,1100]){await page.setViewportSize({width,height:950});await page.evaluate(()=>skyTest.preview());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(process.env.STORM_TEST_OUTPUT){await page.locator('#pauseOverlay').evaluate(el=>el.classList.add('hidden'));await page.screenshot({path:process.env.STORM_TEST_OUTPUT+'/sky-'+width+'.png',fullPage:true});}}
  await page.evaluate(()=>skyTest.setLang('en'));await page.evaluate(()=>skyTest.loop(performance.now()));assert.ok((await page.locator('#skyTitle').innerText()).includes('choose'));
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>skyTest.draw());
  const live=await browser.newPage({viewport:{width:1100,height:950}});live.on('pageerror',e=>errors.push(e.message));await live.route('**/*',r=>r.abort());
  await live.setContent(source);await live.evaluate(()=>skyTest.scene());await live.waitForFunction(()=>skyTest.status().notice);
  assert.equal((await live.evaluate(()=>skyTest.status())).state,'playing');
  const before=await live.evaluate(()=>skyTest.status().head);await live.waitForFunction(before=>{const current=skyTest.status();return current.state==='playing'&&(current.head.x!==before.x||current.head.y!==before.y);},before,{timeout:5000});
  await live.evaluate(()=>skyTest.pauseGame());assert.deepEqual(errors,[]);await live.close();
  console.log('PASS: optional three-way rift, all challenges/rewards/expiry/occupancy, boss cancellation, non-blocking arrival/phase and real movement, dodge timing/exclusions/single reward, pause/reset, modes/daily seed, pure drawing, ID/EN, 320/390px and reduced motion.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
