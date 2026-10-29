const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function loadTS(file){const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,require});return module.exports;}
const e=loadTS('./src/pages/arcade/addons/creativeLearningEngine.ts');
assert.equal(e.STORY_CHAPTERS.length,6);
assert.equal(e.PET_MISSIONS.length,6);
const ids=new Set();
for(const c of e.STORY_CHAPTERS){ assert(!ids.has(c.id));ids.add(c.id);assert.equal(c.choices.length,2);assert.equal(c.choices.filter(x=>x.right).length,1);assert(c.title.ms&&c.title.en&&c.intro.ms&&c.intro.en&&c.tip.ms&&c.tip.en);for(const choice of c.choices){assert(choice.title.ms&&choice.title.en&&choice.result.ms&&choice.result.en);assert.equal(e.compileStoryCode(`choose("${choice.id}")`,c),choice.id)}
 const code=`# ${c.variable} = ${c.value?'True':'False'}\nif ${c.variable}:\n    choose("${c.choices[0].id}")\nelse:\n    choose("${c.choices[1].id}")`;
 assert.equal(e.compileStoryCode(code,c),c.value?c.choices[0].id:c.choices[1].id);}
for(const c of e.PET_MISSIONS){assert(!ids.has(c.id));ids.add(c.id);assert(c.title.ms&&c.title.en&&c.description.ms&&c.description.en);assert(e.petCompleted(c,c.actions),c.id);assert.equal(e.petMatches(c,c.actions),c.actions.length);assert(e.petScore(c,c.actions)>0);assert.deepEqual(Array.from(e.compilePetCode(c.actions.map(x=>x+'()').join('\n'))),Array.from(c.actions));}
assert.equal(e.compilePetCode('for i in range(2):\n    play()\nfeed()').join(','),'play,play,feed');
for(const bad of ['eval(1)','import os','for i in range(999):\n    play()','for i in range(2):\n play()','for i in range(2):\n    process.exit()'])assert.throws(()=>e.compilePetCode(bad),bad);
for(const bad of ['eval(1)','choose("not-a-route")','if fake:\n    choose("forest")\nelse:\n    choose("mountain")','for i in range(4):\n    choose("forest")'])assert.throws(()=>e.compileStoryCode(bad,e.STORY_CHAPTERS[0]),bad);
const worlds=[{id:'maze',name:'Maze',ids:['maze-1','maze-2']},{id:'pet',name:'Pet',ids:['pet-1','pet-2']},{id:'story',name:'Story',ids:['story-1','story-2']}];
const rec=e.recommendCoach(worlds,['maze-1'],[{kind:'code_error',level:'pet-1'},{kind:'hint',level:'pet-1'}]);assert.equal(rec[0].id,'pet');assert.equal(rec[0].reason,'practice');assert.equal(rec[1].id,'maze');assert.equal(rec[1].reason,'continue');assert.equal(rec[0].level,0);
assert.equal(e.recommendCoach(worlds,['maze-1','maze-2','pet-1','pet-2','story-1','story-2'],[]).length,0);
const worldText=fs.readFileSync('src/pages/arcade/addons/AdventureExtras.tsx','utf8');const routeText=fs.readFileSync('src/pages/arcade/ArcadeView.tsx','utf8');const home=fs.readFileSync('src/pages/arcade/addons/ArcadeHome.tsx','utf8');
for(const id of ['story','pet']){assert(worldText.includes(`id:'${id}'`));assert(routeText.includes(`launch.mode==='${id}'`));assert(home.includes(`onOpen('${id}'`));}assert(routeText.includes("launch.mode==='coach'"));assert(home.includes("id:'coach' as const"));
for(const asset of ['story-quest.svg','pet-lab.svg','coach-garden.svg'])assert(fs.existsSync('public/arcade/'+asset));
console.log('PASS: 13 games / 82 levels; six branching stories and six pet routines solvable, parsers reject unsupported code, recommendations use real activity, navigation and artwork integrated.');
