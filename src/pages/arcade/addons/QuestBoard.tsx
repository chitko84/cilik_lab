import {translatePair} from '../../../locales/contentTranslations';
import React from 'react';
import {ArrowRight,ChevronLeft,Star,Trophy,CheckCircle2,Sparkles,Compass} from 'lucide-react';
import {useLanguage} from '../../../context/LanguageContext';
import {useLearningExtras} from '../../../hooks/useLearningExtras';
import type {ArcadeGame} from './AdventureExtras';
import {WORLDS} from './AdventureExtras';
import {RESCUE_LEVELS,rescueMeta} from './robotRescueEngine';
import './questBoard.css';
const tr=translatePair;
type Quest={id:string;icon:string;name:{ms:string;en:string};desc:{ms:string;en:string};amount:number;target:number;world:ArcadeGame;status:{ms:string;en:string};};
export function QuestBoard({onBack,onGame,onCreator,onWorld}:{onBack:()=>void;onGame:(game:ArcadeGame,level:number)=>void;onCreator:()=>void;onWorld:()=>void}){
 const {language,locale}=useLanguage(),{progress,total}=useLearningExtras();
 const complete=progress.completed||[];const rescue=complete.filter(id=>id.startsWith('rescue-')).length;
 const activeWorlds=WORLDS.filter(w=>w.ids.some(id=>complete.includes(id))).length;
 const petsRescued=RESCUE_LEVELS.filter(l=>complete.includes(l.id)).reduce((sum,l)=>sum+rescueMeta(l).pets.length,0);
 const quests:Quest[]=[
  {id:'first-rescue',icon:'🐾',name:{ms:'Penyelamat Pertama',en:'First Rescue'},desc:{ms:'Selesaikan misi Robot Rescue pertama.',en:'Complete the first Robot Rescue mission.'},amount:Number(complete.includes('rescue-1')),target:1,world:'rescue',status:{ms:'Main Robot Rescue',en:'Play Robot Rescue'}},
  {id:'help-animals',icon:'🐶',name:{ms:'Sahabat Haiwan',en:'Animal Friend'},desc:{ms:'Selamatkan sekurang-kurangnya 3 haiwan.',en:'Rescue at least three pets.'},amount:petsRescued,target:3,world:'rescue',status:{ms:'Selamatkan haiwan',en:'Rescue pets'}},
  {id:'three-worlds',icon:'🧭',name:{ms:'Penjelajah Dunia',en:'World Explorer'},desc:{ms:'Selesaikan cabaran dalam 3 permainan berbeza.',en:'Complete challenges in three different games.'},amount:activeWorlds,target:3,world:'maze',status:{ms:'Teroka permainan',en:'Explore games'}},
  {id:'code-hero',icon:'⌨️',name:{ms:'Wira Pergerakan',en:'Movement Hero'},desc:{ms:'Selesaikan satu misi pergerakan Space Escape atau Robot Rescue.',en:'Complete a movement mission in Space Escape or Robot Rescue.'},amount:Number(complete.some(id=>id.startsWith('escape-')||id.startsWith('rescue-'))),target:1,world:'escape',status:{ms:'Tulis kod',en:'Write code'}},
  {id:'five-levels',icon:'⭐',name:{ms:'Bintang Pembelajaran',en:'Learning Star'},desc:{ms:'Selesaikan 5 cabaran Arcade.',en:'Complete five Arcade challenges.'},amount:complete.filter(id=>WORLDS.some(w=>w.ids.some(x=>x===id))).length,target:5,world:'maze',status:{ms:'Main lagi',en:'Play more'}},
  {id:'maze-maker',icon:'🛠️',name:{ms:'Pencipta Kreatif',en:'Creative Builder'},desc:{ms:'Cipta dan simpan satu labirin sendiri.',en:'Create and save a custom maze.'},amount:Math.max((progress.customMazes||[]).length,Number((progress.events||[]).some(e=>e.kind==='create'))),target:1,world:'maze',status:{ms:'Cipta labirin',en:'Build a maze'}},
 ];
 const achieved=quests.filter(q=>q.amount>=q.target).length;
 return <div className="quest-root"><button onClick={onBack} className="quest-back"><ChevronLeft size={18}/>{tr('Kembali ke Arcade','Back to Arcade',locale)}</button>
  <header className="quest-hero"><div><span className="quest-kicker"><Sparkles size={15}/>{tr('PEMBELAJARAN BERGANJARAN','REWARDING LEARNING',locale)}</span><h1>{tr('Papan Misi Cilik','My Quest Board',locale)}</h1><p>{tr('Lengkapkan misi sebenar, kumpul pelekat dan lihat kemajuan kamu!','Complete real adventures, collect stickers, and see how far you have come!',locale)}</p><div className="quest-hero-tags"><span>⭐ {total} XP</span><span>🏅 {achieved}/{quests.length} {tr('misi selesai','quests done',locale)}</span></div></div><div className="quest-illustration" aria-hidden="true"><span>🌟</span><span>🤖</span><span>🧩</span></div></header>
  <div className="quest-intro"><div><h2>{tr('Pilih misi seterusnya','Choose your next mission',locale)}</h2><p>{tr('Pelekat terbuka automatik apabila kamu bermain. Tiada mata palsu atau ganjaran berulang.','Stickers unlock automatically when you play. No fake points or repeat rewards.',locale)}</p></div><div className="quest-counter"><Trophy size={23}/>{achieved}/{quests.length}</div></div>
  <section className="quest-grid" aria-label={tr('Senarai misi','Quest list',locale)}>{quests.map((q,i)=>{const done=q.amount>=q.target;return <article className={`quest-card ${done?'unlocked':''}`} key={q.id}><div className="quest-card-top"><div className="quest-card-icon">{q.icon}</div><span className="quest-index">{String(i+1).padStart(2,'0')}</span></div><h3>{q.name[language]}</h3><p>{q.desc[language]}</p><div className="quest-progress-row"><span>{tr('Kemajuan','Progress',locale)}</span><strong>{Math.min(q.amount,q.target)}/{q.target}</strong></div><div className="quest-track"><span style={{width:`${Math.min(100,(q.amount/q.target)*100)}%`}}/></div>{done?<div className="quest-complete"><CheckCircle2 size={17}/>{tr('Pelekat berjaya dibuka!','Sticker unlocked!',locale)}</div>:<button className="quest-action" onClick={()=>q.id==='maze-maker'?onCreator():q.id==='three-worlds'?onWorld():onGame(q.world,Math.max(0,WORLDS.find(w=>w.id===q.world)?.ids.findIndex(id=>!complete.includes(id))??0))}>{q.status[language]} <ArrowRight size={17}/></button>}</article>})}</section>
  <footer className="quest-footer"><Compass size={20}/><p>{tr('Semua kemajuan disimpan dalam pelayar ini bersama rekod Arcade yang sedia ada.','All progress is kept in this browser alongside your existing Arcade scores.',locale)}</p></footer>
 </div>;
}
