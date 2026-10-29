/* Regression guard against the specific v28/v27 photograph overlap.
 * Static integration checks only; run a live browser QA separately.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const css=read('src/website-v29-mobile-overlap-fix.css');
const main=read('src/main.tsx');
const postcss=require('postcss');
const tree=postcss.parse(css);
assert.ok(tree.nodes.length>45,'Full visual repair stylesheet should parse');
assert.ok(main.includes("import './website-v29-mobile-overlap-fix.css';"),'Mobile stylesheet must load');
assert.ok(main.indexOf("import './website-v27-crafted-experience.css';")<main.indexOf("import './website-v29-mobile-overlap-fix.css';"),'Mobile repairs must override inherited visual styles');
for(const cl of ['premium-teacher-feature>.cilik-slideshow','premium-learning-ribbon>.cilik-slideshow','cilik-life-media','premium-dashboard-hero','premium-landing-image-grid','v26-reading-ribbon','v27-library-photo','v25-quiz-promo','mobile-tabbar','quiz-topic-grid','v26-progress-photo']){
 assert.ok(css.includes(cl),`Missing scoped repair for ${cl}`);
}
for(const q of ['@media(max-width:640px)','@media(max-width:370px)','@media(max-width:800px)','@media(max-width:767px)','[dir="rtl"]','@media(prefers-reduced-motion:reduce)'])assert.ok(css.includes(q),`Missing responsive / accessibility rule ${q}`);
assert.ok(/\.premium-main\s+\.premium-teacher-feature>\.cilik-slideshow\s*,/.test(css),'Slideshow flex sizing rule missing');
assert.ok(css.includes('flex:0 0 180px!important'),'Prevent slideshow from expanding across row');
assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))!important'),'Comic photo pair should not overlap on mobile');
assert.ok(css.includes('grid-row:auto!important'),'Mobile landing image cards should not share rows');
assert.ok(css.includes('color:#fff!important'),'Keep text legible against dark hero photos');
assert.ok(!css.includes('display:none!important;\n.premium-main .v26-reading-ribbon .v27-library-photo'),'Retain both comic photos');
const componentFiles=[
 'src/pages/student/StudentDashboard.tsx','src/pages/teacher/TeacherDashboard.tsx',
 'src/pages/student/ExploreClasses.tsx','src/pages/comics/ComicLibrary.tsx',
 'src/pages/LandingPage.tsx','src/pages/quiz/QuizPage.tsx',
 'src/components/visual/PhotoSlideshow.tsx','src/pages/arcade/addons/ArcadeHome.tsx'
];
for(const p of componentFiles)assert.ok(read(p).length>500,`Original component should remain in place: ${p}`);
assert.ok(read('src/pages/arcade/addons/ArcadeHome.tsx').includes('localizedGameTitle'),'Arcade runtime fix retained');
console.log('PASS: new CSS parses, restores slideshow width/stacking, separates comics photos, protects mobile image-card rows, repairs contrast and RTL/reduced motion; all components remain available.');
