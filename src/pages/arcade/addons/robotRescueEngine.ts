import type {Direction,LocalText,Point} from '../arcadeData';

export type RescueLevel = {id:string;name:LocalText;topic:LocalText;tip:LocalText;map:string[]};
// S: robot start, P: lost pet, D: rescue station, #: wall, .: path.
export const RESCUE_LEVELS:RescueLevel[] = [
 {id:'rescue-1',name:{ms:'Anak Kucing Hilang',en:'Lost Kitten'},topic:{ms:'Langkah ke kanan',en:'Moving right'},tip:{ms:'Pergi kanan, ambil kucing, kemudian ke rumah. ',en:'Go right, pick up the kitten, then reach the home.'},map:['#########','#S.P...D#','#########']},
 {id:'rescue-2',name:{ms:'Jalan Berliku',en:'Twisty Trail'},topic:{ms:'Perintah ikut urutan',en:'Sequencing commands'},tip:{ms:'Cuba jalan di bawah dinding.',en:'Try moving below the wall.'},map:['#########','#S.#..PD#','#..#....#','#.......#','#########']},
 {id:'rescue-3',name:{ms:'Dua Sahabat',en:'Two Friends'},topic:{ms:'Rancang laluan',en:'Plan a route'},tip:{ms:'Selamatkan kedua-dua haiwan sebelum keluar.',en:'Rescue both pets before reaching home.'},map:['#########','#S.P...D#','#.#####.#','#...P...#','#########']},
 {id:'rescue-4',name:{ms:'Taman Berpagar',en:'Garden Gates'},topic:{ms:'Cari laluan lain',en:'Find an alternate path'},tip:{ms:'Ada laluan yang menghubungkan bahagian bawah taman.',en:'Look for a path connecting the bottom of the garden.'},map:['###########','#S.P#....D#','#...#.#...#','#.....#...#','###.P.....#','###########']},
 {id:'rescue-5',name:{ms:'Pasukan Penyelamat',en:'Rescue Team'},topic:{ms:'Gerakan berulang',en:'Repeated movement'},tip:{ms:'Kumpul semua sahabat dengan mengulang arahan.',en:'Collect all friends by repeating commands.'},map:['###########','#S.P...#PD#','#.###..#..#','#...P.....#','#.........#','###########']},
 {id:'rescue-6',name:{ms:'Wira Robot',en:'Robot Hero'},topic:{ms:'Rancang dan uji kod',en:'Plan and test code'},tip:{ms:'Rancang laluan untuk tiga haiwan dan rumah.',en:'Plan your route to three pets and the home.'},map:['#############','#S..P..#...D#','#.###..#.#..#','#.....P.....#','###.###.###.#','#.....P.....#','#############']}
];
export type RescueFrame={position:Point;rescued:string[];steps:number;won:boolean;hitWall:boolean;line:number};
const vectors:Record<Direction,Point>={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
const key=(x:number,y:number)=>`${x},${y}`;
export function rescueMeta(level:RescueLevel){
 const start:Point={x:0,y:0};const pets:string[]=[];let door:Point={x:0,y:0};let starts=0;let doors=0;
 level.map.forEach((row,y)=>[...row].forEach((t,x)=>{if(t==='S'){start.x=x;start.y=y;starts++}if(t==='D'){door={x,y};doors++}if(t==='P')pets.push(key(x,y))}));
 return {start,pets,door,width:Math.max(...level.map.map(r=>r.length)),height:level.map.length,starts,doors};
}
export function newRescueFrame(level:RescueLevel):RescueFrame{return {position:rescueMeta(level).start,rescued:[],steps:0,won:false,hitWall:false,line:0};}
export function stepRescue(level:RescueLevel,frame:RescueFrame,dir:Direction,line=0):RescueFrame{
 if(frame.won)return frame;
 const {x,y}=frame.position,v=vectors[dir],nx=x+v.x,ny=y+v.y;
 if(!level.map[ny]||level.map[ny][nx]===undefined||level.map[ny][nx]==='#')return {...frame,hitWall:true,line};
 const tile=level.map[ny][nx];const rescued=tile==='P'&&!frame.rescued.includes(key(nx,ny))?[...frame.rescued,key(nx,ny)]:frame.rescued;
 const meta=rescueMeta(level);return {position:{x:nx,y:ny},rescued,steps:frame.steps+1,won:tile==='D'&&rescued.length===meta.pets.length,hitWall:false,line};
}
export function rescueScore(frame:RescueFrame){return Math.max(0,frame.rescued.length*40+(frame.won?120:0)-Math.max(0,frame.steps-3)*2);}
/** BFS of (position, pet mask) proves map and every rescue objective can be completed. */
export function findRescueSolution(level:RescueLevel):Direction[]|null{
 const meta=rescueMeta(level);if(meta.starts!==1||meta.doors!==1||!meta.pets.length)return null;
 const petIndices=new Map(meta.pets.map((p,i)=>[p,i]));const dirs:Direction[]=['up','right','down','left'];
 const initial={x:meta.start.x,y:meta.start.y,mask:0,path:[] as Direction[]};const queue=[initial],seen=new Set([`${initial.x},${initial.y},0`]);
 for(let i=0;i<queue.length;i++){
  const state=queue[i];if(state.x===meta.door.x&&state.y===meta.door.y&&state.mask===(1<<meta.pets.length)-1)return state.path;
  for(const d of dirs){const nx=state.x+vectors[d].x,ny=state.y+vectors[d].y;if(!level.map[ny]||level.map[ny][nx]===undefined||level.map[ny][nx]==='#')continue;
   const p=petIndices.get(key(nx,ny));const mask=state.mask|(p===undefined?0:1<<p);const ident=`${nx},${ny},${mask}`;
   if(seen.has(ident))continue;seen.add(ident);queue.push({x:nx,y:ny,mask,path:[...state.path,d]});
  }
 }
 return null;
}
