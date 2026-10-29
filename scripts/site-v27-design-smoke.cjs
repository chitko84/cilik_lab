const fs=require('node:fs');
const assert=require('node:assert/strict');
const postcss=require('postcss');
const read=path=>fs.readFileSync(path,'utf8');
const photos=read('src/components/visual/RealPhoto.tsx');
const design=read('src/website-v27-crafted-experience.css');
const main=read('src/main.tsx');
const pages=[
  'src/pages/LandingPage.tsx','src/pages/student/StudentDashboard.tsx',
  'src/pages/teacher/TeacherDashboard.tsx','src/pages/student/ExploreClasses.tsx',
  'src/pages/comics/ComicLibrary.tsx'
];
const originalCount=(photos.match(/https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-/g)||[]).length;
assert.equal(originalCount,36,'Existing 29 sources plus exactly seven new editorial photo sources');
const sources={roboticsPartners:7869230,mentoringMoment:5905921,libraryMentor:8342417,tabletClass:5306431,homeLearningDesk:7695204,readingCircle:36859095,studyFriends:36812623};
for(const [key,id] of Object.entries(sources)){
  assert(photos.includes(`${key}: 'https://images.pexels.com/photos/${id}/`),`Missing ${key} source`);
  assert(pages.some(p=>read(p).includes(`photo="${key}"`)||read(p).includes(`photo:'${key}'`)),`Missing real rendering for ${key}`);
}
assert(photos.includes('onError={()=>setFailed(true)}'),'No local fallback');
const parsed=postcss.parse(design,{from:'src/website-v27-crafted-experience.css'});
assert(parsed.nodes.length>=115,'Not enough full-site visual styling');
for(const marker of ['.premium-landing','premium-landing-image-grid','cilik-photo-story-grid','.premium-topbar','.premium-sidebar','.premium-dashboard-hero','.v26-reading-ribbon','.quiz-hero','.playhaven-card','@media (max-width:620px)','prefers-reduced-motion','[dir="rtl"]']) assert(design.includes(marker),`Missing design contract: ${marker}`);
assert(main.includes("import './website-v27-crafted-experience.css';"),'New visual import missing');
assert(main.indexOf("import './website-v27-crafted-experience.css';")>main.indexOf("import './website-v26-human-premium.css';"),'New design not loaded last');
for(const component of ['PhotoSlideshow','RealPhoto']) assert(read('src/pages/LandingPage.tsx').includes(component));
for(const filename of ['src/pages/arcade/addons/SparkCircuit.tsx','src/pages/quiz/QuizPage.tsx','src/pages/ciko/CikoAssistant.tsx']) assert(fs.existsSync(filename),`Old feature removed: ${filename}`);
console.log('PASS: 36 real-photo sources (7 new), five page areas enhanced, responsive/RTL/reduced-motion styles, prior interactions and fallbacks preserved.');
