const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');const path=require('node:path');
const read=p=>fs.readFileSync(p,'utf8');
const cache={};function mod(file){const f=path.resolve(file);if(cache[f])return cache[f];const module={exports:{}};const js=ts.transpileModule(read(f),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const custom=q=>q.startsWith('.')?mod(path.resolve(path.dirname(f),q)+'.ts'):require(q);
 vm.runInNewContext(js,{module,exports:module.exports,require:custom,localStorage:{getItem:()=>null}}, {filename:f,timeout:2500});return cache[f]=module.exports;}
const bank=mod('src/pages/daily/dailyBank.ts');const {dailyLocalized,dailyText}=mod('src/pages/daily/dailyLocalization.ts');
const sport=mod('src/pages/arcade/addons/sportsEngine.ts');const {sportLocalized}=mod('src/pages/arcade/addons/sportsTranslations.ts');
const challenge=mod('src/pages/arcade/addons/ChallengeLabEngine.ts');const {challengeLevelText,challengeText}=mod('src/pages/arcade/addons/challengeTranslations.ts');
const locales=['en','ms','bn','my','pcm','fa','ar','id'];let checks=0;
for(const p of bank.DAILY_PROBLEMS)for(const lang of locales){
 const a=dailyLocalized(p,lang);for(const key of ['title','story','world','instructions','hint']){
 assert.equal(typeof a[key],'string');assert(a[key].trim().length>5,`${p.id} ${lang} ${key}`);assert(!/\{(?:world|item|a|b|c|total|threshold|sample)\}/.test(a[key]),`${p.id} ${lang} unresolved ${key}`);
 }
 if(lang==='en')assert.equal(a.instructions,p.instructions);else {
  assert.notEqual(a.instructions,p.instructions,`${p.id} ${lang} must show translated task`);
  assert.notEqual(a.title,p.title,`${p.id} ${lang} must show translated title`);
  assert.notEqual(a.hint,p.hint,`${p.id} ${lang} must show translated hint`);
 }
 checks++;
}
for(const lang of locales)for(let i=0;i<20;i++)assert(dailyText(lang,i).trim().length>2,`${lang} label ${i}`);
for(const lang of locales)for(const id of ['football','basketball','track']){
 const text=sportLocalized(lang,id),info=sport.SPORTS[id];assert(text.intro.length>10);
 for(const action of info.actions){const a=text.action(action.id,action.label),b=text.scene(action.id,sport.sportEventText(id,action.id));assert(a.length>1);assert(b.length>8);if(lang!=='en')assert.notEqual(b,sport.sportEventText(id,action.id))}
 for(let i=0;i<19;i++)assert(text.ui(i).trim().length>=2);
}
let levelChecks=0;
for(const lang of locales){
 for(let i=0;i<25;i++)assert(challengeText(lang,i).trim().length>=2);
 for(const [mode,levels] of [['cipher',challenge.CIPHER_LEVELS],['fossil',challenge.PATTERN_LEVELS]]){
  for(let i=0;i<levels.length;i++){
   const out=challengeLevelText(lang,mode,i,levels[i]);
   assert(out.title.trim().length>2&&out.hint.trim().length>6,`${lang} ${mode}-${i+1}`);
   if(lang==='en')assert.equal(out.title,levels[i].title);
   else if(lang!=='pcm')assert.notEqual(out.hint,levels[i].hint);
   levelChecks++;
  }
 }
}
const gameNames=read('src/locales/contentTranslations.ts');for(const id of ['football','basketball','track','cipher','fossil'])assert(gameNames.includes(`\"${id}\"`)||gameNames.includes(`'${id}'`),`Missing game title ${id}`);
const screen=read('src/hooks/useClassroomScreenShare.ts');for(const target of ['getDisplayMedia','replaceTrack','onended','getVideoTracks','audio:false','stopScreenShare'])assert(screen.includes(target),`Missing real share handling ${target}`);
for(const view of ['src/pages/meetings/HostedClassroom.tsx','src/pages/meetings/LiveClassroom.tsx']){
 const source=read(view);assert(source.includes('useClassroomScreenShare'));assert(source.includes('Share screen / slides'));assert(source.includes('Stop presenting'));
}
const game=read('src/pages/arcade/addons/SportsArena.tsx');for(const token of ['sports-athlete','sports-moving-ball','sports-teammate','sports-opponent','sportLocalized','sports-stadium-goal'])assert(game.includes(token),`Missing animation ${token}`);
const css=read('src/pages/arcade/addons/sportsArena.css');for(const token of ['@keyframes sports-shot','@keyframes sports-pass','prefers-reduced-motion','sports-playfield-basketball'])assert(css.includes(token));
const daily=read('src/pages/daily/DailyCodingSolver.tsx');for(const token of ['translatedProblem.title','translatedProblem.story','translatedProblem.instructions','translatedProblem.hint','dailyLocalized(p,locale)'])assert(daily.includes(token));
console.log(`PASS: ${checks} complete localized daily-problem renderings (150 x 8); sports tutorials for 3 games x 8 languages; ${levelChecks} localized puzzle levels (24 x 8); real user-triggered WebRTC screen/tab presentation and animated sports field source checks.`);
