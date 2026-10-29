// Verifies website-wide design integration and navigation wiring without pretending to be a browser test.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const app=read('src/App.tsx');
const entry=read('src/main.tsx');
assert(entry.includes("import './index.css';\nimport './website-premium.css'"),'Premium styles must load after core styles');
assert(app.includes('premium-page-enter'),'Page transitions should be applied');
const css=read('src/website-premium.css');
for(const section of ['premium-site-shell','premium-sidebar','premium-dashboard-hero','premium-landing','premium-discovery-grid','premium-teacher-feature','premium-learning-ribbon','premium-workspace-ribbon','premium-quick-overlay'])assert(css.includes(section),`Missing design layer ${section}`);
const quick=read('src/components/layout/QuickNavigator.tsx');
assert(quick.includes('window.addEventListener'),'Quick Find hotkey');
assert(quick.includes('onClick={()=>go(item.id)}'),'Quick Find navigation action');
assert(quick.includes("event.key==='Escape'"),'Quick Find keyboard dismissal');
const top=read('src/components/layout/TopBar.tsx');
assert(top.includes('<QuickNavigator />'),'Quick Find mounted');
const sidebar=read('src/components/layout/Sidebar.tsx');
assert(sidebar.includes('premium-side-nav'),'Premium sidebar mounted');
const dashboard=read('src/pages/student/StudentDashboard.tsx');
assert(dashboard.includes('WORLDS.length'),'Game count should be dynamic');
assert(dashboard.includes('premium-discovery-grid'),'Student discovery tiles');
assert(dashboard.includes('arcadeCompleted'),'Progress is calculated');
const landing=read('src/pages/LandingPage.tsx');
assert(landing.includes('premium-landing-image-grid'),'Landing image gallery');
assert(landing.includes('loginAs(\'teacher\')'),'Teacher CTA');
assert(landing.includes('loginAs(\'student\')'),'Student CTA');
for(const file of ['hero-adventure.webp','ciko-explorer.webp','coding-friends.webp','forest-adventure.webp','creative-pixels.webp']){
 const p=path.join(root,'public','visuals',file);assert(fs.existsSync(p)&&fs.statSync(p).size>5000,`Missing local art ${file}`);
}
for(const page of ['src/pages/student/ExploreClasses.tsx','src/pages/student/LessonsView.tsx','src/pages/comics/ComicLibrary.tsx'])assert(read(page).includes('premium-learning-ribbon'),`${page} should have a visual banner`);
assert(read('src/pages/coding/CodingWorkspace.tsx').includes('premium-workspace-ribbon'),'Workspace design upgraded');
console.log('PASS: global premium styles, role-aware quick navigation, actual-progress student tiles, 5 local visuals, page banners and interactive CTAs are wired.');
