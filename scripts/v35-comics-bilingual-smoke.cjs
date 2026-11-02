/** Published comic editions regression (source-level check; not a browser test). */
const fs=require('fs'), path=require('path'), assert=require('assert');
const root=path.resolve(__dirname,'..');
const read=s=>fs.readFileSync(path.join(root,s),'utf8');
const series=read('src/data/comicSeries.ts');
const originals=read('src/data/comicBooks.ts');
const library=read('src/pages/comics/ComicLibrary.tsx');
const reader=read('src/pages/comics/SeriesReader.tsx');
const app=read('src/App.tsx');
const css=read('src/website-v35-comics.css');
const css38=read('src/website-v38-comics-home.css');
assert.strictEqual((series.match(/"id": "\d\d-/g)||[]).length,10,'Ten new books required');
assert.strictEqual((series.match(/"index": \d+/g)||[]).length,80,'The original 80 short story scripts must remain');
for(const id of ['variables','loops','conditions'])assert(originals.includes(`id: '${id}'`),'Classic comic missing '+id);
const published={
  '01-lost-loop':['cc10d9ca9b','37d18a2e91'],
  '02-variable-treasure':['48dcc3748c','82e68cb1ab'],
  '03-if-else-jungle':['19b888f86a','eceb5e4395'],
  '04-bug-monster':['992ea8cce7','1744548240'],
  '10-code-team-heroes':['6097136c07','6eff892368'],
};
for(const [id,links] of Object.entries(published)){
  const entry=series.slice(series.indexOf(`'${id}': {`,series.indexOf('SERIES_FLIPBOOKS:')));
  assert(entry.startsWith(`'${id}': {`),`Missing publication entry for ${id}`);
  assert(entry.includes(`en: 'https://heyzine.com/flip-book/${links[0]}.html'`),`Missing English ${id}`);
  assert(entry.includes(`ms: 'https://heyzine.com/flip-book/${links[1]}.html'`),`Missing Malay ${id}`);
}
const publishedBlock=series.slice(series.indexOf('export const SERIES_FLIPBOOKS:'));
assert.strictEqual((publishedBlock.match(/https:\/\/heyzine.com\/flip-book\//g)||[]).length,10,'Exactly ten editions should be published');
for(const id of ['05-function-factory','06-space-station','07-python-castle','08-robot-delivery','09-maze-conditions'])
 assert(!publishedBlock.includes(`'${id}': {`),`Book ${id} must remain coming soon`);
for(const token of ['getSeriesFlipbook','comicEditionHref','comic-series-unavailable','Coming soon','iframe','Open on Heyzine','referrerPolicy'])
 assert(reader.includes(token),`Missing edition reader feature: ${token}`);
assert(!reader.includes('saveComicPage'),'Embedded external flipbook must not award inaccurate read progress');
assert(library.includes('<ComicSeriesCards')&&library.includes('<ComicSeriesReader'));
assert(app.includes('comicBook')&&reader.includes('comicLang'));
assert(css.includes('@media(max-width:490px)')&&css38.includes('comic-series-iframe')&&css38.includes('@media(max-width:640px)'));
assert(read('src/main.tsx').includes("import './website-v38-comics-home.css';"));
const ts=require('typescript');
for(const file of ['src/data/comicSeries.ts','src/pages/comics/SeriesReader.tsx','src/pages/comics/ComicLibrary.tsx','src/pages/LandingPage.tsx','src/pages/landing/MoreAboutCilikLab.tsx']){
 const res=ts.transpileModule(read(file),{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}});
 const errors=(res.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
 assert.strictEqual(errors.length,0,`Syntax errors in ${file}: ${errors.map(d=>d.messageText).join('; ')}`);
}
require('postcss').parse(css38);
console.log('PASS — 10 books, exactly 10 published edition URLs, Books 5–9 coming soon, Heyzine embeds/fallback, preserved artwork, TypeScript syntax & responsive CSS');
