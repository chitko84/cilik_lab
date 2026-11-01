/**
 * CilikLab Operator DEMO. All records below are fictional samples and changes are
 * saved only in the current browser. No privileged API endpoints are called.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowRight, BookOpen, CalendarDays, CheckCircle2, ChevronRight,
  Clock3, GraduationCap, LifeBuoy, MessageSquare, Plus, RotateCcw,
  Search, ShieldCheck, SlidersHorizontal, Trash2, Users, X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { additionalStudents, additionalTeachers } from './operatorDemoPeople';
import { OperatorAnalytics } from './OperatorAnalytics';
import { createOperatorHistory } from './operatorActivityHistory';
import type { OperatorActivity } from './operatorActivityHistory';

export type DemoResource = 'students'|'teachers'|'classes'|'schedules'|'content'|'moderation'|'support';
export type DemoRecord = { id:string; name:string; details:string; status:string; category:string; owner:string; date:string };
type Records = Record<DemoResource, DemoRecord[]>;
type ActivityLog = OperatorActivity | { id:string; action:string; when:string; category?:string; actor?:string; createdAt?:string };
type DemoState = { records:Records; log:ActivityLog[]; seedVersion?:number };
const STORE = 'ciliklab_operator_browser_demo_v1';
const LABELS:Record<DemoResource,string> = {
  students:'Students', teachers:'Teachers', classes:'Classes & Enrollments',
  schedules:'Schedules & Meetings', content:'Learning Content',
  moderation:'Community Moderation', support:'Support Requests',
};
const STATUS:Record<DemoResource,string[]> = {
  students:['Active','Pending','Paused'], teachers:['Active','Pending','Paused'],
  classes:['Active','Planned','Completed'], schedules:['Scheduled','In Progress','Completed'],
  content:['Published','Draft','Coming Soon'], moderation:['Pending','Reviewed','Resolved'],
  support:['Open','In Progress','Resolved'],
};
const make=(id:string,name:string,details:string,status:string,category:string,owner:string,date='01 Nov 2026'):DemoRecord=>({id,name,details,status,category,owner,date});
const seed=():DemoState=>({records:{
  students:[make('s1','Aina Zulkifli','Level 2 · 14 lessons finished','Active','Python Explorer','Ms. Hana'),make('s2','Ben Tan','Level 3 · 22 lessons finished','Active','Code Adventurer','Mr. Razak'),make('s3','Mei Ling','Level 1 · 6 lessons finished','Active','New Learner','Ms. Hana'),make('s4','Ravi Kumar','Level 2 · 11 lessons finished','Pending','Coding Club','Mr. Razak'),make('s5','Sarah Ahmad','Level 4 · 28 lessons finished','Active','Young Developer','Ms. Hana'),...additionalStudents],
  teachers:[make('t1','Hana Abdullah','Python fundamentals and creative coding','Active','Programming','CilikLab'),make('t2','Razak Mansor','Algorithms and robotics projects','Active','Robotics','CilikLab'),make('t3','Nur Izzah','Beginner Java and C practice','Pending','Programming','CilikLab'),make('t4','Daniel Lim','Problem-solving challenges','Active','Computational Thinking','CilikLab'),...additionalTeachers],
  classes:[make('c1','Python Explorers','12 learners enrolled · beginner class','Active','Python','Ms. Hana'),make('c2','Young Robot Engineers','8 learners enrolled · RoboLab','Active','Robotics','Mr. Razak'),make('c3','Coding Adventures','16 learners enrolled · intermediate','Active','Python','Ms. Hana'),make('c4','Java Jumpstart','New course · preparing materials','Planned','Java','Ms. Nur')],
  schedules:[make('m1','Python Explorers Live Room','Coding basics · 10:00 AM','Scheduled','Classroom','Ms. Hana','04 Nov 2026'),make('m2','RoboLab Mission Review','Robot programming · 2:30 PM','Scheduled','Live Meeting','Mr. Razak','06 Nov 2026'),make('m3','Teacher Coordination','Weekly planning · 9:00 AM','Completed','Staff Meeting','CilikLab Team','29 Oct 2026')],
  content:[make('l1','Ciko and the Lost Loop','English and Bahasa Melayu editions','Published','ComicCode','Content Team'),make('l2','The Variable Treasure Hunt','English and Bahasa Melayu editions','Published','ComicCode','Content Team'),make('l3','If-Else in the Jungle','English and Bahasa Melayu editions','Published','ComicCode','Content Team'),make('l4','The Function Factory','English and Malay editions in preparation','Coming Soon','ComicCode','Content Team'),make('l5','RoboLab 3D','40 missions · 8 worlds','Published','Arcade','Game Team'),make('l6','Daily Coding Challenge','Python, C and Java','Published','Practice','Academic Team')],
  moderation:[make('r1','Community photo review','Example image report submitted by a learner','Pending','Post Report','Moderation Team'),make('r2','Duplicate discussion','Example duplicate topic flagged','Reviewed','Community','Moderation Team')],
  support:[make('q1','Help joining a class','Demo request: enrollment assistance','Open','Student Request','Support Team'),make('q2','Meeting camera question','Demo request: unable to preview camera','In Progress','Technical Help','Support Team'),make('q3','Reset coding draft','Demo request: restore starter code','Resolved','Learning Help','Support Team')],
},log:createOperatorHistory(),seedVersion:3});
const isResource=(p:string):p is DemoResource => Object.prototype.hasOwnProperty.call(LABELS,p);
const pageToResource=(p:string)=>p.startsWith('op_')?p.slice(3):'';
const panel='bg-white border border-slate-200 rounded-2xl shadow-sm';
const badge=(status:string)=>{
  const s=status.toLowerCase();
  if(['active','published','completed','resolved','reviewed'].includes(s)) return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  if(['paused','pending','open'].includes(s)) return 'bg-amber-50 text-amber-700 ring-amber-200';
  return 'bg-sky-50 text-sky-700 ring-sky-200';
};
const loadDemo=():DemoState=>{
  try {
    const raw=localStorage.getItem(STORE); if(!raw)return seed();
    const data=JSON.parse(raw) as DemoState;
    if(!data.records||!data.log||Object.keys(LABELS).some(k=>!Array.isArray(data.records[k as DemoResource])))return seed();
    // Add new sample people to previously saved demos without overwriting edited/deleted records.
    let upgraded=data;
    if((upgraded.seedVersion??1)<2){
      const append=(current:DemoRecord[],extra:DemoRecord[])=>[...current,...extra.filter(person=>!current.some(row=>row.id===person.id))];
      upgraded={...upgraded,seedVersion:2,records:{...upgraded.records,students:append(upgraded.records.students,additionalStudents),teachers:append(upgraded.records.teachers,additionalTeachers)}};
    }
    if((upgraded.seedVersion??1)<3){
      const known=new Set(upgraded.log.map(row=>row.id));
      upgraded={...upgraded,seedVersion:3,log:[...upgraded.log.filter(row=>row.id!=='seed'),...createOperatorHistory().filter(row=>!known.has(row.id))].slice(0,300)};
    }
    return upgraded;
  }catch{return seed();}
};

export function OperatorDemoView({page}:{page:string}) {
  const {setActiveTab}=useApp();
  const [data,setData]=useState<DemoState>(loadDemo);
  const [query,setQuery]=useState('');
  const [filter,setFilter]=useState('All');
  const [editing,setEditing]=useState<DemoRecord|null>(null);
  const [isNew,setIsNew]=useState(false);
  const [confirmReset,setConfirmReset]=useState(false);
  const [activityQuery,setActivityQuery]=useState('');
  const [activityCategory,setActivityCategory]=useState('All');
  const [activityPeriod,setActivityPeriod]=useState('All');
  const [activityPage,setActivityPage]=useState(1);
  useEffect(()=>{try{localStorage.setItem(STORE,JSON.stringify(data));}catch{/* storage disabled */}},[data]);
  useEffect(()=>{setQuery('');setFilter('All');setEditing(null);setIsNew(false)},[page]);
  const go=(path:string)=>setActiveTab(path);
  const log=(action:string,category:string):ActivityLog=>({id:`log-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,action,category,actor:'Operator',createdAt:new Date().toISOString(),when:new Date().toLocaleString()});
  const update=(resource:DemoResource,row:DemoRecord,create=false)=>{
    setData(old=>({...old,records:{...old.records,[resource]:create?[...old.records[resource],row]:old.records[resource].map(x=>x.id===row.id?row:x)},log:[log(`${create?'Added':'Updated'} ${resource.slice(0,-1)}: ${row.name}`,LABELS[resource]),...old.log].slice(0,300)}));
    setEditing(null);setIsNew(false);
  };
  const remove=(resource:DemoResource,row:DemoRecord)=>{
    if(!window.confirm(`Delete the sample record for ${row.name}?`))return;
    setData(old=>({...old,records:{...old.records,[resource]:old.records[resource].filter(x=>x.id!==row.id)},log:[log(`Removed ${resource.slice(0,-1)} record: ${row.name}`,LABELS[resource]),...old.log].slice(0,300)}));
  };
  const reset=()=>{setData(seed());setConfirmReset(false);};
  const counts=Object.fromEntries(Object.keys(LABELS).map(k=>[k,data.records[k as DemoResource].length])) as Record<DemoResource,number>;
  const pending=data.records.support.filter(x=>x.status!=='Resolved').length+data.records.moderation.filter(x=>x.status==='Pending').length;
  const resourceName=pageToResource(page);
  const resource=isResource(resourceName)?resourceName:null;
  const header=(title:string,description:string)=> <div className="flex flex-wrap items-start justify-between gap-4 mb-6"><div><div className="flex items-center gap-2 text-xs font-extrabold text-teal-700 uppercase tracking-[.14em]"><ShieldCheck size={15}/> CilikLab Operator · Demo</div><h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{title}</h1><p className="text-sm text-slate-500 mt-2 max-w-2xl">{description}</p></div>{page!=='op_activity'&&<div className="rounded-full border border-amber-200 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-2">Sample data only</div>}</div>;
  const metrics=[
    {id:'op_students',label:'Students',value:counts.students,icon:GraduationCap,accent:'from-sky-50 to-blue-50',fg:'text-sky-700'},
    {id:'op_teachers',label:'Teachers',value:counts.teachers,icon:Users,accent:'from-violet-50 to-indigo-50',fg:'text-indigo-700'},
    {id:'op_classes',label:'Classes',value:counts.classes,icon:BookOpen,accent:'from-emerald-50 to-teal-50',fg:'text-teal-700'},
    {id:'op_support',label:'Needs attention',value:pending,icon:LifeBuoy,accent:'from-amber-50 to-orange-50',fg:'text-amber-700'},
  ];
  const card=(title:string,description:string,to:string,Icon:typeof Users)=> <button key={to} onClick={()=>go(to)} className={`${panel} text-left p-5 hover:border-teal-300 hover:shadow-md transition-all group`}><span className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center"><Icon size={20}/></span><strong className="block mt-4 text-sm text-slate-900">{title}</strong><span className="block text-xs text-slate-500 mt-1 leading-5">{description}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 mt-4">Open area <ChevronRight size={14}/></span></button>;
  if(page==='op_dashboard'||!page.startsWith('op_'))return <div className="max-w-6xl mx-auto">
    {header('Operator Dashboard','See how the CilikLab demo works for learners, educators, classes and platform operations — without sign-in or server configuration.')}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">{metrics.map(m=><button key={m.id} onClick={()=>go(m.id)} className={`${panel} bg-gradient-to-br ${m.accent} p-5 text-left hover:shadow-md transition-shadow`}><m.icon className={m.fg} size={22}/><strong className="block text-3xl font-extrabold text-slate-900 mt-3 tabular-nums">{m.value}</strong><span className="text-sm text-slate-600">{m.label}</span></button>)}</div>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
      {card('Manage Students','View sample learners, details and statuses.','op_students',GraduationCap)}
      {card('Manage Teachers','Explore educator profiles and class assignments.','op_teachers',Users)}
      {card('Classes & Schedules','Review sample classes, enrollment and meetings.','op_classes',CalendarDays)}
      {card('Learning Content','Review published comics, challenges and games.','op_content',BookOpen)}
      {card('Moderation & Support','Handle fictional cases and update statuses.','op_support',LifeBuoy)}
      {card('Reports & Analytics','View charts based on the sample records.','op_analytics',Activity)}
    </div>
    <div className={`${panel} p-5`}><div className="flex justify-between items-center mb-4"><h2 className="text-base font-bold text-slate-900">Recent activity</h2><button className="text-teal-700 text-xs font-bold" onClick={()=>go('op_activity')}>See all <ArrowRight size={13} className="inline"/></button></div>{data.log.slice(0,4).map(item=><div className="flex justify-between items-start gap-3 py-2 border-b last:border-0 border-slate-100" key={item.id}><span className="text-sm text-slate-700">{item.action}</span><time className="text-xs text-slate-400 shrink-0">{item.when}</time></div>)}</div>
  </div>;
  if(resource){
    const records=data.records[resource].filter(row=>(filter==='All'||row.status===filter)&&`${row.name} ${row.details} ${row.status} ${row.owner} ${row.category}`.toLowerCase().includes(query.toLowerCase()));
    return <div className="max-w-6xl mx-auto">{header(LABELS[resource],`Browse and edit fictional ${LABELS[resource].toLowerCase()} records. All updates are local preview data.`)}
      <div className={`${panel} overflow-hidden`}><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-slate-100"><div className="flex items-center gap-2 text-slate-700 text-sm font-semibold"><SlidersHorizontal size={17}/>{data.records[resource].length} demo records</div><button onClick={()=>{setIsNew(true);setEditing(make(`demo-${Date.now()}`,'','',''+STATUS[resource][0],'General','Operator Demo'))}} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl"><Plus size={16}/> Add demo record</button></div>
      <div className="flex gap-3 p-4 flex-col sm:flex-row"><label className="relative grow"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input aria-label="Search demo records" value={query} onChange={e=>setQuery(e.target.value)} className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm" placeholder="Search sample records..." /></label><select aria-label="Filter by status" value={filter} onChange={e=>setFilter(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm"><option>All</option>{STATUS[resource].map(s=><option key={s}>{s}</option>)}</select></div>
      <div className="divide-y divide-slate-100">{records.length?records.map(row=><div key={row.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 hover:bg-slate-50/60"><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 items-center"><strong className="text-sm text-slate-900">{row.name}</strong><span className={`rounded-full ring-1 px-2 py-1 text-[10px] font-bold ${badge(row.status)}`}>{row.status}</span></div><p className="text-xs text-slate-600 mt-1">{row.details}</p><div className="text-[11px] text-slate-400 mt-2">{row.category} · {row.owner} · {row.date}</div></div><div className="flex items-center gap-2"><button onClick={()=>{setEditing({...row});setIsNew(false)}} className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:border-teal-500">Edit</button><button onClick={()=>remove(resource,row)} className="border border-slate-200 rounded-lg p-2 text-rose-600 hover:border-rose-300" aria-label={`Delete ${row.name}`}><Trash2 size={16}/></button></div></div>):<p className="p-7 text-center text-sm text-slate-500">No sample records match your search or filter.</p>}</div></div>
      {editing&&<div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setEditing(null)}}><form onSubmit={e=>{e.preventDefault();if(!editing.name.trim())return;update(resource,{...editing,name:editing.name.trim()},isNew)}} className="w-full max-w-xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6"><div className="flex justify-between items-center mb-4"><div><h3 className="text-lg font-bold text-slate-900">{isNew?'Add':'Edit'} sample record</h3><p className="text-xs text-slate-500">Demo only · Not connected to accounts</p></div><button type="button" aria-label="Close editor" onClick={()=>setEditing(null)}><X size={20}/></button></div><div className="grid sm:grid-cols-2 gap-3">{(['name','details','category','owner','date'] as const).map(key=><label key={key} className={key==='details'?'sm:col-span-2':''}><span className="block mb-1 text-xs font-bold text-slate-600 capitalize">{key}</span><input required={key==='name'} value={editing[key]} onChange={e=>setEditing({...editing,[key]:e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm"/></label>)}<label><span className="block mb-1 text-xs font-bold text-slate-600">Status</span><select value={editing.status} onChange={e=>setEditing({...editing,status:e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm">{STATUS[resource].map(s=><option key={s}>{s}</option>)}</select></label></div><div className="flex justify-end gap-2 mt-6"><button type="button" onClick={()=>setEditing(null)} className="border rounded-lg px-4 py-2 text-sm">Cancel</button><button type="submit" className="bg-teal-700 text-white rounded-lg px-4 py-2 text-sm font-bold">Save demo record</button></div></form></div>}
    </div>;
  }
  if(page==='op_accounts') return <div className="max-w-6xl mx-auto">{header('Account Overview','A demonstration of learner and educator record management; not a real authentication or login system.')}<div className="grid sm:grid-cols-2 gap-4">{card(`${counts.students} Student records`,'Browse example student profiles and statuses.','op_students',GraduationCap)}{card(`${counts.teachers} Teacher records`,'Browse example teacher profiles and statuses.','op_teachers',Users)}</div><div className={`${panel} p-5 mt-4 text-sm text-slate-600`}><strong className="text-slate-900">Demo limitation:</strong> Changing a status here never blocks a real account, grants permissions or sends notifications.</div></div>;
  if(page==='op_analytics')return <div className="max-w-6xl mx-auto">{header('Reports & Analytics','Visual summaries of the sample students, teachers, classes and other platform records.')}<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">{metrics.map(m=><div key={m.id} className={`${panel} p-5`}><m.icon className={m.fg} size={22}/><div className="text-3xl font-bold mt-3 tabular-nums">{m.value}</div><div className="text-sm text-slate-500">{m.label}</div></div>)}</div><OperatorAnalytics records={data.records}/></div>;
  if(page==='op_activity'){
    const normalized=activityQuery.trim().toLowerCase();
    const activityRecords=data.log.filter(row=>{
      if(activityCategory!=='All' && row.category!==activityCategory)return false;
      if(normalized&&!`${row.action} ${row.actor||''} ${row.category||''}`.toLowerCase().includes(normalized))return false;
      if(activityPeriod!=='All'){
        const millis=row.createdAt?new Date(row.createdAt).getTime():NaN;
        const days=Number(activityPeriod);
        // For the browser-only demo, use 1 Nov 2026 as the reference for the historical timeline.
        const reference=Math.max(Date.UTC(2026,10,1,23,59),Date.now());
        if(!Number.isFinite(millis)||millis<reference-days*86400000)return false;
      }
      return true;
    });
    const pageSize=15;
    const pages=Math.max(1,Math.ceil(activityRecords.length/pageSize));
    const current=Math.min(activityPage,pages);
    const visible=activityRecords.slice((current-1)*pageSize,current*pageSize);
    const changeFilters=()=>setActivityPage(1);
    return <div className="max-w-6xl mx-auto">{header('Activity Log','Recent platform operations, learning activities, and account updates.')}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">{[
        ['Total entries',data.log.length],['Student actions',data.log.filter(x=>x.category==='Students').length],
        ['Academic updates',data.log.filter(x=>['Classes','Schedules','Teachers'].includes(x.category||'')).length],
        ['Support and moderation',data.log.filter(x=>['Support','Moderation'].includes(x.category||'')).length],
      ].map(([label,value])=><div className={`${panel} p-4`} key={label}><div className="text-2xl font-extrabold text-slate-900 tabular-nums">{value}</div><div className="text-xs text-slate-500 mt-1">{label}</div></div>)}</div>
      <div className={`${panel} overflow-hidden`}>
        <div className="flex flex-col lg:flex-row gap-3 p-4 border-b border-slate-100">
          <label className="relative grow"><Search size={16} className="absolute top-3 left-3 text-slate-400"/><input aria-label="Search activity log" placeholder="Search activity, learner, or operator..." className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm" value={activityQuery} onChange={e=>{setActivityQuery(e.target.value);changeFilters()}}/></label>
          <select aria-label="Filter activity category" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm" value={activityCategory} onChange={e=>{setActivityCategory(e.target.value);changeFilters()}}>{['All','Students','Teachers','Classes','Schedules','Content','Support','Moderation'].map(c=><option value={c} key={c}>{c==='All'?'All categories':c}</option>)}</select>
          <select aria-label="Filter activity date" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm" value={activityPeriod} onChange={e=>{setActivityPeriod(e.target.value);changeFilters()}}><option value="All">All dates</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select>
        </div>
        <div className="divide-y divide-slate-100">{visible.length?visible.map(row=><div key={row.id} className="p-4 sm:px-5 flex flex-col sm:flex-row sm:justify-between gap-3 hover:bg-slate-50/60"><div className="flex items-start gap-3"><span className="rounded-xl bg-teal-50 text-teal-700 p-2"><Activity size={17}/></span><div><div className="text-sm font-semibold text-slate-800">{row.action}</div><div className="flex items-center flex-wrap gap-2 mt-1"><span className="text-[11px] font-bold text-teal-700">{row.category||'Operations'}</span><span className="text-[11px] text-slate-400">· {row.actor||'Operator'}</span></div></div></div><time className="text-xs text-slate-500 shrink-0 sm:text-right">{row.when}</time></div>):<p className="text-sm text-slate-500 text-center py-10">No activity matches your filters.</p>}</div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100"><span className="text-xs text-slate-500">{activityRecords.length?`${(current-1)*pageSize+1}–${Math.min(current*pageSize,activityRecords.length)} of ${activityRecords.length} activities`:'0 activities'}</span><div className="flex items-center gap-2"><button className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-40" disabled={current<=1} onClick={()=>setActivityPage(Math.max(1,current-1))}>Previous</button><span className="text-xs text-slate-500 px-1">Page {current} of {pages}</span><button className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-40" disabled={current>=pages} onClick={()=>setActivityPage(Math.min(pages,current+1))}>Next</button></div></div>
      </div>
    </div>;
  }
  if(page==='op_settings')return <div className="max-w-3xl mx-auto">{header('Demo Settings','Manage only this browser-based Operator preview.')}<section className={`${panel} p-6`}><h2 className="font-bold text-slate-900">Reset sample operator data</h2><p className="text-sm text-slate-600 mt-2">Restores the example student, teacher, class, meeting, content, support and moderation records. Your real CilikLab data and RoboLab progress are not affected.</p>{confirmReset?<div className="mt-4 flex gap-2"><button onClick={reset} className="bg-rose-600 text-white rounded-lg px-4 py-2 text-sm font-bold">Confirm reset</button><button onClick={()=>setConfirmReset(false)} className="border border-slate-200 rounded-lg px-4 py-2 text-sm">Cancel</button></div>:<button onClick={()=>setConfirmReset(true)} className="inline-flex items-center gap-2 mt-4 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold"><RotateCcw size={16}/> Restore sample records</button>}</section></div>;
  if(page==='op_profile')return <div className="max-w-3xl mx-auto">{header('Operator Profile','A fictional operator identity used only to demonstrate the management interface.')}<section className={`${panel} p-6`}><div className="flex items-center gap-4"><div className="rounded-2xl bg-teal-50 text-teal-600 p-4"><ShieldCheck size={32}/></div><div><h2 className="font-bold text-slate-900 text-lg">CilikLab Demo Operator</h2><p className="text-sm text-slate-500">Sample role · No password required</p></div></div><div className="border-t border-slate-100 pt-4 mt-5 text-sm text-slate-600">This is an interactive product preview. It does not provide administrative privileges or access to real private data.</div></section></div>;
  return <div className="max-w-3xl mx-auto">{header('Operator Demo','Select an operator area from the sidebar.')}<button onClick={()=>go('op_dashboard')} className="bg-teal-700 text-white px-4 py-2 rounded-xl">Go to dashboard</button></div>;
}
