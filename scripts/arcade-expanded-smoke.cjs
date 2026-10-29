const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function loadTS(file){const source=fs.readFileSync(file,'utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;const module={exports:{}};vm.runInNewContext(js,{module,exports:module.exports,require});return module.exports;}
const engine=loadTS('./src/pages/arcade/addons/spaceEngine.ts');
const levels=engine.SPACE_LEVELS;assert.equal(levels.length,8);for(let i=1;i<=6;i++)assert.equal(levels[i-1].id,'space-'+i);const ids=new Set();
for(const level of levels){assert(!ids.has(level.id));ids.add(level.id);assert(level.targets.length>0);assert(level.targets.every(n=>n>=0&&n<=6));assert(level.rocks.every(n=>!level.targets.includes(n)));
 let frame=engine.initialSpaceFrame();const all=[...level.targets].sort((a,b)=>a-b);for(let c of all){while(frame.lane<c)frame=engine.advanceSpace(level,frame,{op:'right',line:0});while(frame.lane>c)frame=engine.advanceSpace(level,frame,{op:'left',line:0});frame=engine.advanceSpace(level,frame,{op:'shoot',line:0});}
 assert.equal(frame.status,'win',level.id+' mission unwinnable');assert(engine.spaceScore(frame,level)>0);}
assert.equal(engine.compileSpaceCommands('for i in range(3):\n    move_right()\n    shoot()').length,6);
for(const text of ['alert(1)','for i in range(900):\n  shoot()','for i in range(3):\n  eval(1)','','move_up()']) assert.throws(()=>engine.compileSpaceCommands(text));
let frame=engine.initialSpaceFrame();frame=engine.advanceSpace(levels[0],frame,{op:'shoot',line:1});assert.equal(frame.status,'win');assert.equal(frame.hits.length,1);assert(engine.spaceScore(frame,levels[0])>=150);
const all=fs.readFileSync('./src/pages/arcade/ArcadeView.tsx','utf8');for(const id of ['space','world','creator','achievements','insights'])assert(all.includes(`launch.mode==='${id}'`));
console.log(`PASS: Space Invaders 8 playable missions (original six retained), safe command loops, blocked arbitrary commands, scoring, navigation integration.`);
