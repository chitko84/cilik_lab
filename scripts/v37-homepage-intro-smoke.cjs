/** Homepage explainer regression: inspect only; never represent this as a real browser test. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const postcss=require('postcss');
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const landing=read('src/pages/LandingPage.tsx');
const intro=read('src/pages/landing/ProjectIntroduction.tsx');
const copies=read('src/pages/landing/introCopy.ts');
const css=read('src/website-v37-home-intro.css');
const entry=read('src/main.tsx');
const pkg=JSON.parse(read('package.json'));
assert(landing.includes('<ProjectIntroduction />'),'Home must render the new explanation');
assert(landing.indexOf('<ProjectIntroduction />')>landing.indexOf('</section>'),'Introduction is not replacing original hero');
assert(landing.indexOf('<ProjectIntroduction />')<landing.indexOf('id="explore"'),'Introduction appears before existing discovery section');
assert(landing.includes("loginAs('student')")&&landing.includes("loginAs('teacher')"),'Existing role entry points remain');
for(const token of ['aria-labelledby','childHeading','teacherHeading','copy.steps','copy.description','RealPhoto','<figure','<figcaption'])assert(intro.includes(token),`Missing explanation component element: ${token}`);
for(const language of ['en','ms','bn','my','pcm','fa','ar','id']) {
 const block=new RegExp(`\\b${language}:\\s*\\{([\\s\\S]*?)(?=\\n  (?:en|ms|bn|my|pcm|fa|ar|id):\\s*\\{|\\n\\};)`).exec(copies);
 assert(block,`Missing homepage introduction in ${language}`);
 for(const key of ['eyebrow','heading','description','childHeading','childBody','teacherHeading','teacherBody','journeyLabel','steps','photoCaption'])assert(new RegExp(`\\b${key}:`).test(block[1]),`${language} missing ${key}`);
 assert(/steps:\s*\[[^\]]*,[^\]]*,[^\]]*\]/.test(block[1]),`${language} needs all three journey steps`);
}
assert(entry.includes("import './website-v37-home-intro.css';"),'Last-loaded stylesheet not wired');
assert(css.includes('@media(max-width:620px)'),'Mobile layout rule required');
assert(css.includes('prefers-reduced-motion:reduce'),'Reduced-motion support required');
assert(css.includes('[dir=\'rtl\']'),'RTL support required');
assert(!/position:\s*absolute/.test(css),'No overlapping/floating promotional cards');
assert(pkg.scripts['test:site:v37'],'Dedicated test command missing');
postcss.parse(css,{from:'src/website-v37-home-intro.css'});
let count=0;
for(const file of ['src/pages/LandingPage.tsx','src/pages/landing/ProjectIntroduction.tsx','src/pages/landing/introCopy.ts','src/main.tsx']){
 const output=ts.transpileModule(read(file),{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}});
 const errors=(output.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
 assert.equal(errors.length,0,`${file} has TS syntax errors`);
 count++;
}
console.log(`PASS v37: 8 translated homepage explanations, children/teacher guidance, learning journey, responsive CSS/RTL/reduced-motion, role buttons preserved, ${count} TS/TSX files parsed.`);
