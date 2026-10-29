const fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm'),assert=require('node:assert/strict');
const fname='src/locales/contentTranslations.ts';
const compiled=ts.transpileModule(fs.readFileSync(fname,'utf8'),{fileName:fname,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const m={exports:{}};vm.runInNewContext(compiled,{module:m,exports:m.exports});const L=m.exports;
for(const locale of ['bn','my','pcm','fa','ar','id']){
 for(const [name,obj,want] of [['phrases',L.PHRASE_TRANSLATIONS,68],['additional',L.MODULE_UI_TRANSLATIONS,34],['aria',L.CIRCUIT_ARIA_TRANSLATIONS,5],['games',L.WORLD_TITLE_TRANSLATIONS,14],['descriptions',L.GAME_DESC_TRANSLATIONS,14],['topics',L.QUIZ_TOPIC_TRANSLATIONS,8],['circuit',L.CIRCUIT_LEVEL_TRANSLATIONS,8],['badges',L.BADGE_TRANSLATIONS,18]]){
 assert.equal(Object.keys(obj[locale]).length,want,`${locale} ${name}`);
 for(const [key,value] of Object.entries(obj[locale])){if(typeof value==='string')assert.ok(value.trim());else assert.ok(value.title?.trim()&&(value.tip?.trim()||value.desc?.trim()),`${locale}:${name}:${key}`)}
 }
 assert.ok(L.quizCoverageNotice(locale).length>20);
 assert.equal(L.translatePair('Petunjuk','Hint',locale),L.PHRASE_TRANSLATIONS[locale].Hint);
 assert.equal(L.localizedGameTitle('maze','Robot Forest',locale),L.WORLD_TITLE_TRANSLATIONS[locale].maze);
 assert.equal(L.localizedBadge('first','title','Kemenangan Pertama','First Victory',locale),L.BADGE_TRANSLATIONS[locale].first.title);
 assert.equal(L.localizedCircuitLevel('circuit-1','title','Cahaya Pertama','First Light',locale),L.CIRCUIT_LEVEL_TRANSLATIONS[locale]['circuit-1'].title);
}
assert.equal(L.translatePair('Petunjuk','Hint','ms'),'Petunjuk');assert.equal(L.translatePair('Petunjuk','Hint','en'),'Hint');
for(const n of ['ArcadeHome','CreativeLearning','BonusArcadeGames','NewArcadeGames','RobotRescue','QuestBoard','MazeCreator','SpaceInvaders','SparkCircuit','AdventureExtras']){
 const s=fs.readFileSync(`src/pages/arcade/addons/${n}.tsx`,'utf8');assert.ok(s.includes('locale}=useLanguage()'),n);assert.ok(s.includes('translatePair'),n);
}
const quiz=fs.readFileSync('src/pages/quiz/QuizPage.tsx','utf8');assert.ok(quiz.includes('quizCoverageNotice(locale)'));
const css=fs.readFileSync('src/locales/multilingual.css','utf8');assert.ok(css.includes('.spark-board')&&css.includes('direction:ltr'));
// Regression guard: a previously missing import crashed the Arcade Home page at runtime.
// Verify the actual imported bindings (not merely the helper definitions in the locale module).
const arcadePath='src/pages/arcade/addons/ArcadeHome.tsx';
const arcadeFile=ts.createSourceFile(arcadePath,fs.readFileSync(arcadePath,'utf8'),ts.ScriptTarget.ES2022,true,ts.ScriptKind.TSX);
const arcadeLocaleImport=arcadeFile.statements.find(node=>ts.isImportDeclaration(node)&&node.moduleSpecifier.text==='../../../locales/contentTranslations');
assert.ok(arcadeLocaleImport,'ArcadeHome must import localization helpers');
const arcadeImports=new Set(arcadeLocaleImport.importClause?.namedBindings?.elements?.map(node=>node.name.text)||[]);
for(const binding of ['translatePair','localizedGameTitle','localizedGameDescription']) {
 assert.ok(arcadeImports.has(binding),`ArcadeHome missing import: ${binding}; this would crash the Arcade page at runtime`);
 assert.equal(typeof L[binding],'function',`Missing exported helper: ${binding}`);
}
for(const world of ['maze','escape','circuit']) {
 assert.equal(typeof L.localizedGameTitle(world,'Example','bn'),'string');
 assert.equal(typeof L.localizedGameDescription(world,'Contoh','Example','bn'),'string');
}
console.log('PASS: ArcadeHome imports all referenced localized helpers and all three are callable.');
console.log('PASS: 6 added locale bundles; 107 UI phrases, 14 game titles/descriptions, 8 quiz topics, 8 circuit titles/hints, 18 badges, honest quiz notices and RTL safeguards.');
