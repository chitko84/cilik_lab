import React, {useState} from 'react';

/**
 * Editorial photographs are Pexels-licensed images loaded on demand from its image CDN.
 * Source pages and credits: CILIKLAB_V24_PHOTOGRAPHY_SOURCES.md (plus prior photo credits).
 * Images depict illustrative learning situations, not actual CilikLab users.
 * Every image has a local visual fallback if the network or CDN is unavailable.
 */
export const PHOTO_LIBRARY = {
  childLearning: 'https://images.pexels.com/photos/4145041/pexels-photo-4145041.jpeg?auto=compress&cs=tinysrgb&w=1200',
  classTogether: 'https://images.pexels.com/photos/5212687/pexels-photo-5212687.jpeg?auto=compress&cs=tinysrgb&w=1100',
  youngLearner: 'https://images.pexels.com/photos/11025020/pexels-photo-11025020.jpeg?auto=compress&cs=tinysrgb&w=960',
  collaboration: 'https://images.pexels.com/photos/5896684/pexels-photo-5896684.jpeg?auto=compress&cs=tinysrgb&w=1000',
  teacherGuidance: 'https://images.pexels.com/photos/7742822/pexels-photo-7742822.jpeg?auto=compress&cs=tinysrgb&w=1200',
  codingTogether: 'https://images.pexels.com/photos/11025029/pexels-photo-11025029.jpeg?auto=compress&cs=tinysrgb&w=1000',
  studyGroup: 'https://images.pexels.com/photos/8199761/pexels-photo-8199761.jpeg?auto=compress&cs=tinysrgb&w=1200',
  learningAtHome: 'https://images.pexels.com/photos/7014765/pexels-photo-7014765.jpeg?auto=compress&cs=tinysrgb&w=960',
  realComputerLab: 'https://images.pexels.com/photos/32394664/pexels-photo-32394664.jpeg?auto=compress&cs=tinysrgb&w=1100',
  classLaptop: 'https://images.pexels.com/photos/7742816/pexels-photo-7742816.jpeg?auto=compress&cs=tinysrgb&w=1100',
  teacherSupport: 'https://images.pexels.com/photos/8199610/pexels-photo-8199610.jpeg?auto=compress&cs=tinysrgb&w=1100',
  learningTogether: 'https://images.pexels.com/photos/7742823/pexels-photo-7742823.jpeg?auto=compress&cs=tinysrgb&w=1100',
  collaborativeComputers: 'https://images.pexels.com/photos/5621933/pexels-photo-5621933.jpeg?auto=compress&cs=tinysrgb&w=1100',
  guidedCoding: 'https://images.pexels.com/photos/7742820/pexels-photo-7742820.jpeg?auto=compress&cs=tinysrgb&w=1100',
  // v24 curated documentary-style learning images. Each matching Pexels source page
  // was checked for its free Pexels license; photographs are illustrative stock imagery.
  groupInstruction: 'https://images.pexels.com/photos/5621952/pexels-photo-5621952.jpeg?auto=compress&cs=tinysrgb&w=1200',
  childrenITClass: 'https://images.pexels.com/photos/5621936/pexels-photo-5621936.jpeg?auto=compress&cs=tinysrgb&w=1200',
  modernComputerClass: 'https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg?auto=compress&cs=tinysrgb&w=1200',
  focusedLab: 'https://images.pexels.com/photos/10638070/pexels-photo-10638070.jpeg?auto=compress&cs=tinysrgb&w=1200',
  groupComputerActivity: 'https://images.pexels.com/photos/10638065/pexels-photo-10638065.jpeg?auto=compress&cs=tinysrgb&w=1200',
  educatorLaptop: 'https://images.pexels.com/photos/8423123/pexels-photo-8423123.jpeg?auto=compress&cs=tinysrgb&w=1200',
  homeStudy: 'https://images.pexels.com/photos/29545234/pexels-photo-29545234.jpeg?auto=compress&cs=tinysrgb&w=960',
  computerLearners: 'https://images.pexels.com/photos/5621938/pexels-photo-5621938.jpeg?auto=compress&cs=tinysrgb&w=1200',
  labPortrait: 'https://images.pexels.com/photos/10638082/pexels-photo-10638082.jpeg?auto=compress&cs=tinysrgb&w=960',
  // v26: newly source-verified Pexels documentary photographs (see photo credits).
  roboticsWorkshop: 'https://images.pexels.com/photos/7869085/pexels-photo-7869085.jpeg?auto=compress&cs=tinysrgb&w=1200',
  libraryReaders: 'https://images.pexels.com/photos/8926840/pexels-photo-8926840.jpeg?auto=compress&cs=tinysrgb&w=1100',
  learningPartners: 'https://images.pexels.com/photos/5212695/pexels-photo-5212695.jpeg?auto=compress&cs=tinysrgb&w=1200',
  interactiveClassroom: 'https://images.pexels.com/photos/7743256/pexels-photo-7743256.jpeg?auto=compress&cs=tinysrgb&w=1100',
  readingFocus: 'https://images.pexels.com/photos/8618017/pexels-photo-8618017.jpeg?auto=compress&cs=tinysrgb&w=900',
  independentStudy: 'https://images.pexels.com/photos/5303516/pexels-photo-5303516.jpeg?auto=compress&cs=tinysrgb&w=1100',
  // v27: seven new freely-licensed documentary Pexels photographs. Original images
  // remain intact. Attribution/source detail: CILIKLAB_V27_EDITORIAL_PHOTO_CREDITS.md.
  roboticsPartners: 'https://images.pexels.com/photos/7869230/pexels-photo-7869230.jpeg?auto=compress&cs=tinysrgb&w=1200',
  mentoringMoment: 'https://images.pexels.com/photos/5905921/pexels-photo-5905921.jpeg?auto=compress&cs=tinysrgb&w=1100',
  libraryMentor: 'https://images.pexels.com/photos/8342417/pexels-photo-8342417.jpeg?auto=compress&cs=tinysrgb&w=900',
  tabletClass: 'https://images.pexels.com/photos/5306431/pexels-photo-5306431.jpeg?auto=compress&cs=tinysrgb&w=1200',
  homeLearningDesk: 'https://images.pexels.com/photos/7695204/pexels-photo-7695204.jpeg?auto=compress&cs=tinysrgb&w=1100',
  readingCircle: 'https://images.pexels.com/photos/36859095/pexels-photo-36859095.jpeg?auto=compress&cs=tinysrgb&w=1200',
  studyFriends: 'https://images.pexels.com/photos/36812623/pexels-photo-36812623.jpeg?auto=compress&cs=tinysrgb&w=1100',
} as const;

export type PhotoKey = keyof typeof PHOTO_LIBRARY;
export function RealPhoto({photo,alt,fallback='/visuals/coding-friends.webp',className='',loading='lazy'}:{
  photo:PhotoKey; alt:string; fallback?:string; className?:string; loading?:'lazy'|'eager';
}){
  const [failed,setFailed]=useState(false);
  const photoUrl=PHOTO_LIBRARY[photo];
  const variants=[480,800,1200].map(width=>`${photoUrl.replace(/w=\d+/,`w=${width}`)} ${width}w`).join(', ');
  return <img src={failed?fallback:photoUrl} srcSet={failed?undefined:variants} sizes="(max-width:640px) 100vw, (max-width:1024px) 60vw, 45vw"
    alt={alt} className={className} loading={loading}
    decoding="async" referrerPolicy="no-referrer" fetchPriority={loading==='eager'?'high':undefined}
    onError={()=>setFailed(true)} />;
}
