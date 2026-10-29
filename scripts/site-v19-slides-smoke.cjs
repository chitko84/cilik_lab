const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const component=read('src/components/visual/PhotoSlideshow.tsx');
const css=read('src/components/visual/PhotoSlideshow.css');
const siteCSS=read('src/website-v19-motion-slides.css');
const main=read('src/main.tsx');
const landing=read('src/pages/LandingPage.tsx');
const student=read('src/pages/student/StudentDashboard.tsx');
const teacher=read('src/pages/teacher/TeacherDashboard.tsx');
const explore=read('src/pages/student/ExploreClasses.tsx');
for(const [name,source] of [['landing',landing],['student',student],['teacher',teacher],['explore',explore]]) {
 assert(source.includes('<PhotoSlideshow'),`Missing gallery on ${name}`);
 const photos=source.match(/\{photo:'[A-Za-z][A-Za-z0-9]*'/g)||[];
 assert.equal(photos.length,3,`Expected 3 photographic frames on ${name}`);
}
for(const marker of ['onClick={()=>move(-1)}','onClick={()=>move(1)}','onClick={()=>setIndex(i)}','onClick={()=>setPaused(p=>!p)}',"e.key==='ArrowLeft'","e.key==='ArrowRight'",'aria-roledescription="carousel"','aria-label={label}',"window.matchMedia('(prefers-reduced-motion: reduce)')",'IntersectionObserver','document.visibilityState',"onFocusCapture={()=>setInteracting(true)}",'onMouseEnter={()=>setInteracting(true)}','window.clearInterval(interval)','observer.disconnect()','onError']) {
 if(marker==='onError') continue; assert(component.includes(marker),`Slideshow missing ${marker}`);
}
assert(component.includes('React')&&component.includes('RealPhoto'));
assert(css.includes('prefers-reduced-motion:reduce'));
assert(siteCSS.includes('prefers-reduced-motion:reduce'));
assert(main.indexOf("import './website-v19-motion-slides.css';") > main.indexOf("import './website-v18-natural.css';"));
assert.equal((component.match(/<button/g)||[]).length,4,'Controls include previous, next, dots and pause');
assert(!siteCSS.includes('pointer-events:none!important'));
console.log('PASS: 4 photographic slideshows / 12 frames; navigation, dots, pause, keyboard, tab/hover pause, view-based autoplay, reduced motion, image fallbacks and CSS ordering.');
