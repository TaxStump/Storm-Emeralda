// Network-isolated evolution, decoration and Pikachu rider integration checks.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const hooks=`
 const check=(v,m)=>{if(!v)throw Error(m);};
 window.growthTest={
  run:()=>{
   haven=[1,1,1];gardenCare.pets.forEach(p=>p.bond=0);
   gardenGrowth={evolved:[false,false,false],forms:[true,true,true],decorations:[]};renderHaven();
   const unchanged=JSON.stringify(gardenGrowth);gardenAction(0,'evolve');check(JSON.stringify(gardenGrowth)===unchanged,'evolution locked below both milestones');
   haven[0]=3;gardenCare.pets[0].bond=24;gardenAction(0,'evolve');check(!gardenGrowth.evolved[0],'25 hearts required');
   haven[0]=2;gardenCare.pets[0].bond=25;gardenAction(0,'evolve');check(!gardenGrowth.evolved[0],'three rescues required');
   for(let i=0;i<3;i++) {
     haven[i]=3;gardenCare.pets[i].bond=25;
     const before=JSON.stringify({haven,gardenCare,score,rngState});gardenAction(i,'evolve');
     check(gardenGrowth.evolved[i]&&gardenForm(i),'evolves '+i);
     check(before===JSON.stringify({haven,gardenCare,score,rngState}),'evolution does not spend resources '+i);
     check(gardenName(i)===GARDEN_EVOLUTIONS[i],'correct species '+i);
     const reaction=gardenReaction;gardenAction(i,'evolve');check(gardenReaction===reaction,'cannot evolve twice');
     gardenAction(i,'form');check(!gardenForm(i)&&gardenGrowth.evolved[i],'original appearance remains available');
     gardenAction(i,'form');check(gardenForm(i),'evolved appearance restored');
   }
   selectedPartner='swablu';start('adventure');pauseGame();check(partner.gardenForm,'run captures evolved partner');
   gardenAction(2,'form');check(partner.gardenForm&&!gardenForm(2),'form choice waits for next run');
   start('adventure');pauseGame();check(!partner.gardenForm,'next run uses chosen original form');
   gardenAction(2,'form');
   for(const mode of ['adventure','daily','rush','training']){
     start(mode);pauseGame();check(mode==='training'?runPartner==='none':partner.gardenForm,'mode partner '+mode);
   }
   haven=[0,0,0];renderHaven();
   for(const d of GARDEN_DECOR){document.querySelector('[data-decor='+d.id+']').click();check(!decorActive(d.id),'locked decor '+d.id);}
   for(const d of GARDEN_DECOR){haven=[d.need,0,0];renderHaven();document.querySelector('[data-decor='+d.id+']').click();check(decorActive(d.id),'unlock at exact threshold '+d.id);}
   haven=[3,3,3];renderHaven();check(GARDEN_DECOR.every(d=>decorActive(d.id)),'decorations coexist');
   document.querySelector('[data-decor=pond]').click();check(!decorActive('pond')&&decorActive('flowers'),'remove one preserves others');document.querySelector('[data-decor=pond]').click();
   const snapshot=JSON.stringify({haven,gardenCare,gardenGrowth,score,rngState,rescue,partner});
   const art=document.createElement('canvas');art.width=200;art.height=200;const c=art.getContext('2d');
   for(let i=0;i<3;i++) {
     c.clearRect(0,0,200,200);paintGardenPokemon(c,i,100,100,false,0);const original=art.toDataURL();
     c.clearRect(0,0,200,200);paintGardenPokemon(c,i,100,100,true,0);check(art.toDataURL()!==original,'distinct evolved art '+i);
   }
   for(let i=0;i<10;i++)drawGardenResidents(i*300);
   check(snapshot===JSON.stringify({haven,gardenCare,gardenGrowth,score,rngState,rescue,partner}),'rendering is pure');
   pikachuFlash=null;const body=[{x:10,y:10},{x:9.4,y:10},{x:8,y:10}];
   const seat=pikachuRidePosition(1000,body);check(Math.abs(seat.x-(9.4+.5)*CELL)<.001,'rider follows interpolated neck');
   check(pikachuRidePosition(1000,[{x:10,y:10}]).x===(10.5)*CELL,'short snake safe');
   pikachuFlash={x:4,y:12,until:1850};const jump=pikachuRidePosition(1425,body);check(jump.x<seat.x,'guardian jumps toward attacker');
   const returned=pikachuRidePosition(1850,body);check(returned.x===seat.x&&returned.y===seat.y,'rider returns after protection');
   for(const language of ['id','en']){setLang(language);for(const k of Object.keys(I18N.id).filter(k=>k.startsWith('growth.')))check(I18N[language][k],'translation '+language+k);}
   setLang('id');reset();check(!gardenReaction&&!pikachuFlash,'reset clears visual effects');check(gardenGrowth.evolved.every(Boolean)&&gardenGrowth.decorations.length===3,'reset preserves progress');
   saveGardenGrowth();return {saved:growthWritable};
  },
  prepare:()=>{
   haven=[3,3,3];gardenCare.pets.forEach(p=>p.bond=25);gardenGrowth={evolved:[false,false,false],forms:[true,true,true],decorations:[]};
   localStorage.setItem(HAVEN_KEY,JSON.stringify(haven));saveGardenCare();saveGardenGrowth();
   pauseGame();renderHaven();document.getElementById('gardenDialog').showModal();
  },
  status:()=>({haven,gardenCare,gardenGrowth,growthWritable}),
  show:()=>{renderHaven();document.getElementById('gardenDialog').showModal();},
  rider:(jump=false)=>{document.getElementById('gardenDialog').close();pikachuUnlocked=true;selectedPartner='pikachu';start('adventure');rocks=[];wilds=[];meteors=[];terrain=[];natureOrbs=[];portals=[];food=null;snake=[{x:11,y:10},{x:10,y:10},{x:9,y:10},{x:8,y:10},{x:7,y:10}];pauseGame();document.getElementById('pauseOverlay').classList.add('hidden');if(jump)pikachuFlash={x:6,y:12,until:pausedAt+425};draw();},
  reduced:()=>{pikachuFlash={x:2,y:2,until:2000};const a=pikachuRidePosition(1300,[{x:10,y:10},{x:9,y:10}]);pikachuFlash=null;const b=pikachuRidePosition(1300,[{x:10,y:10},{x:9,y:10}]);return JSON.stringify(a)===JSON.stringify(b);},
  setLang
 };
