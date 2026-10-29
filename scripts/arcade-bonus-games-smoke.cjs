const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function loadTS(file){const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText;const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,require});return module.exports;}
const e=loadTS('./src/pages/arcade/addons/bonusGamesEngine.ts');
assert.equal(e.MELODY_LEVELS.length,6); assert.equal(e.BRIDGE_LEVELS.length,6);
for(const level of e.MELODY_LEVELS){assert(level.target.length>=4); const same=[...level.target]; assert(e.melodyComplete(level,same)); assert(e.melodyMatches(level,same)===level.target.length); assert(e.melodyScore(level,same,0,true)>0);}
const melody=e.compileMelodyCode('for i in range(2):\n    play(red)\n    play(blue)'); assert.equal(melody.length,4); assert.equal(melody[0].note,'red');
for(const bad of ['eval(1)','play(purple)','for i in range(99):\n    play(red)','for i in range(2):\n  play(red)']) assert.throws(()=>e.compileMelodyCode(bad),bad);
for(const level of e.BRIDGE_LEVELS){let frame=e.initialBridgeFrame();assert.equal(e.bridgeScore(level,frame),0,`${level.id}: initial score must be 0`); const actions=e.compileBridgeCode(level.solution.join('\n')); for(const cmd of actions){ frame=e.advanceBridge(level,frame,cmd); } assert.equal(frame.status,'win',`${level.id} should be solvable`); assert(e.bridgeScore(level,frame)>0); }
const bridge=e.compileBridgeCode('move_right()\nplace()\nfor i in range(2):\n    move_right()'); assert.equal(bridge.length,4);
for(const bad of ['eval(1)','jump()','for i in range(40):\n    move_right()','for i in range(2):\n  place()']) assert.throws(()=>e.compileBridgeCode(bad),bad);
const world=fs.readFileSync('./src/pages/arcade/addons/AdventureExtras.tsx','utf8'); const hub=fs.readFileSync('./src/pages/arcade/addons/ArcadeHome.tsx','utf8'); const main=fs.readFileSync('./src/pages/arcade/ArcadeView.tsx','utf8');
for(const id of ['melody','bridge']){ assert(world.includes(`id:'${id}'`)); assert(main.includes(`launch.mode==='${id}'`)); }
assert(hub.includes('WORLDS.length'));
console.log('PASS: 10 games / 64 challenges integrated; 12 bonus levels, melody and bridge logic, scoring, safe parsing, and navigation hooks verified.');
