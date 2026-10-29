const fs=require('node:fs'),assert=require('node:assert/strict'),postcss=require('postcss');
const read=p=>fs.readFileSync(p,'utf8');
const photos=read('src/components/visual/RealPhoto.tsx');
const main=read('src/main.tsx');
const design=read('src/website-v26-human-premium.css');
const sources={roboticsWorkshop:7869085,libraryReaders:8926840,learningPartners:5212695,interactiveClassroom:7743256,readingFocus:8618017,independentStudy:5303516};
assert((photos.match(/https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-/g)||[]).length>=29,'At least 29 original photo sources retained');
const pages=['src/pages/LandingPage.tsx','src/pages/student/StudentDashboard.tsx','src/pages/teacher/TeacherDashboard.tsx','src/pages/quiz/QuizPage.tsx','src/pages/comics/ComicLibrary.tsx','src/pages/student/StudentProgress.tsx','src/pages/student/LessonsView.tsx'];
for(const [key,id] of Object.entries(sources)){
 assert(photos.includes(`${key}: 'https://images.pexels.com/photos/${id}/`),`Missing ${key} source`);
 assert(pages.some(p=>read(p).includes(`photo="${key}"`)||read(p).includes(`photo:'${key}'`)),`New source ${key} not displayed`);
}
assert(photos.includes('onError={()=>setFailed(true)}'),'Local image fallback must be wired');
assert(main.indexOf("import './website-v26-human-premium.css'")>main.indexOf("import './website-v25-learning.css'"),'Latest CSS must follow earlier design layers');
const parsed=postcss.parse(design,{from:'src/website-v26-human-premium.css'});
assert(parsed.nodes.length>20,'Design rules unexpectedly empty');
for(const required of ['.premium-landing','.premium-topbar','.premium-sidebar','.premium-dashboard-photo','.playhaven-card','.quiz-hero','.v26-progress-photo','.v26-reading-ribbon','prefers-reduced-motion','[dir="rtl"]']){
 assert(design.includes(required),`Missing scoped visual rule ${required}`);
}
assert(read('src/pages/quiz/QuizPage.tsx').includes('quiz-hero'),'Quiz page still active');
assert(read('src/pages/arcade/addons/AdventureExtras.tsx').includes('WORLDS'),'Arcade worlds still active');
console.log('PASS: 29+ photo sources; six original v26 Pexels source mappings used across seven pages; fallback, scoped CSS, reduced motion, RTL, and existing quiz/Arcade anchors retained.');
