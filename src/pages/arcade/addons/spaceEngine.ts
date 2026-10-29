import type {LocalText} from '../arcadeData';
export type SpaceLevel = {id:string;name:LocalText;objective:LocalText;targets:number[];rocks:number[];tip:LocalText};
export const SPACE_LEVELS: SpaceLevel[] = [
 {id:'space-1',name:{ms:'Penerbangan Pertama',en:'First Flight'},objective:{ms:'Tembak sasaran di lorong 3.',en:'Shoot the target in lane 3.'},targets:[3],rocks:[],tip:{ms:'Tekan shoot() di lorong tengah.',en:'Use shoot() in the middle lane.'}},
 {id:'space-2',name:{ms:'Sasaran Berkembar',en:'Twin Targets'},objective:{ms:'Alih dan tembak dua sasaran.',en:'Move and shoot two targets.'},targets:[2,4],rocks:[],tip:{ms:'Gunakan move_left() dan move_right().',en:'Use move_left() and move_right().'}},
 {id:'space-3',name:{ms:'Laluan Asteroid',en:'Asteroid Field'},objective:{ms:'Elakkan asteroid dan tembak sasaran.',en:'Avoid the asteroid and shoot targets.'},targets:[1,5],rocks:[3],tip:{ms:'Batu di lorong 3 menghalang laser. Gerak dahulu.',en:'The rock in lane 3 blocks lasers. Move first.'}},
 {id:'space-4',name:{ms:'Tembakan Tepat',en:'Sharp Shooter'},objective:{ms:'Cari tiga sasaran yang jauh.',en:'Find three distant targets.'},targets:[0,3,6],rocks:[2,4],tip:{ms:'Bergerak satu lorong setiap arahan.',en:'Each move shifts one lane.'}},
 {id:'space-5',name:{ms:'Kuasa Gelung',en:'Loop Power'},objective:{ms:'Gunakan gelung untuk bergerak dan menembak.',en:'Use a loop to move and shoot.'},targets:[3,4,5,6],rocks:[],tip:{ms:'for i in range(4): boleh mengulang arahan.',en:'for i in range(4): repeats commands.'}},
 {id:'space-6',name:{ms:'Penjaga Galaksi',en:'Galaxy Guardian'},objective:{ms:'Bersihkan galaksi daripada semua robot.',en:'Clear all robot targets from the galaxy.'},targets:[0,1,2,4,5,6],rocks:[3],tip:{ms:'Bahagikan misi kepada langkah kecil dan uji kod.',en:'Break the mission into small steps and test your code.'}}
 ,{id:'space-7',name:{ms:'Operasi Bintang',en:'Star Operation'},objective:{ms:'Tembak lima sasaran sambil elak dua asteroid.',en:'Shoot five targets while avoiding two asteroid lanes.'},targets:[0,1,3,5,6],rocks:[2,4],tip:{ms:'Gerakkan kapal dan rancang laluan selamat.',en:'Plan a route around the two blocked lanes before shooting.'}},
 {id:'space-8',name:{ms:'Misi Komander',en:'Commander Mission'},objective:{ms:'Tembak tujuh sasaran di semua lorong. Gunakan gelung untuk lebih cekap.',en:'Clear all seven lanes with an efficient loop and accurate shooting.'},targets:[0,1,2,3,4,5,6],rocks:[],tip:{ms:'Gunakan beberapa langkah dan uji gelung pergerakan.',en:'Combine movements and loops, and test one section at a time.'}}

];
export type SpaceCommand = {op:'left'|'right'|'shoot';line:number};
export class SpaceCodeError extends Error {constructor(public line:number, message:string){super(message);this.name='SpaceCodeError';}}
export function compileSpaceCommands(input:string):SpaceCommand[] {
 if(input.length>3500)throw new SpaceCodeError(0,'Program too long');
 const lines=input.replace(/\r/g,'').split('\n');if(lines.length>90)throw new SpaceCodeError(0,'Too many lines');
 const steps:SpaceCommand[]=[];
 const add=(op:SpaceCommand['op'],line:number)=>{steps.push({op,line});if(steps.length>120)throw new SpaceCodeError(line,'Maximum 120 actions');};
 for(let i=0;i<lines.length;i++){
  const raw=lines[i], s=raw.trim(); if(!s||s.startsWith('#'))continue;
  if(/^for\s+[A-Za-z_]\w*\s+in\s+range\(\d+\):$/.test(s)){
   const count=Number(s.match(/range\((\d+)\)/)?.[1]);if(count<1||count>20)throw new SpaceCodeError(i+1,'Loop must repeat 1 to 20 times');
   const body:SpaceCommand[]=[];let j=i+1;for(;j<lines.length;j++){const item=lines[j];if(!item.trim())continue;if(!/^\s/.test(item))break;const m=item.trim().match(/^move_(left|right)\(\)$|^(shoot)\(\)$/);if(!m)throw new SpaceCodeError(j+1,'Use move_left(), move_right(), or shoot() inside a loop');body.push({op:(m[1]||m[2]) as SpaceCommand['op'],line:j+1});}
   if(!body.length)throw new SpaceCodeError(i+1,'Write an indented command in the loop');for(let r=0;r<count;r++)for(const x of body)add(x.op,x.line);i=j-1;
  }else{
   if(/^\s/.test(raw))throw new SpaceCodeError(i+1,'Unexpected indentation');const m=s.match(/^move_(left|right)\(\)$|^(shoot)\(\)$/);if(!m)throw new SpaceCodeError(i+1,'Unknown command');add((m[1]||m[2]) as SpaceCommand['op'],i+1);
  }
 }
 if(!steps.length)throw new SpaceCodeError(1,'Write a movement or shoot command first');return steps;
}
export type SpaceFrame={lane:number;hits:number[];shots:number;steps:number;line:number;status:'move'|'hit'|'miss'|'rock'|'edge'|'start'|'win'};
export const initialSpaceFrame=():SpaceFrame=>({lane:3,hits:[],shots:0,steps:0,line:0,status:'start'});
export function advanceSpace(level:SpaceLevel,frame:SpaceFrame,cmd:SpaceCommand):SpaceFrame {
 if(frame.status==='win')return frame;
 let lane=frame.lane, hits=frame.hits,shots=frame.shots, status:SpaceFrame['status']='move';
 if(cmd.op==='left'||cmd.op==='right') {const dest=lane+(cmd.op==='left'?-1:1);if(dest<0||dest>6)status='edge';else lane=dest;}
 else {shots++;if(level.rocks.includes(lane))status='rock';else if(level.targets.includes(lane)&&!hits.includes(lane)){hits=[...hits,lane];status='hit';}else status='miss';}
 if(hits.length===level.targets.length)status='win';
 return {lane,hits,shots,steps:frame.steps+1,line:cmd.line,status};
}
export function spaceScore(frame:SpaceFrame,level:SpaceLevel){return frame.hits.length*50+(frame.hits.length===level.targets.length?100+Math.max(0,50-frame.steps*2):0);}
