// Local-only integration checks: no leaderboard or other external traffic.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const hooks = `
 const check=(value,label)=>{if(!value)throw Error(label);};
 function clean(mode='adventure') {
   selectedPartner='none'; start(mode); rocks=[];wilds=[];portals=[];meteors=[];terrain=[];
   natureOrbs=[];boss=null;bossAttacks=[];food=null;upgradeChoices=[];
   snake=[{x:5,y:10},{x:4,y:10},{x:3,y:10}];dir=DIRS.right;nextDir=dir;turnQueue=[];
 }
 window.sanctuaryTest={
 run:()=>{
   clean();let now=performance.now();check(biomeIndex===4,'Adventure starts in cavern');
   score=90000;syncBiome();check(biomeIndex===4,'score cannot skip region');score=0;
   updateSanctuary(now);check(nextRescue===now+12000,'first offer schedule');
   check(spawnRescue(now),'rescue spawns');check(occupied(rescue.egg.x,rescue.egg.y)&&occupied(rescue.nest.x,rescue.nest.y),'reserved egg/nest');
   check(rescue.egg.x!==rescue.nest.x||rescue.egg.y!==rescue.nest.y,'distinct egg and nest');
   rescue.egg={x:6,y:10};rescue.nest={x:8,y:10};rescue.species=0;
   const count=haven[0],length=snake.length;tick();check(rescue.phase==='carry'&&snake.length===length,'pickup via real movement without growth');
   tick();tick();check(!rescue&&haven[0]===count+1&&airLockCharge===25,'delivery hatches and rewards');
   collectSanctuary(8,10,now);check(haven[0]===count+1,'single reward');
   clean();now=performance.now();spawnRescue(now);rescue.phase='carry';rescue.egg=null;rescue.nextHunt=now;
   updateSanctuary(now);check(rescue.hunt.at===now+2600,'2600ms warning');
   const hunt={...rescue.hunt};snake[2]={x:hunt.x+1,y:hunt.y};updateSanctuary(now+2601);
   check(rescue&&!rescue.hunt,'escape hunter');rescue.hunt={...snake[2],at:now+3000};const previousScore=score;
   updateSanctuary(now+3001);check(!rescue&&score===previousScore&&state==='playing','hunter steals egg only');
   clean();now=performance.now();spawnRescue(now);updateSanctuary(now+25001);check(!rescue&&rescueMessage.key==='rescue.expired','offer expires');
   clean();now=performance.now();spawnRescue(now);rescue.phase='carry';rescue.egg=null;rescue.hunt={x:3,y:10,at:now+2600};
   startBoss();check(rescue.sheltered&&!rescue.hunt&&!rescue.nest,'boss shelters egg');
   const species=rescue.species;damageBoss(999);check(region===1&&chapterPending&&biomeIndex===5,'boss unlocks sea');
   showChapter();check(state==='paused'&&document.getElementById('chapterDialog').open,'arrival waits for player');
   const elapsed=runElapsed();pausedAt-=5000;closeChapter();check(state==='playing'&&Math.abs(runElapsed()-elapsed)<30,'arrival pause excludes play time');
   updateSanctuary(performance.now());check(rescue&&!rescue.sheltered&&rescue.nest&&rescue.species===species,'egg restored after boss');
   for(const expected of [2,3]){startBoss();damageBoss(999);showChapter();check(region===expected,'next region');closeChapter();}
   startBoss();damageBoss(999);check(region===3&&!chapterPending,'final region stays endless');
   clean();now=performance.now();spawnRescue(now);rescue.phase='carry';rescue.egg=null;rescue.hunt={x:3,y:10,at:now+2600};
   regionToken={x:10,y:10,nextDrift:now+4000,until:now+16000};const deadline=rescue.hunt.at,drift=regionToken.nextDrift;
   pauseGame();pausedAt-=4000;resumeGame();check(rescue.hunt.at-deadline>=4000&&regionToken.nextDrift-drift>=4000,'pause shifts hunter and current');
   for(let i=0;i<4;i++){
     clean();region=i;regionToken={x:6,y:10,nextDrift:0,until:performance.now()+16000};tick();
     check(!regionToken&&airLockCharge===[8,12,0,8][i]&&ascentCharge===[0,0,12,8][i],'region reward '+i);
   }
   clean();region=1;now=performance.now();regionToken={x:10,y:10,nextDrift:now,until:now+16000};rocks=[{x:11,y:10}];
   updateSanctuary(now);check(regionToken.x===10,'pearl does not drift into obstacle');rocks=[];updateSanctuary(now+4001);check(regionToken.x===11,'pearl drifts right');
   updateSanctuary(now+16001);check(!regionToken,'region token expiry');
   clean();now=performance.now();spawnRescue(now);const snapshot=JSON.stringify({rescue,regionToken,haven,rngState,score});
   for(let i=0;i<20;i++)drawSanctuary(now+i*16,snake);
   check(snapshot===JSON.stringify({rescue,regionToken,haven,rngState,score}),'drawing is pure');
   reset();check(!rescue&&!regionToken&&!hatchEffect&&!rescueMessage&&!chapterPending&&region===0&&nextRescue===0,'reset clears run state');
   for(const mode of ['daily','rush','training']){clean(mode);updateSanctuary(performance.now()+90000);check(!spawnRescue(performance.now())&&!rescue&&!regionToken,'mode isolation '+mode);}
   clean('daily');score=4000;const expected=targetBiome();region=3;check(targetBiome()===expected,'daily biome preserved');
   clean();for(const language of ['id','en']){setLang(language);for(const key of Object.keys(I18N.id).filter(k=>/^(haven|rescue|chapter)\\./.test(k)))check(I18N[language][key],language+' translation '+key);}
   setLang('id');return {rescued:haven.reduce((a,b)=>a+b,0),storage:havenWritable};
 },
 preview:(stage=0,carrying=false)=>{
   clean();region=stage;syncBiome();biomeFrom=biomeIndex;snake=[{x:9,y:10},{x:8,y:10},{x:7,y:10},{x:6,y:10},{x:6,y:11},{x:6,y:12},{x:5,y:12}];
   food={x:13,y:7,type:FOODS[0],shiny:false};spawnRescue(performance.now());
   rescue.egg={x:11,y:10};rescue.nest={x:14,y:13};
   if(carrying){rescue.phase='carry';rescue.egg=null;rescue.hunt={x:5,y:12,at:performance.now()+2300};}
   regionToken={x:12,y:12,nextDrift:performance.now()+4000,until:performance.now()+16000};
   pauseGame();updateRescueHud(pausedAt);document.getElementById('pauseOverlay').classList.add('hidden');draw();
 },
 garden:()=>{haven=[2,1,3];renderHaven();document.getElementById('gardenDialog').showModal();},
 chapter:()=>{clean();region=1;syncBiome();chapterPending=true;showChapter();},
 persist:()=>{clean();spawnRescue(performance.now());rescue.species=2;finishRescue(true,performance.now());return haven;},
 liveOffer:()=>{clean();spawnRescue(performance.now());rescue.egg={x:6,y:10};rescue.nest={x:8,y:10};rescue.species=1;return haven[1];},
 liveBoss:()=>{clean();startBoss();damageBoss(999);},
 status:()=>({state,haven,region,head:snake[0]}),setLang,draw,closeChapter,pauseGame,
 };
