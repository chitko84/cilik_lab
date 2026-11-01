const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const landing=read('src/pages/LandingPage.tsx');
const sections=read('src/pages/landing/MoreAboutCilikLab.tsx');
const style=read('src/website-v38-comics-home.css');
for(const name of ['learning-journey','comiccode','more-to-explore','questions'])assert(sections.includes(`id="${name}"`),`Landing section ${name} missing`);
for(const marker of ['English','Bahasa Melayu','Ciko RoboLab 3D','Daily Coding','faq','openComics','openQuestion'])assert(sections.toLowerCase().includes(marker.toLowerCase()),`Missing ${marker}`);
assert(landing.includes('<MoreAboutCilikLab')&&landing.includes('setActiveTab(\'comic_library\')'));
assert(landing.includes('<ProjectIntroduction />'),'Original home introduction should remain');
assert(landing.includes('id="python"')&&landing.includes('id="educators"'));
assert(style.includes('@media(max-width:390px)')&&style.includes('prefers-reduced-motion'));
assert(read('src/main.tsx').includes('website-v38-comics-home.css'));
require('postcss').parse(style);
const ts=require('typescript');
for(const f of ['src/pages/LandingPage.tsx','src/pages/landing/MoreAboutCilikLab.tsx']){
 const r=ts.transpileModule(read(f),{fileName:f,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}});
 assert.equal((r.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error).length,0,`TS syntax errors: ${f}`);
}
console.log('PASS — 4 new homepage sections, both language content, direct flipbook links, FAQs, responsive styles and preserved homepage');
