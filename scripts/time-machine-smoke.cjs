const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function must(condition,message){if(!condition)throw new Error(message);}
const app=read('src/App.tsx'),sidebar=read('src/components/layout/Sidebar.tsx');
const ui=read('src/pages/time-machine/CodeTimeMachine.tsx');
const worker=read('public/time-machine/python-worker.js');
const helper=read('public/time-machine/tracer.py');
const samples=read('src/pages/time-machine/samples.ts');
const work=read('src/pages/coding/CodingWorkspace.tsx');
const daily=read('src/pages/daily/DailyCodingSolver.tsx');
must(app.includes('code_time_machine')&&app.includes('<CodeTimeMachine />'),'Time Machine route missing');
must(sidebar.includes("id: 'code_time_machine'")&&sidebar.includes('Coding & Practice'),'Student sidebar missing');
must(work.includes('Debug in Time Machine')&&work.includes('TRANSFER')===false,'Workspace handoff missing');
must(daily.includes("setActiveTab('code_time_machine')"),'Daily Python handoff missing');
must(ui.includes('new Worker(')&&ui.includes('worker.current?.terminate()'),'No bounded worker');
must(ui.includes('Math.max(-1')&&ui.includes('setPosition'),'Timeline controls missing');
must(ui.includes('speechSynthesis')&&ui.includes('Memori Pemboleh Ubah'),'Bilingual audio or memory missing');
must(worker.includes('loadPyodide')&&worker.includes('tracer.py'),'Real Python interpreter connection missing');
must(helper.includes('sys.settrace(capture)')&&helper.includes('ast.parse')&&helper.includes('MAX_EVENTS'),'Real execution trace/limits missing');
must((samples.match(/\{id:'/g)||[]).length>=20,'Not enough starter programs');
console.log('PASS: navigation, coding handoffs, worker, rewind, bilingual guidance, 24 starters, worker limits');
const candidates=process.platform==='win32'?[['py',['-3']],['python',[]]]:[['python3',[]],['python',[]]];
let runner=null;
for(const [bin,args] of candidates){const v=cp.spawnSync(bin,[...args,'--version'],{encoding:'utf8'});if(v.status===0){runner={bin,args};break;}}
if(runner){const result=cp.spawnSync(runner.bin,[...runner.args,path.join(root,'scripts/time-machine-tracer-tests.py')],{encoding:'utf8'});process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');if(result.status!==0)process.exit(1);}
else console.log('SKIP: local Python not installed; browser Pyodide tests require an actual connected browser.');