`;
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const context=await browser.newContext({viewport:{width:1100,height:950}}),errors=[];
 const original=fs.readFileSync(__dirname+'/index.html','utf8'),source=original.replace('  // ---------- Jalan ----------',hooks+'\n  // ---------- Jalan ----------');
 await context.route('**/*',r=>r.request().url()==='http://growth.test/'?r.fulfill({contentType:'text/html',body:source.replaceAll('requestAnimationFrame(loop);','/* test clock */')}):r.abort());
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto('http://growth.test/');assert.deepEqual(errors,[]);
 console.log('Mechanics:',await page.evaluate(()=>growthTest.run()));await page.evaluate(()=>growthTest.prepare());
 for(let i=0;i<3;i++){
  const b=page.locator('[data-care=evolve][data-pet="'+i+'"]');await b.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-care=form][data-pet="'+i+'"]').evaluate(b=>b===document.activeElement),true,'evolution preserves focus');
 }
 for(const id of ['pond','flowers','perch'])await page.locator('[data-decor='+id+']').click();
 const persisted=await page.evaluate(()=>growthTest.status());await page.reload();assert.deepEqual((await page.evaluate(()=>growthTest.status())).gardenGrowth,persisted.gardenGrowth);assert.deepEqual((await page.evaluate(()=>growthTest.status())).gardenCare,persisted.gardenCare);
 await page.evaluate(()=>growthTest.show());const out=process.env.STORM_TEST_OUTPUT;if(out)fs.mkdirSync(out,{recursive:true});
 for(const width of [320,390,1100]){
  await page.setViewportSize({width,height:950});
  for(const lang of ['id','en']){await page.evaluate(l=>growthTest.setLang(l),lang);assert.ok(await page.locator('#gardenDialog').evaluate(d=>d.scrollWidth<=d.clientWidth));}
  await page.evaluate(()=>growthTest.setLang('id'));await page.locator('#gardenDialog').evaluate(d=>d.scrollTop=0);
  if(out)await page.screenshot({path:out+'/growth-'+width+'.png'});
 }
 if(out){await page.locator('#gardenArt').screenshot({path:out+'/evolved-garden.png'});await page.locator('#gardenDecor').screenshot({path:out+'/garden-decorations.png'});}
 await page.evaluate(()=>growthTest.rider());if(out)await page.locator('#game').screenshot({path:out+'/pikachu-riding.png'});
 await page.evaluate(()=>growthTest.rider(true));if(out)await page.locator('#game').screenshot({path:out+'/pikachu-leap.png'});
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>growthTest.reduced()),true);
 const legacy=await context.newPage();legacy.on('pageerror',e=>errors.push(e.message));await legacy.addInitScript(()=>localStorage.removeItem('storm-emeralda-garden-growth-v1'));await legacy.goto('http://growth.test/');assert.deepEqual((await legacy.evaluate(()=>growthTest.status())).gardenGrowth.evolved,[false,false,false]);await legacy.close();
 const corrupt=await context.newPage();corrupt.on('pageerror',e=>errors.push(e.message));await corrupt.addInitScript(()=>{localStorage.setItem('storm-emeralda-haven-v1','[1,0,0]');localStorage.setItem('storm-emeralda-garden-growth-v1',JSON.stringify({evolved:[true,true,'yes'],forms:[false,0],decorations:['pond','pond','unknown']}));});await corrupt.goto('http://growth.test/');assert.deepEqual((await corrupt.evaluate(()=>growthTest.status())).gardenGrowth,{evolved:[true,false,false],forms:[false,true,true],decorations:[]});await corrupt.close();
 const blocked=await context.newPage();blocked.on('pageerror',e=>errors.push(e.message));await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}}));await blocked.goto('http://growth.test/');assert.equal((await blocked.evaluate(()=>growthTest.run())).saved,false);await blocked.close();
 const live=await context.newPage();live.on('pageerror',e=>errors.push(e.message));await live.route('http://growth.test/',r=>r.fulfill({contentType:'text/html',body:source}));await live.goto('http://growth.test/');await live.evaluate(()=>growthTest.prepare());await live.locator('[data-care=evolve][data-pet="2"]').click();
 const a=await live.locator('[data-care-portrait="2"]').evaluate(c=>c.toDataURL());await live.waitForTimeout(160);assert.notEqual(await live.locator('[data-care-portrait="2"]').evaluate(c=>c.toDataURL()),a,'live evolution response');
 await live.emulateMedia({reducedMotion:'reduce'});await live.waitForTimeout(80);const still=await live.locator('#gardenArt').evaluate(c=>c.toDataURL());await live.waitForTimeout(120);assert.ok((await live.locator('#gardenArt').evaluate(c=>c.toDataURL()))===still,'reduced-motion evolution is still');
 assert.deepEqual(errors,[]);console.log('PASS: thresholds, three evolutions, reversible form choice, run snapshots, decorations/unlock/toggle, reload/migration/corrupt/blocked storage, pure and distinct art, rider/jump/return, keyboard focus, ID/EN, 320/390px, live animation and reduced motion.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
