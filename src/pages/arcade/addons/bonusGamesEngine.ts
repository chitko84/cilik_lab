export type LocalText = { ms: string; en: string };
export type NoteKey = 'red'|'blue'|'green'|'yellow';
export type MelodyLevel = { id:string; name:LocalText; topic:LocalText; target:NoteKey[]; tip:LocalText };
export const NOTE_META: Record<NoteKey,{emoji:string; ms:string; en:string; color:string}> = {
  red:{emoji:'🥁',ms:'merah',en:'red',color:'#ff7d7d'},
  blue:{emoji:'🎵',ms:'biru',en:'blue',color:'#7dc8ff'},
  green:{emoji:'🎹',ms:'hijau',en:'green',color:'#83df9b'},
  yellow:{emoji:'✨',ms:'kuning',en:'yellow',color:'#ffd768'},
};
export const MELODY_LEVELS: MelodyLevel[] = [
  {id:'melody-1',name:{ms:'Rentak Ceria',en:'Happy Beat'},topic:{ms:'Turutan mudah',en:'Simple sequence'},target:['red','blue','red','blue'],tip:{ms:'Ulang merah dan biru berselang-seli.',en:'Alternate red and blue.'}},
  {id:'melody-2',name:{ms:'Lagu Pelangi',en:'Rainbow Tune'},topic:{ms:'Empat simbol',en:'Four symbols'},target:['red','green','yellow','blue'],tip:{ms:'Main mengikut warna dari kiri ke kanan.',en:'Play the colors from left to right.'}},
  {id:'melody-3',name:{ms:'Echo Robot',en:'Robot Echo'},topic:{ms:'Corak berulang',en:'Repeating pattern'},target:['green','green','blue','green','green','blue'],tip:{ms:'Dua hijau, satu biru. Ulang dua kali.',en:'Two greens, then a blue. Repeat twice.'}},
  {id:'melody-4',name:{ms:'Bintang Menari',en:'Dancing Stars'},topic:{ms:'Susunan lebih panjang',en:'Longer sequence'},target:['yellow','blue','yellow','red','green'],tip:{ms:'Mulakan dengan kuning, biru, kuning.',en:'Start with yellow, blue, yellow.'}},
  {id:'melody-5',name:{ms:'Konsert Mini',en:'Mini Concert'},topic:{ms:'Gabung bunyi',en:'Combine sounds'},target:['red','red','green','blue','yellow','yellow'],tip:{ms:'Ada dua merah di awal dan dua kuning di akhir.',en:'It starts with two reds and ends with two yellows.'}},
  {id:'melody-6',name:{ms:'Irama Juara',en:'Champion Rhythm'},topic:{ms:'Rancang dengan gelung',en:'Plan with loops'},target:['blue','green','blue','green','red','yellow','red','yellow'],tip:{ms:'Fikir dalam pasangan yang berulang.',en:'Think in repeating pairs.'}},
];
export type MelodyPlay = { note: NoteKey; line:number };
class ParseError extends Error { line:number; constructor(msg:string,line:number){super(msg); this.line=line;}}
function normalizeLines(source:string){return source.replace(/\r/g,'').split('\n').map(x=>x.replace(/\t/g,'    '));}
function parseIndented(lines:string[], start:number, indent:number, allowNotes:true): [MelodyPlay[],number] {
  const out:MelodyPlay[]=[]; let i=start;
  while(i<lines.length){
    const raw=lines[i]; if(!raw.trim()){i++; continue;}
    const spaces=raw.match(/^ */)?.[0].length||0; if(spaces<indent) break; if(spaces>indent) throw new ParseError('Check indentation.', i+1);
    const line=raw.trim();
    const loop=line.match(/^for\s+\w+\s+in\s+range\((\d+)\):$/);
    if(loop){ const n=Number(loop[1]); if(n<1||n>12) throw new ParseError('Loop range must be between 1 and 12.', i+1); const [body,next]=parseIndented(lines,i+1,indent+4,true); if(!body.length) throw new ParseError('Write an indented command inside the loop.', i+1); for(let c=0;c<n;c++) out.push(...body); i=next; continue; }
    const play=line.match(/^play\((red|blue|green|yellow)\)$/);
    if(play){ out.push({note:play[1] as NoteKey,line:i+1}); i++; continue; }
    throw new ParseError('Use play(red), play(blue), play(green), play(yellow), or a for loop.', i+1);
  }
  if(out.length>24) throw new ParseError('Too many commands. Keep the song short.', Math.max(1,start+1));
  return [out,i];
}
export function compileMelodyCode(source:string): MelodyPlay[] {
  const [actions,next]=parseIndented(normalizeLines(source),0,0,true); if(next<normalizeLines(source).length){}; return actions;
}
export function melodyComplete(level:MelodyLevel, played:NoteKey[]){ return played.length===level.target.length && level.target.every((n,i)=>played[i]===n); }
export function melodyMatches(level:MelodyLevel, played:NoteKey[]){ return played.filter((n,i)=>level.target[i]===n).length; }
export function melodyScore(level:MelodyLevel, played:NoteKey[], errors:number, won:boolean){ const matches=melodyMatches(level,played); return Math.max(0,matches*18 + (won?80:0) - errors*10); }

