/** Reports exact translated resource coverage; does not mistake translation keys for entire app coverage. */
const fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm');
const load=(f)=>{const transpiled=ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const module={exports:{}};vm.runInNewContext(transpiled,{module,exports:module.exports,require});return module.exports};
const L=load('src/locales/registry.ts'),C=load('src/pages/ciko/cikoLocalized.ts'),K=load('src/pages/ciko/cikoKnowledge.ts');
const file=ts.createSourceFile('LanguageContext.tsx',fs.readFileSync('src/context/LanguageContext.tsx','utf8'),ts.ScriptTarget.ES2022,true,ts.ScriptKind.TSX);
let node;function walk(n){if(ts.isVariableDeclaration(n)&&n.name.getText(file)==='messages')node=n.initializer?.expression||n.initializer;ts.forEachChild(n,walk)}walk(file);
const keys=node.properties.find(p=>p.name.getText(file)==='en').initializer.properties.map(p=>p.name.getText(file));
let report='# CilikLab v16 — Honest Localization Coverage\n\n';
report+='This update modifies localization infrastructure, selector, typography/RTL rules, and Ciko translations only. Existing site/game designs and progress rules remain unchanged.\n\n';
report+='| Locale | Existing core UI resource keys | Ciko translated Q/A | RTL | Status |\n|---|---:|---:|---|---|\n';
for(const lang of L.LOCALES){
 const count=keys.filter(k=>lang.id==='ms'||lang.id==='en'||!!L.localizedCore(k,lang.id)).length;
 const qa=lang.id==='ms'||lang.id==='en'?K.CIKO_ANSWERS.length:Object.keys(C.CIKO_TRANSLATED[lang.id]).length;
 const missing=keys.filter(k=>lang.id!=='ms'&&lang.id!=='en'&&!L.localizedCore(k,lang.id));
 report+=`| ${lang.name} (${lang.code}) | ${count}/${keys.length} | ${qa}/${K.CIKO_ANSWERS.length} | ${lang.direction==='rtl'?'Yes':'No'} | ${lang.status==='partial'?'Partial / Beta':'Original language'} |\n`;
 if(missing.length)report+=`\nMissing core keys (${lang.name}): ${missing.join(', ')}\n`;
}
report+='\n**Important:** These totals measure only the central `t(...)` interface keys and Ciko answer resources. They do NOT measure the complete website. Most Arcade game level names, questions, hints, wins, teacher-authored content, comics, and many screen-specific hardcoded messages still use their original Malay/English content in the added languages. The selector explicitly marks them Beta.\n\n';
report+='Ciko displays only the locally translated entries in each new locale (12 genuine entries spanning 9 topics); the full 120 remain unchanged and accessible by choosing Malay or English. No machine translations, fake locale files or invented voice availability are claimed.\n\n';
report+='Audio: speech synthesis is offered only when the browser returns a compatible installed language voice. This has code-level verification only; playback, pronunciation, RTL interactions and fonts require browser/device tests.\n\n';
report+='Programming keywords, commands, internal game IDs, scores, saved progress, images, teachers’ material, and the Arcade engines are not translated or reset.\n';
fs.writeFileSync('CILIKLAB_V16_LOCALIZATION_COVERAGE.md',report);
console.log(report);
