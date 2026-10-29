import {useEffect} from 'react';
import {useApp} from '../../context/AppContext';
/** Progressive enhancement: never hides content unless IntersectionObserver exists.
 * Only site presentation blocks animate, not coding editors or Arcade game controls.
 */
export function PremiumMotion(){
 const {activeTab}=useApp();
 useEffect(()=>{
   if(typeof window==='undefined'||!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
   const targets=Array.from(document.querySelectorAll<HTMLElement>(
     '.premium-landing main > section, .premium-page-enter > div > section, .premium-page-enter .premium-dashboard-hero, .premium-page-enter .premium-learning-ribbon, .premium-page-enter .premium-teacher-feature, .premium-page-enter .premium-discovery-grid'
   ));
   const observer=new IntersectionObserver(entries=>{
     entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('cilik-in-view');observer.unobserve(entry.target);}});
   },{threshold:0.08,rootMargin:'0px 0px 32px 0px'});
   targets.forEach(target=>{target.classList.add('cilik-reveal');observer.observe(target);});
   document.documentElement.classList.add('cilik-motion-active');
   return()=>{observer.disconnect();targets.forEach(target=>target.classList.remove('cilik-reveal','cilik-in-view'));document.documentElement.classList.remove('cilik-motion-active');};
 },[activeTab]);
 return null;
}