export type BridgeLevel = { id:string; name:LocalText; topic:LocalText; length:number; gaps:number[]; tip:LocalText; solution:string[] };
export const BRIDGE_LEVELS: BridgeLevel[] = [
  {id:'bridge-1',name:{ms:'Sungai Kecil',en:'Little River'},topic:{ms:'Bina satu jambatan',en:'Build one bridge'},length:6,gaps:[2],tip:{ms:'Letak papan sebelum jurang.',en:'Place a plank before the gap.'},solution:['move_right()','place()','move_right()','move_right()','move_right()','move_right()']},
  {id:'bridge-2',name:{ms:'Dua Jurang',en:'Double Gap'},topic:{ms:'Rancang langkah',en:'Plan the route'},length:7,gaps:[2,5],tip:{ms:'Ada dua jurang untuk ditutup.',en:'There are two gaps to cover.'},solution:['move_right()','place()','move_right()','move_right()','move_right()','place()','move_right()','move_right()']},
  {id:'bridge-3',name:{ms:'Jambatan Panjang',en:'Long Bridge'},topic:{ms:'Ulangan arahan',en:'Repeated commands'},length:8,gaps:[3,4],tip:{ms:'Bina dua papan berturut-turut.',en:'Build two planks in a row.'},solution:['move_right()','move_right()','place()','move_right()','place()','move_right()','move_right()','move_right()','move_right()']},
  {id:'bridge-4',name:{ms:'Pulau Robot',en:'Robot Island'},topic:{ms:'Maju dengan berhati-hati',en:'Move carefully'},length:8,gaps:[1,4,6],tip:{ms:'Gerak, bina, kemudian teruskan.',en:'Move, build, then continue.'},solution:['place()','move_right()','move_right()','move_right()','place()','move_right()','move_right()','place()','move_right()','move_right()']},
  {id:'bridge-5',name:{ms:'Sungai Berliku',en:'Winding River'},topic:{ms:'Algoritma mudah',en:'Simple algorithm'},length:9,gaps:[2,4,7],tip:{ms:'Banyak jurang kecil muncul di hadapan.',en:'Several small gaps appear ahead.'},solution:['move_right()','place()','move_right()','move_right()','place()','move_right()','move_right()','move_right()','place()','move_right()','move_right()']},
  {id:'bridge-6',name:{ms:'Jurutera Hebat',en:'Master Builder'},topic:{ms:'Gabung kod dan logik',en:'Combine code and logic'},length:10,gaps:[2,3,6,8],tip:{ms:'Ada empat jurang. Fikir satu langkah ke hadapan.',en:'There are four gaps. Think one step ahead.'},solution:['move_right()','place()','move_right()','place()','move_right()','move_right()','move_right()','place()','move_right()','move_right()','place()','move_right()','move_right()']},
];
export type BridgeCommand = { op:'move_right'|'move_left'|'place'; line:number };
export type BridgeFrame = { position:number; planks:number[]; steps:number; status:'playing'|'win'|'splash'|'blocked'|'edge'|'duplicate'; line:number };
export function initialBridgeFrame(): BridgeFrame { return {position:0,planks:[],steps:0,status:'playing',line:0}; }
export function advanceBridge(level:BridgeLevel, frame:BridgeFrame, cmd:BridgeCommand): BridgeFrame {
  const gaps=new Set(level.gaps); const planks=new Set(frame.planks);
  if(cmd.op==='place'){
    const target=frame.position+1;
    if(target>=level.length-1) return {...frame,status:'edge',line:cmd.line};
    if(!gaps.has(target)) return {...frame,status:'blocked',line:cmd.line,steps:frame.steps+1};
    if(planks.has(target)) return {...frame,status:'duplicate',line:cmd.line,steps:frame.steps+1};
    planks.add(target); return {...frame,planks:[...planks],steps:frame.steps+1,status:'playing',line:cmd.line};
  }
  const delta=cmd.op==='move_right'?1:-1; const next=frame.position+delta;
  if(next<0||next>=level.length) return {...frame,status:'edge',line:cmd.line};
  if(gaps.has(next)&&!planks.has(next)) return {...frame,steps:frame.steps+1,status:'splash',line:cmd.line};
  const won=next===level.length-1; return {...frame,position:next,steps:frame.steps+1,status:won?'win':'playing',line:cmd.line};
}
function parseBridge(lines:string[], start:number, indent:number): [BridgeCommand[],number] {
  const out:BridgeCommand[]=[]; let i=start;
  while(i<lines.length){
    const raw=lines[i]; if(!raw.trim()){i++; continue;} const spaces=raw.match(/^ */)?.[0].length||0; if(spaces<indent) break; if(spaces>indent) throw new ParseError('Check indentation.', i+1);
    const line=raw.trim(); const loop=line.match(/^for\s+\w+\s+in\s+range\((\d+)\):$/);
    if(loop){ const n=Number(loop[1]); if(n<1||n>16) throw new ParseError('Loop range must be between 1 and 16.', i+1); const [body,next]=parseBridge(lines,i+1,indent+4); if(!body.length) throw new ParseError('Write an indented command inside the loop.', i+1); for(let c=0;c<n;c++) out.push(...body); i=next; continue; }
    if(line==='move_right()'){out.push({op:'move_right',line:i+1}); i++; continue;}
    if(line==='move_left()'){out.push({op:'move_left',line:i+1}); i++; continue;}
    if(line==='place()'){out.push({op:'place',line:i+1}); i++; continue;}
    throw new ParseError('Use move_right(), move_left(), place(), or a for loop.', i+1);
  }
  if(out.length>30) throw new ParseError('Too many commands. Try a shorter plan.', Math.max(1,start+1));
  return [out,i];
}
export function compileBridgeCode(source:string): BridgeCommand[] { return parseBridge(normalizeLines(source),0,0)[0]; }
export function bridgeScore(level:BridgeLevel, frame:BridgeFrame){
  // A fresh level earns zero points. Only actual planks and successful crossings score.
  const construction=frame.planks.length*12;
  if(frame.status!=='win')return construction;
  return Math.max(60, construction+120+Math.max(0,(level.length-1)*3-frame.steps*2));
}
