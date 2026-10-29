const fs=require('node:fs');const assert=require('node:assert/strict');const path=require('node:path');
const get=f=>fs.readFileSync(f,'utf8');
const photo=get('src/components/visual/RealPhoto.tsx');
const motion=get('src/components/visual/PremiumMotion.tsx');
const css=get('src/website-life-motion.css');
const main=get('src/main.tsx');
const app=get('src/App.tsx');
assert(photo.includes('onError={()=>setFailed(true)}'),'Photos must have failure fallback');
assert(photo.includes('loading={loading}'),'Photo lazy/eager loading support missing');
assert(photo.includes('no-referrer'),'Photo referrer policy missing');
assert((photo.match(/https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-/g)||[]).length>=23,'At least 23 original Pexels photo sources expected');
for(const file of ['src/pages/LandingPage.tsx','src/pages/student/StudentDashboard.tsx','src/pages/teacher/TeacherDashboard.tsx','src/pages/student/ExploreClasses.tsx','src/pages/student/LessonsView.tsx','src/pages/coding/CodingWorkspace.tsx']){
 assert(get(file).includes('RealPhoto'),`Missing photo integration: ${file}`);
}
assert(motion.includes('IntersectionObserver')&&motion.includes('unobserve')&&motion.includes('observer.disconnect'),'Motion lifecycle must clean up observers');
assert(motion.includes('prefers-reduced-motion')&&css.includes('prefers-reduced-motion'),'Missing reduced-motion fallback');
assert(main.includes("import './website-life-motion.css'"),'New styles must load after the old site styles');
assert(app.includes('<PremiumMotion'),'Motion observer must be mounted on site pages');
for(const fallback of ['public/visuals/hero-adventure.webp','public/visuals/coding-friends.webp','public/visuals/forest-adventure.webp','public/visuals/creative-pixels.webp','public/arcade/logic-builder.svg','public/arcade/code-escape.svg']) assert(fs.existsSync(fallback),`Missing offline fallback: ${fallback}`);
assert(main.includes("import './website-editorial-v17.css';"),'Editorial styles must be retained');
assert(main.indexOf("import './website-v18-natural.css';")>main.indexOf("import './website-editorial-v17.css';"),'V18 visual refinements should load after V17');
console.log('PASS: photo-source compatibility (23+), website imagery, local fallbacks, reduced-motion support, observer cleanup, and editorial style precedence.');