`;
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
   const context=await browser.newContext({viewport:{width:1200,height:1000}});
   const original=fs.readFileSync(__dirname+'/index.html','utf8');
   const html=original.replace('  // ---------- Jalan ----------',hooks+'\n  // ---------- Jalan ----------').replaceAll('requestAnimationFrame(loop);','/* test clock */');
   await context.route('**/*',r=>r.request().url()==='http://storm.test/'?r.fulfill({contentType:'text/html',body:html}):r.abort());
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://storm.test/');console.log('Mechanics:',await page.evaluate(()=>sanctuaryTest.run()));
   const saved=await page.evaluate(()=>sanctuaryTest.persist());await page.reload();assert.deepEqual((await page.evaluate(()=>sanctuaryTest.status())).haven,saved);
   const out=process.env.STORM_TEST_OUTPUT;
   if(out)fs.mkdirSync(out,{recursive:true});
   for(let stage=0;stage<4;stage++){
     await page.evaluate(stage=>sanctuaryTest.preview(stage,stage===0),stage);
     if(out)await page.screenshot({path:out+'/region-'+stage+'.png',fullPage:true});
   }
   for(const width of [320,390,1200]){
     await page.setViewportSize({width,height:1000});await page.evaluate(()=>sanctuaryTest.preview());
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page width '+width);
     await page.click('#gardenBtn');assert.ok(await page.locator('#gardenDialog').evaluate(d=>d.open&&d.scrollWidth<=d.clientWidth));
     await page.keyboard.press('Escape');assert.equal(await page.locator('#gardenDialog').evaluate(d=>d.open),false);
     assert.equal((await page.evaluate(()=>sanctuaryTest.status())).state,'paused');
     await page.evaluate(()=>sanctuaryTest.chapter());
     assert.ok(await page.locator('#chapterDialog').evaluate(d=>d.open&&d.scrollWidth<=d.clientWidth));
     if(out)await page.screenshot({path:out+'/chapter-'+width+'.png',fullPage:true});
     await page.click('#chapterContinue');assert.equal((await page.evaluate(()=>sanctuaryTest.status())).state,'playing');
   }
   await page.evaluate(()=>sanctuaryTest.preview());await page.evaluate(()=>sanctuaryTest.garden());
   if(out)await page.screenshot({path:out+'/garden-desktop.png',fullPage:true});
   await page.setViewportSize({width:390,height:844});if(out)await page.screenshot({path:out+'/garden-mobile.png',fullPage:true});
   await page.evaluate(()=>sanctuaryTest.setLang('en'));assert.equal(await page.locator('#gardenTitle').innerText(),'Garden of Skybound Friends');
   await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>sanctuaryTest.draw());
   await page.close();
   const blocked=await context.newPage();blocked.on('pageerror',e=>errors.push(e.message));
   await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('storage blocked');}});});
   await blocked.goto('http://storm.test/');assert.equal((await blocked.evaluate(()=>sanctuaryTest.run())).storage,false);
   const live=await context.newPage();live.on('pageerror',e=>errors.push(e.message));
   await live.route('http://storm.test/',r=>r.fulfill({contentType:'text/html',body:original.replace('  // ---------- Jalan ----------',hooks+'\n  // ---------- Jalan ----------')}));
   await live.goto('http://storm.test/');const previous=await live.evaluate(()=>sanctuaryTest.liveOffer());
   await live.waitForFunction(previous=>sanctuaryTest.status().haven[1]===previous+1,previous,{timeout:5000});
   await live.evaluate(()=>sanctuaryTest.pauseGame());
   await live.evaluate(()=>sanctuaryTest.liveBoss());await live.waitForFunction(()=>document.getElementById('chapterDialog').open);
   assert.equal((await live.evaluate(()=>sanctuaryTest.status())).state,'paused');
   const before=await live.evaluate(()=>sanctuaryTest.status().head);await live.click('#chapterContinue');
   await live.waitForFunction(before=>{const s=sanctuaryTest.status();return s.state==='playing'&&(s.head.x!==before.x||s.head.y!==before.y);},before,{timeout:5000});
   await live.evaluate(()=>sanctuaryTest.pauseGame());await live.close();
   assert.deepEqual(errors,[]);
   console.log('PASS: rescue movement/persistence/rewards, hunter warning/escape/loss, boss shelter, four regions, transition pause, region rewards/drift, timer pause/reset, mode isolation, pure rendering, ID/EN, 320/390px, keyboard dialog controls, reduced motion and blocked storage.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
