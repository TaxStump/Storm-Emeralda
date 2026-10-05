// Network-isolated checks of Pikachu discovery, partner protection and animated art.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const hooks=`
 const check=(v,m)=>{if(!v)throw Error(m);};
 function pikaArena(mode='adventure') {
   selectedPartner='none';start(mode);rocks=[];wilds=[];portals=[];meteors=[];terrain=[];natureOrbs=[];boss=null;bossAttacks=[];food=null;upgradeChoices=[];skyRift=null;
   snake=[{x:5,y:10},{x:4,y:10},{x:3,y:10}];dir=DIRS.right;nextDir=dir;turnQueue=[];
 }
 window.pikaTest={run:()=>{
   pikachuUnlocked=false;pikaArena();let now=performance.now();updatePikachuEncounter(now+20000);check(!pikachuIsland,'no cave encounter');
   region=1;updatePikachuEncounter(now);check(nextPikachuIsland===now+6000,'sea introduction timer');updatePikachuEncounter(now+6001);
   check(pikachuIsland,'sea island spawns');for(const dx of [-1,0,1])for(const dy of [-1,0,1])check(occupied(pikachuIsland.x+dx,pikachuIsland.y+dy),'reserved island area');
   pikachuIsland={x:14,y:10};airLockCharge=100;activateAirLock();check(!pikachuUnlocked,'too far from island');
   airLockUntil=0;pikachuIsland={x:7,y:10};airLockCharge=99;activateAirLock();check(!pikachuUnlocked,'full Air Lock required');
   airLockCharge=100;activateAirLock();check(pikachuUnlocked&&!pikachuIsland&&airLockCharge===0,'Air Lock rescues Pikachu');
   check(runPartner==='none'&&selectedPartner==='none','unlock does not silently change partner');
   document.getElementById('pikachuEquip').click();check(selectedPartner==='pikachu'&&runPartner==='none','garden equips next run only');
   start('adventure');check(runPartner==='pikachu','selected partner on next run');
   rocks=[];wilds=[];portals=[];meteors=[];terrain=[];natureOrbs=[];boss=null;food=null;upgradeChoices=[];
   snake=[{x:5,y:10},{x:4,y:10},{x:3,y:10}];now=performance.now();spawnRescue(now);rescue.phase='carry';rescue.egg=null;
   rescue.hunt={x:3,y:10,at:now};const originalScore=score;updateSanctuary(now);
   check(rescue&&rescue.pikaUsed&&!rescue.hunt&&pikachuFlash&&score===originalScore,'one Thunder Shock prevents actual theft');
   rescue.hunt={x:3,y:10,at:now+10};updateSanctuary(now+11);check(!rescue,'second theft not protected');
   spawnRescue(now+20);check(!rescue.pikaUsed,'new mission refreshes protection');rescue.phase='carry';rescue.egg=null;
   rescue.hunt={x:2,y:10,at:now+30};updateSanctuary(now+31);check(rescue&&!rescue.pikaUsed,'successful player dodge does not spend protection');
   rescue.hunt={x:3,y:10,at:now+40};updateSanctuary(now+41);check(rescue.pikaUsed,'new mission protection works');
   startBoss();check(rescue.sheltered&&rescue.pikaUsed,'boss shelter preserves spent protection');
   boss=null;restoreRescue(now+50);check(rescue.pikaUsed,'restore cannot recharge protection');
   pikachuFlash={x:3,y:10,until:now+900};nextPikachuIsland=now+1000;pikachuNoticeUntil=now+2000;
   pauseGame();pausedAt-=1500;resumeGame();check(pikachuFlash.until>=now+2400&&nextPikachuIsland>=now+2500,'pause shifts effect and encounter timers');
   food={x:6,y:10,type:FOODS[0],shiny:false};const before=food;partner.nextCollect=0;updatePartner(performance.now());check(food===before,'Pikachu cannot collect Pip berries');
   reset();check(!pikachuIsland&&!pikachuFlash&&!pikachuNoticeUntil&&!nextPikachuIsland,'run resets transient state');check(pikachuUnlocked,'reset keeps friendship');
   for(const mode of ['daily','rush','training']){pikaArena(mode);pikachuUnlocked=false;region=1;updatePikachuEncounter(performance.now()+90000);check(!pikachuIsland&&!pikachuUnlocked,'no discovery in '+mode);}
   pikachuUnlocked=true;pikaArena();runPartner='pikachu';now=performance.now();spawnRescue(now);
   const snapshot=JSON.stringify({rescue,score,rngState,pikachuUnlocked,pikachuIsland});
   const c=document.getElementById('pikachuPortrait').getContext('2d');
   for(const pose of ['idle','garden','hello','power'])for(let i=0;i<8;i++)paintPikachu(c,330,236,2,now+i*400,pose);
   drawPikachuWorld(now,snake);check(snapshot===JSON.stringify({rescue,score,rngState,pikachuUnlocked,pikachuIsland}),'rendering is pure');
   for(const language of ['id','en']){setLang(language);for(const key of Object.keys(I18N.id).filter(k=>k.startsWith('pika.')||k.startsWith('partner.pikachu')))check(I18N[language][key],'translation '+language+key);}
   const timings=[];for(let i=0;i<60;i++){const at=performance.now();drawPikachuPortrait(now+i*33);timings.push(performance.now()-at);}timings.sort((a,b)=>a-b);
   setLang('id');return {p95:timings[57],writable:pikachuWritable};
 },
 showcase:()=>{pikaArena();pikachuUnlocked=true;haven=[1,1,1];renderHaven();document.getElementById('gardenDialog').showModal();},
 island:()=>{pikaArena();pikachuUnlocked=false;region=1;syncBiome();biomeFrom=biomeIndex;pikachuIsland={x:10,y:8};airLockCharge=100;pauseGame();document.getElementById('pauseOverlay').classList.add('hidden');updateRescueHud(pausedAt);draw();},
 portrait:(time,pose)=>{const c=document.getElementById('pikachuPortrait').getContext('2d');c.clearRect(0,0,720,400);paintPikachu(c,320,260,2.6,time,pose);},
 persist:()=>{pikaArena();pikachuUnlocked=false;region=1;pikachuIsland={x:7,y:10};airLockCharge=100;activateAirLock();document.getElementById('pikachuEquip').click();},
 status:()=>({pikachuUnlocked,selectedPartner,runPartner,state}),setLang,
 };
