const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
let ts;
try {ts=require('typescript')} catch {ts=require(path.join(execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim(),'typescript'));}
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const compile=(source,name)=>{
 const result=ts.transpileModule(source,{fileName:name,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}});
 assert.equal((result.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error).length,0,name+' must parse');
 return result.outputText;
};
const run=(src,name,req)=>{
 const exp={}; const env={exports:exp,require:req,localStorage:{getItem:()=>null,setItem:()=>{}},console};
 vm.runInNewContext(compile(src,name),env,{filename:name});
 return exp;
};
const people=run(read('src/pages/operator/operatorDemoPeople.ts'),'operatorDemoPeople.ts',()=>({}));
const history=run(read('src/pages/operator/operatorActivityHistory.ts'),'operatorActivityHistory.ts',()=>({}));
assert.equal(history.createOperatorHistory().length,100);
assert.equal(people.additionalStudents.length,27);
assert.equal(people.additionalTeachers.length,10);
assert.equal(new Set(people.additionalStudents.map(x=>x.id)).size,27);
assert.equal(new Set(people.additionalTeachers.map(x=>x.id)).size,10);
const component=read('src/pages/operator/OperatorDemoView.tsx');
const chart=read('src/pages/operator/OperatorAnalytics.tsx');
assert.doesNotMatch(component,/Judge demonstration mode|Every figure and record below/);
assert.match(component,/OperatorAnalytics records=\{data\.records\}/);
assert.match(component,/seedVersion:3/);
const charts=(chart.match(/<(?:Bars|Columns|Donut)\s+title=/g)||[]).length;
assert.equal(charts,10,'ten distinct charts should be displayed');
assert.match(chart,/records\.students/);
assert.match(chart,/records\.teachers/);
assert.match(chart,/occurrences\(records\.support/);
assert.match(chart,/occurrences\(records\.moderation/);
assert.match(chart,/classSize\(r\)/);
const op = run(component+'\nexports.testSeed=seed;exports.testLoad=loadDemo;','OperatorDemoView.tsx',id=>{
 if(id.includes('operatorDemoPeople'))return people;
 if(id.includes('operatorActivityHistory'))return history;
 if(id.includes('OperatorAnalytics'))return {OperatorAnalytics:()=>null};
 if(id==='react')return {};
 if(id==='react/jsx-runtime')return {jsx:()=>({}),jsxs:()=>({})};
 return {useApp:()=>({})};
});
const seeded=op.testSeed();
assert.equal(seeded.records.students.length,32);
assert.equal(seeded.records.teachers.length,14);
assert.equal(seeded.seedVersion,3);
assert.equal(seeded.log.length,100);
const old={records:{...seeded.records,students:seeded.records.students.slice(0,5),teachers:seeded.records.teachers.slice(0,4)},log:[{id:'old',action:'Edited',when:'Earlier'}]};
old.records.students[0]={...old.records.students[0],name:'Custom Edited Learner'};
const value=JSON.stringify(old);
// Create a fresh module with simulated pre-upgrade browser data.
const exp={};
vm.runInNewContext(compile(component+'\nexports.testLoad=loadDemo;','OperatorDemoView.tsx'),{
 exports:exp,require:id=>id.includes('operatorDemoPeople')?people:id.includes('operatorActivityHistory')?history:id.includes('OperatorAnalytics')?{OperatorAnalytics:()=>null}:{},localStorage:{getItem:()=>value},console,
});
const upgraded=exp.testLoad();
assert.equal(upgraded.seedVersion,3);
assert.equal(upgraded.records.students.length,32);
assert.equal(upgraded.records.teachers.length,14);
assert.equal(upgraded.records.students[0].name,'Custom Edited Learner','preserve user edits');
assert.equal(upgraded.log[0].id,'old','preserve activity');
assert.equal(upgraded.log.length,101,'adds 100 fictional history entries without replacing edits');
assert.equal(new Set(upgraded.records.students.map(x=>x.id)).size,32);
console.log(`PASS: removed operator demo banner, expanded to ${seeded.records.students.length} students / ${seeded.records.teachers.length} teachers; ${charts} live-data charts; existing browser edits migrate safely.`);
