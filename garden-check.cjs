// Local, network-isolated integration checks for garden care and egg partners.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const hooks = `
 const check=(value,label)=>{if(!value)throw Error(label);};
 function gardenArena(id='none',mode='adventure') {
   selectedPartner=id;start(mode);rocks=[];wilds=[];portals=[];meteors=[];terrain=[];
   natureOrbs=[];boss=null;bossAttacks=[];food=null;upgradeChoices=[];skyRift=null;
   snake=[{x:5,y:10},{x:4,y:10},{x:3,y:10}];dir=DIRS.right;nextDir=dir;turnQueue=[];
 }
 const gardenBerryFixture=()=>({x:6,y:10,type:FOODS.find(f=>f.kind==='oran'),shiny:false});
 window.gardenTest={
  status:()=>({haven,gardenCare,careWritable,selectedPartner,runPartner,state,rank:partner.gardenRank}),
  run:()=>{
   haven=[0,0,0];gardenCare={berries:6,pets:[0,1,2].map(()=>({bond:0,feedAt:0,playAt:0}))};
   selectedPartner='guide';renderHaven();renderLegendMenu();
   for(const id of EGG_PARTNERS)check(document.querySelector('[data-partner='+id+']').disabled,'locked menu '+id);
   gardenAction(0,'feed');gardenAction(0,'play');gardenAction(0,'equip');
   check(gardenCare.berries===6&&gardenCare.pets[0].bond===0&&selectedPartner==='guide','locked care rejects actions');
   gardenAction(-1,'feed');gardenAction(9,'equip');gardenAction(0,'unknown');
   gardenArena();const now=performance.now();check(spawnRescue(now),'egg available');
   rescue.species=0;rescue.egg={x:6,y:10};rescue.nest={x:8,y:10};tick();tick();tick();
   check(haven[0]===1&&!document.querySelector('[data-partner=togepi]').disabled,'real rescue immediately unlocks partner');
   haven=[1,2,3];renderHaven();gardenAction(0,'feed');gardenAction(0,'play');
   check(gardenCare.berries===5&&gardenCare.pets[0].bond===3,'feed and play have independent rewards');
   const before=JSON.stringify(gardenCare);gardenAction(0,'feed');gardenAction(0,'play');
   check(JSON.stringify(gardenCare)===before,'repeated clicks cannot bypass rest');
   gardenCare.pets[0].feedAt=Date.now()-1;gardenCare.berries=0;gardenAction(0,'feed');
   check(gardenCare.pets[0].bond===3&&gardenCare.berries===0,'empty basket cannot feed');
   gardenCare.pets[0].playAt=0;gardenAction(0,'play');check(gardenCare.pets[0].bond===4,'play remains free');
   gardenCare.pets[0].bond=29;gardenCare.pets[0].feedAt=0;gardenCare.berries=2;gardenAction(0,'feed');
   check(gardenCare.pets[0].bond===30&&gardenRank(0)===3,'bond capped');
   check(gardenFeedback.gain===1,'feedback reports actual capped gain');
   for(const [bond,rank] of [[0,1],[9,1],[10,2],[24,2],[25,3],[30,3]]){gardenCare.pets[1].bond=bond;check(gardenRank(1)===rank,'rank threshold '+bond);}
   gardenArena('togepi');gardenAction(1,'equip');
   check(selectedPartner==='azurill'&&runPartner==='togepi','equip only affects next run');
   gardenCare.pets[0].bond=0;gardenArena('togepi');shield=0;
   for(let i=0;i<9;i++)eat(gardenBerryFixture());check(shield===0&&partner.berries===9,'Togepi charges for ten berries');
   eat(gardenBerryFixture());check(shield===1&&partner.berries===0,'Togepi grants one shield');
   shield=3;for(let i=0;i<12;i++)eat(gardenBerryFixture());check(shield===3&&partner.berries===10,'full shield banks one charge');
   shield=2;eat(gardenBerryFixture());check(shield===3&&partner.berries===0,'banked charge activates on next berry');
   gardenCare.pets[0].bond=25;gardenArena('togepi');shield=0;
   for(let i=0;i<8;i++)eat(gardenBerryFixture());check(shield===1,'strong bond shortens Togepi requirement');
   for(const [id,meter] of [['azurill','air'],['swablu','ascent']]) {
     const i=EGG_PARTNERS.indexOf(id);gardenCare.pets[i].bond=0;gardenArena(id);
     airLockCharge=0;ascentCharge=0;eat(gardenBerryFixture());
     check((meter==='air'?airLockCharge:ascentCharge)===(meter==='air'?9:12),'base ability '+id);
     gardenCare.pets[i].bond=30;airLockCharge=0;ascentCharge=0;eat(gardenBerryFixture());
     check(partner.gardenRank===1,'bond snapshot cannot change during run '+id);
     gardenArena(id);airLockCharge=0;ascentCharge=0;eat(gardenBerryFixture());
     check((meter==='air'?airLockCharge:ascentCharge)===(meter==='air'?11:14),'high bond ability '+id);
     airLockCharge=99;ascentCharge=99;eat(gardenBerryFixture());check(airLockCharge===100&&ascentCharge===100,'meters capped '+id);
   }
   gardenArena('azurill');gardenCare.berries=0;food=gardenBerryFixture();const length=snake.length;tick();
   check(gardenCare.berries===1&&airLockCharge===11&&snake.length===length+1,'real movement collects berry once');
   const gift=FOODS.find(f=>!['oran','pinap','pecha'].includes(f.kind));
   const basket=gardenCare.berries;eat({x:6,y:10,type:gift,shiny:false});check(gardenCare.berries===basket,'non-berries are not garden food');
   for(const mode of ['daily','rush','training'])for(const id of EGG_PARTNERS){
     gardenArena(id,mode);gardenCare.berries=40;airLockCharge=0;ascentCharge=0;shield=0;
     eat(gardenBerryFixture());check(gardenCare.berries===40&&airLockCharge===5&&ascentCharge===8&&shield===0,'mode isolation '+mode+' '+id);
     if(mode==='training')check(runPartner==='none','training has no partner');
   }
   gardenArena('azurill');food=gardenBerryFixture();partner.nextCollect=0;const f=food;updatePartner(performance.now());check(food===f,'egg partners never collect Pip berries');
   gardenCare.berries=99;eat(gardenBerryFixture());check(gardenCare.berries===99,'basket cap');
   partner.flashUntil=performance.now()+900;pauseGame();const flash=partner.flashUntil;pausedAt-=3000;resumeGame();check(partner.flashUntil>=flash+3000,'ability flash pause');
   reset();check(partner.berries===0&&partner.flashUntil===0&&!gardenReaction,'reset clears temporary state');
   const snapshot=JSON.stringify({gardenCare,haven,score,rngState,partner});renderHaven();
   for(let i=0;i<8;i++){drawGardenResidents(i*100);drawLegendEffects(i*100,snake[0]);}
   check(snapshot===JSON.stringify({gardenCare,haven,score,rngState,partner}),'drawing does not change gameplay or care');
   for(const language of ['id','en']){setLang(language);for(const k of Object.keys(I18N.id).filter(k=>k.startsWith('care.')||/^partner.(togepi|azurill|swablu)/.test(k)))check(I18N[language][k],'translation '+language+' '+k);}
   setLang('id');return {passed:true,writable:careWritable};
  },
  prepare:()=>{
   haven=[1,2,3];localStorage.setItem(HAVEN_KEY,JSON.stringify(haven));
   gardenCare={berries:6,pets:[0,1,2].map(()=>({bond:0,feedAt:0,playAt:0}))};saveGardenCare();
   gardenArena('none');pauseGame();renderHaven();document.getElementById('gardenDialog').showModal();
  },
  open:()=>{pauseGame();renderHaven();document.getElementById('gardenDialog').showModal();},
  advanceRest:()=>{gardenCare.pets.forEach(p=>{p.feedAt=0;p.playAt=0;});updateGardenControls();},
  snapshot:()=>JSON.stringify({gardenCare,haven,score,rngState,snake,partner}),
  select:(id)=>{selectedPartner=id;saveLegendPreferences();},
  setLang
 };
