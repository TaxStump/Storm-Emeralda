// Local Legends regression: never sends requests or scores to production.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.env.STORM_TEST_OUTPUT||__dirname;
const source=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const hooks=`
  function arena(path='tempest',helper='guide') {
    selectedPath=path;selectedPartner=helper;cinematicsEnabled=false;start('adventure');
    snake=[{x:5,y:10},{x:4,y:10},{x:3,y:10}];dir=DIRS.right;nextDir=dir;
    rocks=[];wilds=[];portals=[];meteors=[];terrain=[];natureOrbs=[];food=null;boss=null;bossAttacks=[];pendingScene=null;snakeShiny=false;
  }
  function enemy(type='groudon') {const now=performance.now();boss={...BOSS_TYPES.find(b=>b.skill===type),x:14,y:7,hp:30,maxHp:30,phase:1,phaseUntil:0,nextAttack:now,recoveryAt:0,attackCycle:0};bossCount=1;return now;}
  window.legends={arena,enemy,draw,loop,start,reset,setLang,pauseGame,resumeGame,returnToMenu,
    get:()=>({state,boss,runPath,runPartner,habits,partner,bossNotice,pendingScene,evolved,shield,chainFlash,runItems,score,runStartedAt,head:snake[0],rngState}),
    habits:()=>{arena();habits.moves=Array.from({length:12},(_,i)=>({x:i,y:1,dx:1,dy:0}));const edge=readHabits();habits.moves=Array.from({length:12},(_,i)=>({x:4+i%9,y:8,dx:1,dy:0}));const straight=readHabits();habits.shots=[DIRS.right,DIRS.right,DIRS.right];const beam=readHabits();habits.shots=[];habits.moves=Array.from({length:12},(_,i)=>({x:5+i%3,y:8,dx:i%2,dy:1-i%2}));return {edge,straight,beam,weave:readHabits()};},
    adaptation:()=>{arena();enemy();boss.tactic='observe';const basic=createGroudonAttack(performance.now(),0);boss.tactic='straight';const lead=createGroudonAttack(performance.now(),0);boss.tactic='edge';const edge=createGroudonAttack(performance.now(),0);return {basic:basic.cells,lead:lead.cells,edge:edge.cells};},
    fairness:()=>{const results=[];for(const type of ['groudon','kyogre','deoxys'])for(const phase of [1,2])for(const xy of [[1,1],[18,18],[10,10]]){arena();snake=[{x:xy[0],y:xy[1]}];dir=xy[0]===18?DIRS.left:DIRS.right;nextDir=dir;const now=enemy(type);boss.phase=phase;bossAttack(now);const attack=bossAttacks[0];results.push({type,phase,warning:attack?attack.activeAt-now:0,escape:attack?.escape?.length||0,deferred:!attack&&boss.nextAttack>now,cellBounds:!attack||bossAttackCells(attack,attack.activeAt).every(c=>c.x>=0&&c.y>=0&&c.x<20&&c.y<20)});}arena();const now=enemy();rocks=[{x:6,y:10},{x:5,y:9},{x:5,y:11}];bossAttack(now);return {results,trapped:bossAttacks.length===0};},
    bounded:()=>{arena();for(let i=0;i<200;i++)rememberMove();for(let i=0;i<40;i++){beamCooldown=0;fireBeam();}return {moves:habits.moves.length,shots:habits.shots.length};},
    tempest:()=>{arena('tempest');const normal=speedMs();doEvolve();upgrades.combo=2;wilds=[{type:'diglett',x:8,y:10},{type:'geodude',x:8,y:13},{type:'golem',x:10,y:14},{type:'diglett',x:18,y:18}];fireBeam();return {normal,fast:speedMs(),left:wilds,links:chainFlash?.links.length,palette:playerPalette().mid};},
    prism:()=>{arena('prism');doEvolve();upgrades.beam=2;enemy();boss.x=19;boss.y=6;fireBeam();return {rays:beam.rays,cells:beam.cells,hp:boss.hp,palette:playerPalette().mid};},
    ancient:()=>{arena('ancient');doEvolve();const granted=shield;doEvolve();const refresh=shield;const now=enemy();bossAttacks=[{type:'blades',cells:[{x:6,y:10}],activeAt:now-1,until:now+4000,blocked:[]}];tick();return {granted,refresh,shield,grace:shieldGraceUntil-now,hp:boss.hp,reflection,head:snake[0],palette:playerPalette().mid};},
    dormant:()=>{arena('prism');fireBeam();return {rays:beam.rays.length,palette:playerPalette().mid};},
    expiry:()=>{arena('ancient');doEvolve();evolveUntil=1;lastTick=performance.now();loop(performance.now());return pathActive('ancient');},
    guide:()=>{arena();rocks=[{x:6,y:10}];food={x:5,y:6,type:FOODS[0]};updatePartner(performance.now());return partner.route;},
    collector:(blocked=false,special=false)=>{arena('tempest','collector');partner.nextCollect=0;food={x:7,y:10,type:FOODS.find(f=>f.kind===(special?'meteorite':'oran')),shiny:false};if(special&&!food.type)food.type=FOODS.find(f=>f.effect==='evolve');if(blocked)rocks=[{x:6,y:10},{x:5,y:9},{x:5,y:11}];const len=snake.length;updatePartner(performance.now());return {items:runItems,len,after:snake.length,score,next:partner.nextCollect,foodKind:food?.type.kind};},
    bond:()=>{arena();runItems=16;updatePartner(performance.now());return {bond:partner.bond,route:partner.route.length};},
    scene:(type='groudon',kind='arrival')=>{arena();const now=enemy(type);cinematicsEnabled=true;queueCinematic(kind,type);const before={next:boss.nextAttack,runStartedAt};openCinematic();return before;},
    sceneElapsed:()=>{bossNotice.until=performance.now()-1;boss.nextAttack=performance.now()+10000;loop(performance.now());return {state,bossNotice};},
    disabled:()=>{arena();cinematicsEnabled=false;queueCinematic('arrival','groudon');return pendingScene;},
    pauseTimers:()=>{arena();partner.nextCollect=performance.now()+8000;partner.flashUntil=performance.now()+900;chainFlash={links:[],until:performance.now()+350};const before=[partner.nextCollect,partner.flashUntil,chainFlash.until];pauseGame();pausedAt-=1000;resumeGame();return {before,after:[partner.nextCollect,partner.flashUntil,chainFlash.until]};},
    renderInvariant:()=>{arena('prism');runMode='daily';doEvolve();updatePartner(performance.now());const before=JSON.stringify({snake,score,boss,habits,partner,rngState});for(let i=0;i<30;i++){drawLegendEffects(performance.now()+i*30,snake[0]);draw();}return before===JSON.stringify({snake,score,boss,habits,partner,rngState});},
    performance:()=>{arena();enemy('kyogre');doEvolve();const values=[];for(let i=0;i<90;i++){const begin=performance.now();updatePartner(begin);draw();values.push(performance.now()-begin);}values.sort((a,b)=>a-b);return {median:values[45],p95:values[85]};},
    resetCheck:()=>{arena();habits.moves.push({x:1});chainFlash={until:999999};partner.bond=40;pendingScene={kind:'arrival',type:'groudon'};reset();return {moves:habits.moves.length,chainFlash,bond:partner.bond,pendingScene,bossNotice};},
    preview:path=>{arena(path);doEvolve();runItems=16;snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10},{x:7,y:10},{x:6,y:10},{x:6,y:11},{x:6,y:12}];enemy();boss.phase=2;updatePartner(performance.now());pauseGame();pauseOverlay.classList.add('hidden');draw();}
  };
`;
const html=source.replace('  // ---------- Jalan ----------',hooks+'\n  // ---------- Jalan ----------').replaceAll('requestAnimationFrame(loop);','/* test clock */');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1100,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url()==='http://storm.test/'?r.fulfill({contentType:'text/html',body:html}):r.abort());await page.goto('http://storm.test/');
  assert.deepEqual(await page.evaluate(()=>legends.habits()),{edge:'edge',straight:'straight',beam:'beam',weave:'weave'});
  const adapt=await page.evaluate(()=>legends.adaptation());assert.notDeepEqual(adapt.basic,adapt.lead);assert.notDeepEqual(adapt.basic,adapt.edge);
  const fairness=await page.evaluate(()=>legends.fairness());assert.ok(fairness.trapped);assert.ok(fairness.results.every(r=>r.cellBounds&&(r.deferred||r.escape>0&&r.warning>=1250)));
  assert.deepEqual(await page.evaluate(()=>legends.bounded()),{moves:32,shots:8});
  const tempest=await page.evaluate(()=>legends.tempest());assert.ok(tempest.fast<tempest.normal);assert.equal(tempest.links,2);assert.equal(tempest.left.length,1);
  const prism=await page.evaluate(()=>legends.prism());assert.ok(prism.rays.length>=6);assert.equal(prism.hp,27);assert.ok(prism.cells.every(c=>c.x>=0&&c.x<20&&c.y>=0&&c.y<20));
  const ancient=await page.evaluate(()=>legends.ancient());assert.equal(ancient.granted,1);assert.equal(ancient.refresh,1);assert.equal(ancient.shield,0);assert.ok(ancient.grace>=850);assert.equal(ancient.hp,28);assert.ok(ancient.reflection);assert.deepEqual(ancient.head,{x:5,y:10});
  assert.equal(new Set([tempest.palette,prism.palette,ancient.palette]).size,3);assert.equal((await page.evaluate(()=>legends.dormant())).rays,1);assert.equal(await page.evaluate(()=>legends.expiry()),false);
  const guide=await page.evaluate(()=>legends.guide());assert.ok(guide.length);assert.ok(!guide.some(p=>p.x===6&&p.y===10));
  const collector=await page.evaluate(()=>legends.collector());assert.equal(collector.items,1);assert.equal(collector.len,collector.after);assert.ok(collector.score>0&&collector.next>0);
  assert.equal((await page.evaluate(()=>legends.collector(true))).items,0);assert.equal((await page.evaluate(()=>legends.collector(false,true))).items,0);
  assert.equal((await page.evaluate(()=>legends.bond())).bond,16);
  await page.evaluate(()=>legends.scene());assert.equal((await page.evaluate(()=>legends.get())).state,'playing');assert.ok((await page.evaluate(()=>legends.get())).bossNotice);
  assert.equal(await page.locator('dialog[open]').count(),0);
  const after=await page.evaluate(()=>legends.sceneElapsed());assert.equal(after.state,'playing');assert.equal(after.bossNotice,null);
  await page.evaluate(()=>legends.scene('kyogre','awakening'));assert.equal((await page.evaluate(()=>legends.get())).bossNotice.kind,'awakening');
  await page.evaluate(()=>legends.scene('deoxys'));await page.keyboard.press('Escape');assert.equal((await page.evaluate(()=>legends.get())).state,'paused');await page.evaluate(()=>legends.resumeGame());
  assert.equal(await page.evaluate(()=>legends.disabled()),null);
  const timers=await page.evaluate(()=>legends.pauseTimers());assert.ok(timers.after.every((v,i)=>v-timers.before[i]>=1000));
  assert.equal(await page.evaluate(()=>legends.renderInvariant()),true);
  assert.deepEqual(await page.evaluate(()=>legends.resetCheck()),{moves:0,chainFlash:null,bond:0,pendingScene:null,bossNotice:null});
  console.log('Legends performance:',await page.evaluate(()=>legends.performance()));
  for(const p of ['tempest','prism','ancient']){await page.evaluate(p=>legends.preview(p),p);await page.locator('#game').screenshot({path:path.join(out,'legends-'+p+'.png')});}
  await page.evaluate(()=>{legends.returnToMenu();legends.setLang('en');});await page.locator('.legend-setup summary').click();await page.locator('[data-path="ancient"]').click();await page.locator('[data-partner="collector"]').click();assert.ok((await page.locator('#pathDescription').textContent()).includes('Shield'));await page.locator('#cinematicsSetting').uncheck();
  for(const width of [320,390]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(out,'legends-menu-'+width+'.png'),fullPage:true});}
  await page.locator('#startBtn').click();let state=await page.evaluate(()=>legends.get());assert.equal(state.runPath,'ancient');assert.equal(state.runPartner,'collector');
  await page.evaluate(()=>{legends.scene('kyogre');});
  assert.equal((await page.evaluate(()=>legends.get())).state,'playing');
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>{legends.scene('deoxys');legends.draw();});
  await page.reload();assert.equal(await page.locator('[data-path="ancient"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('[data-partner="collector"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#cinematicsSetting').isChecked(),false);
  // Exercise the real frame loop as well as deterministic simulation hooks.
  const live=await browser.newPage({viewport:{width:1000,height:900}});live.on('pageerror',e=>errors.push(e.message));await live.route('**/*',r=>r.abort());await live.setContent(source.replace('  // ---------- Jalan ----------',hooks+'\n  // ---------- Jalan ----------'));
  await live.evaluate(()=>legends.scene('kyogre'));await live.waitForFunction(()=>!!legends.get().bossNotice,{},{timeout:8000});assert.equal((await live.evaluate(()=>legends.get())).state,'playing');await live.evaluate(()=>legends.pauseGame());await live.close();
  assert.deepEqual(errors,[]);console.log('PASS: adaptive habits/escape checks, all Mega paths, helper routing/collection/bond, non-blocking boss notices/manual pause/real-loop, reset/expiry, render invariants, persisted preferences, ID/EN and mobile. No browser errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