`;
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const context=await b.newContext({viewport:{width:1100,height:1000}}),errors=[];
 const original=fs.readFileSync(__dirname+'/index.html','utf8');
 const source=original.replace('  // ---------- Jalan ----------',hooks+'\n  // ---------- Jalan ----------');
 await context.route('**/*',r=>r.request().url()==='http://pika.test/'?r.fulfill({contentType:'text/html',body:source.replaceAll('requestAnimationFrame(loop);','/* test clock */')}):r.abort());
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto('http://pika.test/');
 console.log('Pikachu:',await page.evaluate(()=>pikaTest.run()));
 await page.evaluate(()=>pikaTest.persist());await page.reload();assert.equal((await page.evaluate(()=>pikaTest.status())).pikachuUnlocked,true);assert.equal((await page.evaluate(()=>pikaTest.status())).selectedPartner,'pikachu');
 const out=process.env.STORM_TEST_OUTPUT;if(out)fs.mkdirSync(out,{recursive:true});
 await page.evaluate(()=>pikaTest.island());if(out)await page.screenshot({path:out+'/pikachu-island.png',fullPage:true});
 for(const width of [320,390,1100]){
   await page.setViewportSize({width,height:900});await page.evaluate(()=>pikaTest.showcase());
   assert.ok(await page.locator('#gardenDialog').evaluate(d=>d.scrollWidth<=d.clientWidth));
   await page.locator('#pikachuGreet').scrollIntoViewIfNeeded();await page.click('#pikachuGreet');
   if(out)await page.screenshot({path:out+'/pikachu-garden-'+width+'.png',fullPage:true});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 if(out){await page.evaluate(()=>pikaTest.portrait(300,'power'));await page.locator('#pikachuPortrait').screenshot({path:out+'/pikachu-art.png'});}
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>pikaTest.portrait(300,'power'));
 await page.evaluate(()=>pikaTest.setLang('en'));assert.ok((await page.locator('#pikachuStatus').innerText()).includes('Rescued'));
 const blocked=await context.newPage();blocked.on('pageerror',e=>errors.push(e.message));await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));await blocked.goto('http://pika.test/');assert.equal((await blocked.evaluate(()=>pikaTest.run())).writable,false);
 const live=await context.newPage();live.on('pageerror',e=>errors.push(e.message));await live.route('http://pika.test/',r=>r.fulfill({contentType:'text/html',body:source}));await live.goto('http://pika.test/');await live.evaluate(()=>pikaTest.showcase());
 const first=await live.locator('#pikachuPortrait').evaluate(c=>c.toDataURL());await live.waitForTimeout(150);const second=await live.locator('#pikachuPortrait').evaluate(c=>c.toDataURL());assert.notEqual(first,second,'portrait animates in real frame loop');
 assert.deepEqual(errors,[]);console.log('PASS: island placement, proximity/Air Lock unlock, persistence/equip, single protection per mission, boss shelter, pause/reset, mode isolation, pure art, live animation, ID/EN, 320/390px and blocked storage.');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
