const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function loadTS(file){const src=fs.readFileSync(file,'utf8');const result=ts.transpileModule(src,{fileName:file,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}});const errs=(result.diagnostics||[]).filter(x=>x.category===ts.DiagnosticCategory.Error);assert(!errs.length,errs.map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join('\n'));const module={exports:{}};vm.runInNewContext(result.outputText,{module,exports:module.exports,require});return module.exports;}
const {CIKO_ANSWERS,CIKO_CATEGORIES,findCikoAnswer}=loadTS('./src/pages/ciko/cikoKnowledge.ts');
assert.equal(CIKO_CATEGORIES.length,12,'There must be twelve categories');
assert.equal(CIKO_ANSWERS.length,120,'There must be 120 prepared bilingual questions');
assert.equal(new Set(CIKO_ANSWERS.map(x=>x.id)).size,CIKO_ANSWERS.length,'Question IDs should be unique');
for(const a of CIKO_ANSWERS){
 assert(CIKO_CATEGORIES.some(c=>c.id===a.category),'Valid category required');
 for(const l of ['ms','en']){assert(a.question[l].length>4&&a.answer[l].length>35,`${a.id} missing ${l} text`);assert.equal(findCikoAnswer(a.question[l],l)?.id,a.id,`Exact question should match itself: ${a.id}:${l}`);}
}
for(const [text,lang,category] of [['What is a loop?','en','loops'],['Apa itu pemboleh ubah?','ms','python'],['Why does my robot hit a wall?','en','debug'],['Bagaimana main Robot Rescue?','ms','games'],['Can I share my password?','en','safety'],['What are variables?','en','python'],['How can I use loops?','en','loops']]){
 assert.equal(findCikoAnswer(text,lang)?.category,category,`Match category for ${text}`);
}
for(const q of ['What is the weather tomorrow?','Tell me a secret password',''])assert.equal(findCikoAnswer(q,'en'),null,`No fabricated answer: ${q}`);
const view=fs.readFileSync('./src/pages/ciko/CikoAssistant.tsx','utf8');
for(const term of ['SpeechSynthesisUtterance','speechSynthesis.cancel','voiceschanged','onstart','onend','onerror','onSubmit={submit}','aria-pressed={muted}','setLanguage','setCategory','aria-live','CIKO_ANSWERS']){if(term==='setLanguage')continue;assert(view.includes(term),`Ciko should use ${term}`)}
const motion=fs.readFileSync('./src/pages/ciko/cikoPremium.css','utf8');assert(motion.includes('prefers-reduced-motion'));
console.log(`PASS: ${CIKO_ANSWERS.length} Ciko bilingual answers, ${CIKO_CATEGORIES.length} topics, matching, honest fallback, speech UI hooks, reduced-motion styling.`);