`;
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const context=await browser.newContext({viewport:{width:1100,height:950}});
  const errors=[], original=fs.readFileSync(__dirname+'/index.html','utf8');
  const source=original.replace('  // ---------- Jalan ----------',hooks+'\n  // ---------- Jalan ----------');
  await context.route('**/*',r=>r.request().url()==='http://garden.test/'?r.fulfill({contentType:'text/html',body:source.replaceAll('requestAnimationFrame(loop);','/* test clock */')}):r.abort());
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto('http://garden.test/');
  assert.deepEqual(errors,[],'page loads without errors');
  console.log('Mechanics:',await page.evaluate(()=>gardenTest.run()));
  await page.evaluate(()=>gardenTest.prepare());
  await page.click('[data-care="feed"][data-pet="0"]');
  await page.click('[data-care="play"][data-pet="0"]');
  await page.click('[data-care="equip"][data-pet="0"]');
  assert.equal(await page.locator('[data-care="equip"][data-pet="0"]').evaluate(b=>b===document.activeElement),true,'equip preserves keyboard focus');
  let saved=await page.evaluate(()=>gardenTest.status());assert.equal(saved.selectedPartner,'togepi');assert.equal(saved.runPartner,'none');
  assert.equal(saved.gardenCare.pets[0].bond,3);assert.equal(saved.gardenCare.berries,5);
  await page.reload();saved=await page.evaluate(()=>gardenTest.status());assert.equal(saved.selectedPartner,'togepi');assert.equal(saved.gardenCare.pets[0].bond,3);assert.deepEqual(saved.haven,[1,2,3]);
  await page.evaluate(()=>gardenTest.open());await page.locator('[data-care="feed"][data-pet="0"]').dispatchEvent('click');
  assert.equal((await page.evaluate(()=>gardenTest.status())).gardenCare.berries,5,'reload preserves cooldown');
  await page.evaluate(()=>gardenTest.advanceRest());
  const play=page.locator('[data-care="play"][data-pet="1"]');await play.focus();await page.keyboard.press('Enter');
  assert.equal((await page.evaluate(()=>gardenTest.status())).gardenCare.pets[1].bond,1,'keyboard action');assert.equal(await play.evaluate(b=>b===document.activeElement),true,'focus retained after care');
  const out=process.env.STORM_TEST_OUTPUT;if(out)fs.mkdirSync(out,{recursive:true});
  for(const width of [320,390,1100]){
   await page.setViewportSize({width,height:900});
   assert.ok(await page.locator('#gardenDialog').evaluate(d=>d.scrollWidth<=d.clientWidth),'dialog fits '+width);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page fits '+width);
   for(const lang of ['id','en']){
    await page.evaluate(l=>gardenTest.setLang(l),lang);
    await page.locator('[data-care="equip"][data-pet="2"]').scrollIntoViewIfNeeded();
    assert.ok(await page.locator('#gardenDialog').evaluate(d=>d.scrollWidth<=d.clientWidth),'translated dialog fits');
   }
   await page.evaluate(()=>gardenTest.setLang('id'));
   await page.locator('#gardenDialog').evaluate(d=>d.scrollTop=0);
   if(out)await page.screenshot({path:out+'/garden-'+width+'.png'});
  }
  await page.keyboard.press('Escape');assert.equal(await page.locator('#gardenDialog').evaluate(d=>d.open),false,'Escape closes garden');
  await page.evaluate(()=>gardenTest.open());await page.locator('#gardenDialog').evaluate(d=>d.scrollTop=d.scrollHeight);
  await page.click('#gardenCloseTop');assert.equal(await page.locator('#gardenDialog').evaluate(d=>d.open),false,'top close remains reachable after scrolling');
  // Saved data validation, including old saves that have only rescue counts.
  const migrated=await context.newPage();migrated.on('pageerror',e=>errors.push(e.message));
  await migrated.addInitScript(()=>{localStorage.removeItem('storm-emeralda-garden-care-v1');localStorage.setItem('storm-emeralda-haven-v1','[2,0,1]');localStorage.setItem('storm-emeralda-legends-v1',JSON.stringify({partner:'azurill'}));});
  await migrated.goto('http://garden.test/');let status=await migrated.evaluate(()=>gardenTest.status());assert.deepEqual(status.haven,[2,0,1]);assert.equal(status.gardenCare.berries,6);assert.equal(status.selectedPartner,'guide','locked saved choice rejected');await migrated.close();
  const corrupt=await context.newPage();corrupt.on('pageerror',e=>errors.push(e.message));
  await corrupt.addInitScript(()=>localStorage.setItem('storm-emeralda-garden-care-v1',JSON.stringify({berries:-5,pets:[{bond:999,feedAt:1e16},{bond:'bad'},null]})));
  await corrupt.goto('http://garden.test/');status=await corrupt.evaluate(()=>gardenTest.status());assert.equal(status.gardenCare.berries,0);assert.equal(status.gardenCare.pets[0].bond,30);assert.equal(status.gardenCare.pets[1].bond,0);await corrupt.close();
  const blocked=await context.newPage();blocked.on('pageerror',e=>errors.push(e.message));
  await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));await blocked.goto('http://garden.test/');assert.equal((await blocked.evaluate(()=>gardenTest.run())).writable,false);await blocked.close();
  // Use the actual frame loop to verify animation and paused gameplay.
  const live=await context.newPage();live.on('pageerror',e=>errors.push(e.message));await live.route('http://garden.test/',r=>r.fulfill({contentType:'text/html',body:source}));await live.goto('http://garden.test/');await live.evaluate(()=>gardenTest.prepare());
  const before=await live.evaluate(()=>gardenTest.snapshot()),a=await live.locator('#gardenArt').evaluate(c=>c.toDataURL());
  await live.waitForTimeout(180);const b=await live.locator('#gardenArt').evaluate(c=>c.toDataURL());assert.notEqual(a,b,'live garden animation');assert.equal(await live.evaluate(()=>gardenTest.snapshot()),before,'garden pauses gameplay');
  await live.emulateMedia({reducedMotion:'reduce'});await live.waitForTimeout(60);
  const still=await live.locator('#gardenArt').evaluate(c=>c.toDataURL());await live.waitForTimeout(100);assert.equal(await live.locator('#gardenArt').evaluate(c=>c.toDataURL()),still,'reduced motion remains still');
  assert.deepEqual(errors,[]);
  console.log('PASS: real rescue/berry movement, care/actions, cooldown/reload, unlocks, bond snapshots, abilities/caps, mode isolation, pause/reset, pure rendering, migration, malformed/blocked storage, keyboard/focus, ID/EN, mobile, live animation and reduced motion.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
