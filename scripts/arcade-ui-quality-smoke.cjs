/* Static interaction and integration checks. Browser behavior must be verified separately. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const {execFileSync} = require('node:child_process');
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);}
const sources=walk('src').filter(x=>/\.tsx?$/.test(x));let buttons=0,inputs=0;
for(const file of sources){
 const code=fs.readFileSync(file,'utf8');
 const sf=ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true,file.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(sf.parseDiagnostics.length,0,`Syntax diagnostics in ${file}: ${sf.parseDiagnostics.map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join('; ')}`);
 function scan(n){
  if(ts.isJsxOpeningElement(n)||ts.isJsxSelfClosingElement(n)){
   const tag=n.tagName.getText(sf);const attrs=n.attributes.properties.filter(ts.isJsxAttribute).map(x=>x.name.getText(sf));
   const line=sf.getLineAndCharacterOfPosition(n.getStart(sf)).line+1;
   if(tag==='button'){
    buttons++;
    assert(attrs.includes('onClick')||attrs.includes('type'),`Button missing handler or submit type at ${file}:${line}`);
   }
   if(['input','textarea','select'].includes(tag)){
    inputs++;
    assert(attrs.some(x=>['onChange','onInput','readOnly','disabled'].includes(x)),`${tag} missing change handler at ${file}:${line}`);
   }
  }
  ts.forEachChild(n,scan);
 } scan(sf);
}
const extras=fs.readFileSync('src/pages/arcade/addons/AdventureExtras.tsx','utf8');
const hub=fs.readFileSync('src/pages/arcade/addons/ArcadeHome.tsx','utf8');
const app=fs.readFileSync('src/pages/arcade/ArcadeView.tsx','utf8');
const engines=['maze','escape','detective','logic','space','pixel','sort','garden','melody','bridge','rescue'];
for(const id of engines){
 assert(extras.includes(`id:'${id}'`),`World missing ${id}`);
 assert(app.includes(`launch.mode==='${id}'`),`Route missing ${id}`);
}
assert(hub.includes('playhaven-featured-link')&&hub.includes('onOpen(next.w.id'), 'Featured quest must link to a real game');
assert(hub.includes('onClick={()=>setFilter')&&hub.includes('onChange={e=>setSearch'), 'Search and category filters must be functional');
assert(app.includes('saved.level<world.ids.length'), 'Restored level selection must be range-checked');
for(const art of ['melody-machine.svg','bridge-builder.svg','robot-rescue.svg'])assert(fs.existsSync(`public/arcade/${art}`),`Missing game artwork ${art}`);
const notes=fs.readFileSync('src/pages/arcade/addons/BonusArcadeGames.tsx','utf8');
assert(!notes.includes('<p>+ {score} XP'), 'Misleading replay award copy detected');
const [,,engineFile]=process.argv;
console.log(`PASS: ${sources.length} TS/TSX files parse; ${buttons} button handlers/submit controls and ${inputs} inputs checked; 11 routes and game artwork confirmed.`);
