/** RoboLab missions. Seeded designs are deterministic: no level changes under a returning learner. */
export type Point = {x:number;y:number};
export type WorldKey = 'academy'|'arena'|'factory'|'city'|'space'|'jungle'|'automation'|'championship';
export type ObjectiveKey = 'goal'|'pickup'|'deliver'|'switch'|'crystals'|'loop'|'condition';
export interface Mission {
  id:string; index:number; world:WorldKey; worldNumber:number; title:string; subtitle:string;
  difficulty:number; map:string[]; start:Point; goal:Point; item?:Point; bin?:Point; switch?:Point;
  crystals:Point[]; charger?:Point; gate?:Point; objectives:ObjectiveKey[]; concepts:string[];
  hints:string[]; starter:string; reference:string; par:number; accent:string;
}
export const WORLD_INFO:{id:WorldKey;name:string;subtitle:string;accent:string;sky:string;icon:string}[] = [
 {id:'academy',name:'Robotics Academy',subtitle:'Learn to move, turn and deliver',accent:'#39efd8',sky:'#0c293d',icon:'01'},
 {id:'arena',name:'Obstacle Arena',subtitle:'Navigate barriers and sensor fields',accent:'#ffb55f',sky:'#302143',icon:'02'},
 {id:'factory',name:'Smart Factory',subtitle:'Automate production and cargo',accent:'#6bc6ff',sky:'#172b4c',icon:'03'},
 {id:'city',name:'Future City',subtitle:'Solve urban robotics missions',accent:'#a6f276',sky:'#163e40',icon:'04'},
 {id:'space',name:'Orbital Station',subtitle:'Rescue systems among the stars',accent:'#bd8aff',sky:'#171938',icon:'05'},
 {id:'jungle',name:'Jungle Outpost',subtitle:'Explore ancient research trails',accent:'#a9f16e',sky:'#183d2d',icon:'06'},
 {id:'automation',name:'Automation Core',subtitle:'Master multi-stage intelligent systems',accent:'#ff7db8',sky:'#291d42',icon:'07'},
 {id:'championship',name:'Robo Championship',subtitle:'Face the ultimate robotics trials',accent:'#ffe17d',sky:'#342945',icon:'08'}
];
const NAMES = [
 ['First Steps','Precision Turns','Cargo Academy','Corridor Navigation','The Final Examination'],
 ['Blocked Path','Laser Grid','Moving Machines','Sensor Intelligence','Arena Master'],
 ['Conveyor Control','Sorting Shift','Assembly Protocol','System Breakdown','Production Master'],
 ['Parcel Express','Traffic Algorithm','Emergency Response','Recycling Route','Autonomous City'],
 ['Station Navigation','Restore the Power','Zero-G Cargo','Asteroid Protocol','Orbital Rescue'],
 ['Jungle Trail','River Crossing','Artifact Scanner','Wildlife Detour','Expedition Master'],
 ['Robot Coordination','Dynamic Logistics','Sensor Fusion','Intelligent Warehouse','Automation Engineer'],
 ['Precision Master','Algorithm Expert','Sensor Championship','Autonomous Operations','Grand Final']
];
const CONCEPTS=[['sequence','turning'],['loops','obstacles'],['pickup','delivery'],['switch','logic'],['optimization','debugging']];
function rng(seed:number){let n=seed|0;return ()=>{n=Math.imul(n ^ n>>>15,1|n);n^=n+Math.imul(n ^ n>>>7,61|n);return ((n^n>>>14)>>>0)/4294967296;};}
const idp=(p:Point)=>`${p.x},${p.y}`;
const dirs:Point[]=[{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];
const add=(p:Point,d:Point)=>({x:p.x+d.x,y:p.y+d.y});
const equals=(a:Point,b:Point)=>a.x===b.x&&a.y===b.y;
export function shortestRoute(map:string[],from:Point,to:Point):Point[]{
 const queue:Point[]=[from], seen=new Set([idp(from)]), parent=new Map<string,Point>();
 for(let head=0;head<queue.length;head++){
  const p=queue[head];if(equals(p,to)){const path=[p];let q=p;while(!equals(q,from)){q=parent.get(idp(q))!;path.unshift(q);}return path;}
  for(const d of dirs){const v=add(p,d);const ch=map[v.y]?.[v.x];if(!ch||ch==='#'||seen.has(idp(v)))continue;seen.add(idp(v));parent.set(idp(v),p);queue.push(v);}
 }
 return [];
}
function longestPoint(map:string[],start:Point):Point{
 const queue=[start], seen=new Set([idp(start)]);let best=start;
 for(let i=0;i<queue.length;i++){best=queue[i];for(const d of dirs){const next=add(queue[i],d),c=map[next.y]?.[next.x];if(c&&c!=='#'&&!seen.has(idp(next))){queue.push(next);seen.add(idp(next));}}}return best;
}
function carveMaze(w:number,h:number,random:()=>number):string[][]{
 const g=Array.from({length:h},()=>Array(w).fill('#'));
 const stack=[{x:1,y:1}];g[1][1]='.';
 while(stack.length){const p=stack[stack.length-1];const available=dirs.map(d=>({x:p.x+d.x*2,y:p.y+d.y*2,d})).filter(q=>q.x>0&&q.x<w-1&&q.y>0&&q.y<h-1&&g[q.y][q.x]==='#');if(!available.length){stack.pop();continue;}
  const v=available[Math.floor(random()*available.length)];g[p.y+v.d.y][p.x+v.d.x]='.';g[v.y][v.x]='.';stack.push({x:v.x,y:v.y});
 }
 // Puncture a few dividers to create choices without destroying the labyrinth.
 for(let k=0;k<Math.floor(w*h/19);k++){const x=2+Math.floor(random()*(w-4)),y=2+Math.floor(random()*(h-4));if(g[y][x]!=='#')continue; if((g[y-1][x]==='.'&&g[y+1][x]==='.')||(g[y][x-1]==='.'&&g[y][x+1]==='.'))g[y][x]='.';}
 return g;
}
function generate(index:number):Mission{
 const worldIndex=Math.floor((index-1)/5), phase=(index-1)%5, info=WORLD_INFO[worldIndex];
 const random=rng(0xC1C0+index*137);const width=(worldIndex>=6?15:worldIndex>=3?13:11),height=(phase>=3?13:11);
 const grid=carveMaze(width,height,random);const start={x:1,y:1};const goal=longestPoint(grid.map(r=>r.join('')),start);
 const path=shortestRoute(grid.map(r=>r.join('')),start,goal);
 const spot=(fraction:number)=>path[Math.max(1,Math.min(path.length-2,Math.round((path.length-1)*fraction)))];
 let item:Point|undefined,bin:Point|undefined,sw:Point|undefined,gate:Point|undefined,charger:Point|undefined;
 let crystals:Point[]=[];
 const type=phase;
 if(type===1||type===4){item=spot(.23);bin=spot(.74);if(equals(item,bin))bin=spot(.85);}
 if(type===2||type===4){sw=spot(type===4?.36:.5);gate=spot(.85);if(equals(sw,gate))gate=spot(.92);}
 if(type===3){crystals=[spot(.25),spot(.5),spot(.75)].filter((p,i,a)=>a.findIndex(v=>equals(v,p))===i);}
 if(worldIndex>=4){charger=spot(.55);if(item&&equals(charger,item)||sw&&equals(charger,sw)||bin&&equals(charger,bin))charger=undefined;}
 const reserved=[start,goal,...[item,bin,sw,gate,charger].filter((p):p is Point=>!!p),...crystals];
 // Hazards on side routes only: dangerous to explore, never mandatory for reference solution.
 const pathSet=new Set(path.map(idp));
 for(let i=0;i<Math.min(8,worldIndex+phase+1);i++){
  const x=1+Math.floor(random()*(width-2)),y=1+Math.floor(random()*(height-2));
  if(grid[y][x]==='.'&&!pathSet.has(`${x},${y}`)&&!reserved.some(p=>p.x===x&&p.y===y))grid[y][x]='~';
 }
 // Conveyor lanes in manufacturing / logistics worlds are live movement mechanisms.
 if(worldIndex===2||worldIndex===6){
  const beltDirections:[number,number,string][]=[[1,0,'>'],[-1,0,'<'],[0,-1,'^'],[0,1,'v']];
  let belts=0;
  for(let attempts=0;attempts<110&&belts<3+phase;attempts++){
   const x=1+Math.floor(random()*(width-2)),y=1+Math.floor(random()*(height-2));
   if(grid[y][x]!=='.'||pathSet.has(`${x},${y}`)||reserved.some(p=>p.x===x&&p.y===y))continue;
   const options=beltDirections.filter(([dx,dy])=>grid[y+dy]?.[x+dx]==='.'&&!pathSet.has(`${x+dx},${y+dy}`));
   if(!options.length)continue;const [, ,glyph]=options[Math.floor(random()*options.length)];grid[y][x]=glyph;belts++;
  }
 }
 const paint=(p:Point|undefined,c:string)=>{if(p)grid[p.y][p.x]=c;};
 paint(start,'S');paint(goal,'G');paint(item,'P');paint(bin,'B');paint(sw,'T');paint(gate,'d');paint(charger,'+');crystals.forEach(p=>paint(p,'C'));
 const map=grid.map(r=>r.join(''));
 const objectives:ObjectiveKey[]=['goal'];if(item)objectives.push('pickup','deliver');if(sw)objectives.push('switch');if(crystals.length)objectives.push('crystals');
 if(index>=12&&phase===0)objectives.push('loop');if(index>=20&&phase===3)objectives.push('condition');
 const priority:Point[]=[...(item?[item]:[]),...(sw?[sw]:[]),...(crystals.length?crystals:[]),...(bin?[bin]:[]),goal];
 // Order all objectives along the guaranteed solution corridor.
 priority.sort((a,b)=>path.findIndex(p=>equals(p,a))-path.findIndex(p=>equals(p,b)));
 const labels={S:'Robot start',G:'Mission destination',P:'Parcel',B:'Delivery depot',T:'Control switch',d:'Security door',C:'Data crystal','+':'Charging platform','~':'Hazard','>':'Conveyor','<':'Conveyor','^':'Conveyor','v':'Conveyor'};
 const reference=routeToProgram(map,start,priority,{item,bin,sw,charger,goal,needsLoop:objectives.includes('loop'),needsCondition:objectives.includes('condition')});
 const required=objectives.filter(k=>k!=='loop'&&k!=='condition');
 const hints=[
  'Read the glowing route. Begin with robot.move_forward() and robot.turn_right() or robot.turn_left().',
  item?'Stand on the orange parcel and use robot.pick_up(). Bring it to the delivery depot and use robot.drop().':sw?'Activate the illuminated console with robot.activate() to open the gate.':crystals.length?'Walk over every purple data crystal before reaching the finish.':'Use a loop for repeated movements. Check robot.obstacle_ahead() before risky turns.',
  'Use Step to watch each command. You can restore your starter code with Reset Code.'
 ];
 const starter=`# ${NAMES[worldIndex][phase]}\n# ${worldIndex+1}.${phase+1}  —  ${info.name}\n# Controls: move_forward(n), turn_left(), turn_right()\n${item?'# Cargo: pick_up(), drop()\n':''}${sw?'# Gate: activate() on a switch\n':''}${crystals.length?'# Collect every purple data crystal\n':''}robot.move_forward(1)\n`;
 return {id:`robolab-${String(index).padStart(2,'0')}`,index,world:info.id,worldNumber:worldIndex+1,title:NAMES[worldIndex][phase],subtitle:info.subtitle,difficulty:Math.min(5,1+Math.floor((index-1)/8)),map,start,goal,item,bin,switch:sw,crystals,charger,gate,objectives,concepts:CONCEPTS[phase],hints,starter,reference,par:Math.max(4,path.length+priority.length*2),accent:info.accent};
}
// A reference is constructed by shortest paths and uses the same public actions as students.
export function routeToProgram(map:string[],start:Point,points:Point[],meta:{item?:Point;bin?:Point;sw?:Point;charger?:Point;goal:Point;needsLoop?:boolean;needsCondition?:boolean}):string{
 let pos=start,dir=1;const cmds:string[]=[];
 const travel=(end:Point)=>{const path=shortestRoute(map,pos,end);if(!path.length)throw Error('No reference route');
  for(let i=1;i<path.length;i++){const p=path[i], delta={x:p.x-pos.x,y:p.y-pos.y}, next=dirs.findIndex(d=>d.x===delta.x&&d.y===delta.y);
   if(next<0)throw Error('Bad path');let turn=(next-dir+4)%4;if(turn===3)cmds.push('robot.turn_left()');else if(turn===1)cmds.push('robot.turn_right()');else if(turn===2)cmds.push('robot.turn_right()','robot.turn_right()');dir=next;cmds.push('robot.move_forward()');pos=p;
  }
 };
 for(const p of points){travel(p);if(meta.item&&equals(p,meta.item))cmds.push('robot.pick_up()');if(meta.sw&&equals(p,meta.sw))cmds.push('robot.activate()');if(meta.bin&&equals(p,meta.bin))cmds.push('robot.drop()');if(meta.charger&&equals(p,meta.charger))cmds.push('robot.charge()');}
 if(meta.needsLoop)cmds.unshift('for i in range(1):\n    robot.scan()');
 if(meta.needsCondition)cmds.unshift('if not robot.at_goal():\n    robot.scan()');
 return cmds.join('\n');
}
export const ROBOLAB_LEVELS:Mission[]=Array.from({length:40},(_,i)=>generate(i+1));
export const findLevel=(i:number)=>ROBOLAB_LEVELS[Math.min(39,Math.max(0,i))];
export const tileLabel=(tile:string)=>({S:'Spawn',G:'Finish',P:'Parcel',B:'Delivery',T:'Switch',d:'Gate',C:'Crystal','+':'Charger','~':'Hazard'} as Record<string,string>)[tile]||'Floor';
