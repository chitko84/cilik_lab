const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');
const photos=read('src/components/visual/RealPhoto.tsx');
const style=read('src/website-v24-photography.css');
const main=read('src/main.tsx');
const sourceFiles=[
 'src/pages/LandingPage.tsx',
 'src/pages/student/StudentDashboard.tsx',
 'src/pages/teacher/TeacherDashboard.tsx',
 'src/pages/student/ExploreClasses.tsx',
 'src/pages/student/LessonsView.tsx'
];
const added={
 groupInstruction:5621952,childrenITClass:5621936,modernComputerClass:10638075,
 focusedLab:10638070,groupComputerActivity:10638065,educatorLaptop:8423123,
 homeStudy:29545234,computerLearners:5621938,labPortrait:10638082
};
assert((photos.match(/https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-/g)||[]).length>=23);
for(const [name,id] of Object.entries(added)){
 assert(photos.includes(`${name}: 'https://images.pexels.com/photos/${id}/`),`Missing new image ${name}`);
 assert(sourceFiles.some(f=>read(f).includes(name)),`New photo ${name} not used in any website page`);
}
for(const [f,required] of [
 ['src/pages/LandingPage.tsx',['<PhotoSlideshow','groupInstruction','modernComputerClass','childrenITClass','homeStudy']],
 ['src/pages/student/StudentDashboard.tsx',['<PhotoSlideshow','learningPartners','groupComputerActivity']],
 ['src/pages/teacher/TeacherDashboard.tsx',['<PhotoSlideshow','roboticsWorkshop','educatorLaptop']],
 ['src/pages/student/ExploreClasses.tsx',['<PhotoSlideshow','v24-class-cover','focusedLab','labPortrait']],
 ['src/pages/student/LessonsView.tsx',['readingFocus']]
])for(const str of required)assert(read(f).includes(str),`Missing ${str} from ${f}`);
for(const selector of ['.premium-landing-discover','.cilik-photo-story','.premium-dashboard-photo','.premium-learning-ribbon','.v24-class-cover','@media(max-width:680px)','@media(prefers-reduced-motion:reduce)','[dir=rtl]'])assert(style.includes(selector),`Missing style ${selector}`);
assert(main.indexOf("import './website-v24-photography.css'")>main.indexOf("import './website-v23-studio.css'"),'v24 CSS should be last');
assert(photos.includes('onError={()=>setFailed(true)}'),'Broken-image fallback must remain');
assert(photos.includes('loading={loading}'),'Lazy loading must remain');
assert(read('index.html').includes('rel="preconnect" href="https://images.pexels.com"'),'Photo CDN preconnect missing');
console.log('PASS: original Pexels photo source coverage, class thumbnails, responsive image composition, fallback, RTL and reduced motion.');
