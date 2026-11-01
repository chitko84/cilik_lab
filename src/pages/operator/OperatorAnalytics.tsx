import React from 'react';

/** All charts are derived from browser-only Operator demo records, not live platform telemetry. */
type Section = 'students'|'teachers'|'classes'|'schedules'|'content'|'moderation'|'support';
type Row = { id:string; name:string; details:string; status:string; category:string; owner:string; date:string };
type ChartDatum = { label:string; value:number; color?:string };
const COLORS = ['#0d9488','#6366f1','#f59e0b','#38bdf8','#a855f7','#f43f5e','#16a34a','#64748b'];
const card = 'rounded-2xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6 min-w-0';
const chartTitle = (title:string,subtitle:string) => <header className="mb-5"><h2 className="text-base font-extrabold text-slate-900">{title}</h2><p className="text-xs text-slate-500 mt-1 leading-5">{subtitle}</p></header>;
const sum=(items:ChartDatum[])=>items.reduce((a,b)=>a+b.value,0);
const occurrences=(rows:Row[],field:keyof Row,labels?:string[]):ChartDatum[]=>{
  const count=new Map<string,number>();
  for(const row of rows){const value=row[field]?.trim()||'Other';count.set(value,(count.get(value)||0)+1);}
  const all=labels||[...count.keys()].sort((a,b)=>(count.get(b)||0)-(count.get(a)||0));
  return all.map((label,index)=>({label,value:count.get(label)||0,color:COLORS[index%COLORS.length]}));
};
function Donut({title,subtitle,data}:{title:string;subtitle:string;data:ChartDatum[]}){
  const total=sum(data), radius=43,circumference=2*Math.PI*radius;
  let offset=0;
  return <section className={card} aria-label={title}>{chartTitle(title,subtitle)}
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6">
      <svg viewBox="0 0 120 120" role="img" aria-label={`${title}: ${data.map(d=>`${d.label} ${d.value}`).join(', ')}`} className="w-[152px] h-[152px] shrink-0">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="15"/>
        {total>0&&data.filter(d=>d.value>0).map((d,i)=>{const dash=d.value/total*circumference; const start=offset;offset+=dash;return <circle key={`${d.label}-${i}`} cx="60" cy="60" r={radius} fill="none" stroke={d.color||COLORS[i%COLORS.length]} strokeWidth="15" strokeDasharray={`${Math.max(0,dash-.9)} ${circumference}`} strokeDashoffset={-start} transform="rotate(-90 60 60)"/>;})}
        <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a">{total}</text>
        <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#64748b">total</text>
      </svg>
      <div className="w-full space-y-3 min-w-0">{data.map((d,i)=><div key={d.label} className="flex items-center gap-2 text-xs"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:d.color||COLORS[i%COLORS.length]}}/><span className="text-slate-600 grow min-w-0 truncate" title={d.label}>{d.label}</span><span className="font-bold text-slate-900 tabular-nums">{d.value}</span><span className="text-slate-400 tabular-nums w-9 text-right">{total?Math.round(d.value/total*100):0}%</span></div>)}</div>
    </div>
  </section>;
}
function Bars({title,subtitle,data}:{title:string;subtitle:string;data:ChartDatum[]}){
  const max=Math.max(1,...data.map(d=>d.value));
  return <section className={card} aria-label={title}>{chartTitle(title,subtitle)}
    <div className="space-y-4">{data.map((d,i)=><div key={d.label} className="space-y-1.5"><div className="flex items-center justify-between gap-2 text-xs"><span className="text-slate-600 truncate" title={d.label}>{d.label}</span><span className="font-bold text-slate-800 tabular-nums">{d.value}</span></div><div className="h-2.5 bg-slate-100 rounded-full overflow-hidden" role="img" aria-label={`${d.label}: ${d.value}`}><div className="h-full rounded-full transition-[width] duration-300" style={{width:`${d.value/max*100}%`,background:d.color||COLORS[i%COLORS.length]}}/></div></div>)}</div>
    {!data.length&&<div className="text-sm text-slate-500">No sample records yet.</div>}
  </section>;
}
function Columns({title,subtitle,data}:{title:string;subtitle:string;data:ChartDatum[]}){
  const max=Math.max(1,...data.map(d=>d.value));
  return <section className={card} aria-label={title}>{chartTitle(title,subtitle)}
    <div className="relative pt-4" role="img" aria-label={`${title}: ${data.map(d=>`${d.label} ${d.value}`).join(', ')}`}>
      <div className="absolute left-0 right-0 top-4 bottom-7 flex flex-col justify-between pointer-events-none" aria-hidden="true">{[1,.75,.5,.25,0].map(x=><div key={x} className="h-px border-t border-dashed border-slate-100"/>)}</div>
      <div className="relative flex items-end justify-around gap-2 h-[180px]">{data.map((d,i)=><div key={d.label} className="flex-1 min-w-0 h-full flex flex-col justify-end items-center gap-1 group" title={`${d.label}: ${d.value}`}><span className="text-[11px] font-bold tabular-nums text-slate-700">{d.value}</span><div className="w-full max-w-14 rounded-t-md min-h-0 transition-[height] duration-300" style={{height:`${d.value/max*145}px`,background:d.color||COLORS[i%COLORS.length]}}/></div>)}</div>
      <div className="flex justify-around gap-2 border-t border-slate-200 pt-2">{data.map(d=><span key={d.label} title={d.label} className="flex-1 text-[10px] sm:text-xs text-center text-slate-500 truncate">{d.label}</span>)}</div>
    </div>
  </section>;
}
const countBy=(rows:Row[],fn:(r:Row)=>string):ChartDatum[]=>{
  const map=new Map<string,number>();
  rows.forEach(row=>{const key=fn(row)||'Other';map.set(key,(map.get(key)||0)+1);});
  return [...map.entries()].sort((a,b)=>b[1]-a[1]).map(([label,value],i)=>({label,value,color:COLORS[i%COLORS.length]}));
};
const studentLevel=(row:Row)=>{const found=row.details.match(/\bLevel\s+(\d+)/i);return found?`Level ${found[1]}`:'Unspecified';};
const classSize=(row:Row)=>{const found=row.details.match(/(\d+)\s+learners?\s+enrolled/i);return found?Number(found[1]):0;};
export function OperatorAnalytics({records}:{records:Record<Section,Row[]>}){
  const students=records.students,teachers=records.teachers;
  const allResources:ChartDatum[] = ([['Students','students'],['Teachers','teachers'],['Classes','classes'],['Schedules','schedules'],['Content','content'],['Moderation','moderation'],['Support','support']] as [string,Section][])
    .map(([label,k],i)=>({label,value:records[k].length,color:COLORS[i]}));
  const levelCounts=countBy(students,studentLevel).sort((a,b)=>Number(a.label.match(/\d+/)?.[0]||99)-Number(b.label.match(/\d+/)?.[0]||99));
  const tracks=countBy(students,r=>r.category);
  const teacherSpecialties=countBy(teachers,r=>r.category);
  const classes=records.classes.map((r,i)=>({label:r.name,value:classSize(r),color:COLORS[i%COLORS.length]}));
  const needsAttention=[...records.support,...records.moderation].filter(r=>['Open','Pending','In Progress'].includes(r.status)).length;
  return <div className="space-y-5 pb-8">
    <div className="flex flex-wrap justify-between items-center gap-2"><h2 className="text-lg font-extrabold text-slate-900">Analytics overview</h2><span className="text-xs text-slate-500">Charts update as you edit sample records</span></div>
    <div className="grid lg:grid-cols-2 gap-4">
      <Donut title="Student account status" subtitle="Active, pending and paused learners" data={occurrences(students,'status',['Active','Pending','Paused'])}/>
      <Donut title="Teacher account status" subtitle="Educator directory by current status" data={occurrences(teachers,'status',['Active','Pending','Paused'])}/>
      <Bars title="Students by learning pathway" subtitle="Most popular learning tracks in the sample directory" data={tracks}/>
      <Columns title="Learners by level" subtitle="Level parsed from each student profile" data={levelCounts}/>
      <Bars title="Teacher specializations" subtitle="Distribution of teacher focus areas" data={teacherSpecialties}/>
      <Columns title="Enrolment by class" subtitle="Illustrative class sizes from class descriptions; not unique learner counts" data={classes}/>
      <Donut title="Learning content status" subtitle="Publication readiness across example content" data={occurrences(records.content,'status',['Published','Draft','Coming Soon'])}/>
      <Donut title="Support request status" subtitle={`${needsAttention} support or moderation items need attention`} data={occurrences(records.support,'status',['Open','In Progress','Resolved'])}/>
      <Bars title="Platform records by area" subtitle="Counts across all seven operator management areas" data={allResources}/>
      <Donut title="Community moderation status" subtitle="State of sample reports and reviews" data={occurrences(records.moderation,'status',['Pending','Reviewed','Resolved'])}/>
    </div>
    <p className="text-xs text-slate-400">All reports use fictional, editable browser demo data. Charts describe the current sample records, not real CilikLab usage or activity trends.</p>
  </div>;
}
