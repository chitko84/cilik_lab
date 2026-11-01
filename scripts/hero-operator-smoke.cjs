/* Run with Node; TypeScript is a development dependency already required by the project. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = function(module, filename) {
  const output = ts.transpileModule(fs.readFileSync(filename,'utf8'), {
    fileName: filename,compilerOptions: { module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true }
  }).outputText;
  module._compile(output, filename);
};
const base = path.join(__dirname, '..','src');
const {HERO_DAILY_PROBLEMS} = require(path.join(base,'pages/daily/dailyHeroBank.ts'));
const {HERO_REFERENCE_SOLUTIONS} = require(path.join(base,'pages/daily/dailyHeroReferences.ts'));
const {DAILY_PROBLEMS} = require(path.join(base,'pages/daily/dailyBank.ts'));
const {runDailyTeachingCode} = require(path.join(base,'pages/daily/dailyLanguages.ts'));
const {runHeroDailyPython} = require(path.join(base,'pages/daily/dailyHeroRunner.ts'));
const {createOperatorHistory} = require(path.join(base,'pages/operator/operatorActivityHistory.ts'));
const counts={Starter:0,Explorer:0,Challenger:0};
assert.equal(DAILY_PROBLEMS.length,300);
assert.equal(new Set(DAILY_PROBLEMS.map(q=>q.id)).size,300);
assert.equal(HERO_DAILY_PROBLEMS.length,150);
assert.equal(new Set(HERO_DAILY_PROBLEMS.map(p=>p.world)).size,10);
let successes=0;
const errors=[];
for(const q of HERO_DAILY_PROBLEMS){
  counts[q.difficulty]++;
  assert.ok(q.story && q.instructions && q.hint && q.starter && q.expected && q.solution);
  assert.ok(q.id >= 'daily-151' && q.id <= 'daily-300');
  const programs={python:q.solution,...HERO_REFERENCE_SOLUTIONS[q.id]};
  for(const [language,source] of Object.entries(programs)){
    const result=language==='python'?runHeroDailyPython(source):runDailyTeachingCode(source,language);
    if(!result.success||result.stdout.trimEnd()!==q.expected.trimEnd()){
      errors.push({id:q.id,language,expected:q.expected,actual:result.stdout,error:result.error,solution:source});
    }else successes++;
  }
}
assert.deepEqual(counts,{Starter:55,Explorer:40,Challenger:55});
assert.deepEqual(Object.fromEntries(['Starter','Explorer','Challenger'].map(level=>[level,DAILY_PROBLEMS.filter(q=>q.difficulty===level).length])),{Starter:100,Explorer:100,Challenger:100});
const logs=createOperatorHistory();
assert.equal(logs.length,100);
assert.equal(new Set(logs.map(row=>row.id)).size,100);
assert.ok(new Set(logs.map(row=>row.category)).size===7);
if(errors.length){console.error('Failed programs',errors.length,JSON.stringify(errors.slice(0,12),null,2));process.exitCode=1;}
else console.log('PASS: 300 challenges, 100/100/100 difficulty split, 10 hero worlds, 100 activity entries, 450/450 beginner reference solutions');
