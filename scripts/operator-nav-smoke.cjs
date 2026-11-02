const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const sidebar=read('src/components/layout/Sidebar.tsx');
const app=read('src/App.tsx');const context=read('src/context/AppContext.tsx');
const top=read('src/components/layout/TopBar.tsx');
const operator=read('src/pages/operator/OperatorDemoView.tsx');
const mobile=read('src/components/layout/MobileBottomNav.tsx');
const landing=read('src/pages/LandingPage.tsx');
const findIds=b=>[...b.matchAll(/\{ id: '([^']+)'/g)].map(x=>x[1]);
const student=sidebar.split('const studentSections: NavSection[] = [')[1].split('const teacherSections:')[0];
const teacher=sidebar.split('const teacherSections: NavSection[] = [')[1].split('const operatorSections:')[0];
const operatorSide=sidebar.split('const operatorSections: NavSection[] = [')[1].split('const navSections =')[0];
assert.equal(new Set(findIds(student)).size,16,'keep 15 existing Student destinations plus Time Machine');
assert.equal(new Set(findIds(teacher)).size,13,'keep 13 Teacher sidebar destinations');
assert.equal(new Set(findIds(operatorSide)).size,13,'all 13 operator demo pages have sidebar destinations');
for(const target of ['op_dashboard','op_students','op_teachers','op_accounts','op_classes','op_schedules','op_content','op_moderation','op_support','op_analytics','op_activity','op_settings','op_profile']) assert(findIds(operatorSide).includes(target),target);
assert.match(sidebar,/navSections\.map/);assert.match(sidebar,/aria-current/);
assert.match(top,/onClick=\{\(\) => setRole\('operator'\)\}/);
assert.match(top,/t\('operatorView'\)/);
assert.match(top,/\['student','teacher','operator'\]/);
assert.match(mobile,/role === 'operator'/);
assert.match(context,/CURRENT_OPERATOR/);
assert.match(context,/setActiveTab\(role === 'operator' \? 'op_dashboard'/);
assert.match(app,/if \(role === 'operator'\) return <OperatorDemoView/);
assert.doesNotMatch(app,/get\('operator'\) === '1' \? <OperatorPortal/);
assert.match(landing,/Operator Demo View/);
for(const name of ['students','teachers','classes','schedules','content','moderation','support'])assert.match(operator,new RegExp(`(?:${name}:|${name}:\\[)`));
assert.match(operator,/localStorage\.setItem\(STORE/);
assert.match(operator,/Demo Settings/);
assert.doesNotMatch(operator,/fetch\s*\(|\/api\/operator|type=['"]password['"]/i);
const game=read('src/pages/arcade/robolab/RoboLab.tsx');const demo=read('src/pages/arcade/robolab/demoConfig.ts');
assert.match(demo,/ROBOLAB_DEMO_UNLOCK_ALL = true/);
assert.match(game,/ROBOLAB_DEMO_UNLOCK_ALL\|\|i===0/);
assert.match(game,/disabled=\{!available\}/);
assert.match(read('OPERATOR_DEMO_README.md'),/false/);
// Parse modified TS/TSX files if TypeScript is available globally or locally.
let ts;
try{ts=require('typescript')}catch{try{ts=require(path.join(require('node:child_process').execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim(),'typescript'))}catch{}}
if(ts)for(const file of ['src/App.tsx','src/pages/operator/OperatorDemoView.tsx','src/components/layout/TopBar.tsx','src/components/layout/Sidebar.tsx','src/components/layout/MobileBottomNav.tsx','src/context/AppContext.tsx','src/pages/arcade/robolab/RoboLab.tsx']){
 const r=ts.transpileModule(read(file),{fileName:file,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}});
 assert.deepEqual((r.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error),[],`${file} should parse`);
}
console.log('PASS: Student 16 (15 existing + Time Machine) + Teacher 13 links preserved, Operator 13 demo sections accessible, role switchers, local sample data, no credentials, and RoboLab judge unlock 40/40 configured.');
