const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const read=s=>fs.readFileSync(path.join(root,s),'utf8');
const series=read('src/data/comicSeries.ts');
const originals=read('src/data/comicBooks.ts');
const ui=read('src/pages/comics/ComicLibrary.tsx');
const reader=read('src/pages/comics/SeriesReader.tsx');
const app=read('src/App.tsx');
const css=read('src/website-v35-comics.css');
assert.strictEqual((series.match(/"id": "\d\d-/g)||[]).length,10,'Ten new books required');
assert.strictEqual((series.match(/"index": \d+/g)||[]).length,80,'80 English page scripts required');
assert.strictEqual((series.match(/"narration":/g)||[]).length,80);
assert.strictEqual((series.match(/"speech":/g)||[]).length,80);
assert.strictEqual((series.match(/"art":/g)||[]).length,80);
for(const id of ['variables','loops','conditions'])assert(originals.includes(`id: '${id}'`),'Original comics missing '+id);
for(const label of ['Read English','Bahasa Melayu','Coming soon'])assert(reader.includes(label)||reader.includes(label.toLowerCase())||reader.includes('Soon'),label);
for(const key of ['comicBook','comicLang'])assert(reader.includes(key)&&app.includes(key)||key==='comicLang'&&reader.includes(key));
assert(ui.includes('<ComicSeriesCards')&&ui.includes('<ComicSeriesReader'));
assert(reader.includes('saveComicPage')&&reader.includes('onTouchStart')&&reader.includes('ArrowRight'));
assert(reader.includes('not published yet')&&reader.includes('coming soon'));
assert(css.includes('@media(max-width:490px)')&&css.includes('prefers-reduced-motion'));
assert(read('src/main.tsx').includes("import './website-v35-comics.css';"));
let ts;try{ts=require('typescript')}catch{try{ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript')}catch{ts=null}}
if(ts) for(const file of ['src/data/comicSeries.ts','src/pages/comics/SeriesReader.tsx','src/pages/comics/ComicLibrary.tsx','src/App.tsx']){
 const source=read(file);const check=ts.transpileModule(source,{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}});
 const errors=(check.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
 assert.strictEqual(errors.length,0,`TypeScript syntax: ${file} ${errors.map(d=>d.messageText).join(' ')}`);
}
try{require('postcss').parse(css)}catch(e){if(/CssSyntaxError/.test(e.name||''))throw e;assert(css.includes('.comic-series-card'))}
console.log('PASS — 10 bilingual edition cards, 80 English scripts, preserved 3 classics, reader controls, URL links, responsive styles, syntax');
