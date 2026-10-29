const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),ts=require('typescript');
const load=(f)=>{const code=ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,require});return module.exports;};
const L=load('src/locales/registry.ts');const C=load('src/pages/ciko/cikoLocalized.ts');const U=load('src/pages/ciko/cikoUiLocale.ts');
const K=load('src/pages/ciko/cikoKnowledge.ts');
assert.equal(L.LOCALES.length,8);assert.equal(new Set(L.LOCALES.map(x=>x.id)).size,8);
assert(L.isRtl('fa')&&L.isRtl('ar'));
assert(!L.isRtl('my')&&!L.isRtl('bn'));
assert.equal(L.legacyLanguage('en'),'en');assert.equal(L.legacyLanguage('my'),'ms');
assert.equal(L.localeInfo('my').code,'my-MM');assert.equal(L.localeInfo('pcm').code,'pcm-NG');
assert.equal(L.LOCALE_KEY,'ciliklab_ui_language_v1');
assert.equal(K.CIKO_ANSWERS.length,120);
const newLocales=L.LOCALES.filter(x=>!['en','ms'].includes(x.id));
const statuses={};
for(const lang of newLocales){
 const core=L.CORE_COPY[lang.id],qas=C.CIKO_TRANSLATED[lang.id];
 assert(core&&Object.keys(core).length>=80,`Missing core copy for ${lang.id}`);
 for(const [key,val] of Object.entries(core)){assert(typeof val==='string'&&val.trim().length>0,`${lang.id} empty ${key}`);}
 assert.equal(Object.keys(qas).length,12,`${lang.id}: curated Ciko starter set`);
 const categories=new Set();
 for(const [id,qa] of Object.entries(qas)){
  const original=K.CIKO_ANSWERS.find(x=>x.id===id); assert(original,`Unknown Ciko answer ${id}`);
  assert(qa.question.trim().length>2&&qa.answer.trim().length>10,`${lang.id} empty ${id}`);
  categories.add(original.category);
  assert.equal(C.localizedCiko(original,lang.id).answer,qa.answer);
 }
 assert.equal(categories.size,9,`${lang.id} curated category coverage`);
 assert.equal(U.CIKO_TOPIC_NAMES[lang.id].length,12);
 assert(U.localizeCikoUi('Ask Ciko about coding!',lang.id));
 statuses[lang.id]={coreStrings:Object.keys(core).length,localizedCiko:Object.keys(qas).length,topics:categories.size};
}
const source=fs.readFileSync('src/context/LanguageContext.tsx','utf8');
assert(source.includes('document.documentElement.dir=isRtl(locale)'));
assert(source.includes('localStorage.setItem(LOCALE_KEY,locale)'));
const page=fs.readFileSync('src/pages/ciko/CikoAssistant.tsx','utf8');
assert(page.includes('localizedCiko(entry,locale)'));
assert(page.includes('if(!voice){setVoiceNote'));
assert(page.includes('availableAnswers.filter'));
const rtl=fs.readFileSync('src/locales/multilingual.css','utf8');
assert(rtl.includes('direction:ltr')&&rtl.includes('html[dir="rtl"]'));
console.log('PASS: 8 locale options, 2 RTL languages, persistence, isolated gameplay, '+newLocales.length+' translated starter Ciko libraries, voice-language safeguards.');
console.log('Coverage:',JSON.stringify(statuses));
