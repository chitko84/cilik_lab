import type {Mission,Point} from './levels';
export type Facing = 0|1|2|3;
export interface RobotState {
 x:number;y:number;dir:Facing;energy:number;carrying:boolean;picked:boolean;delivered:boolean;switchOn:boolean;
 crystals:string[];bumps:number;actions:number;ticks:number;failed:boolean;message:string;
}
export interface Frame {line:number;description:string;state:RobotState;}
const key=(p:Point)=>`${p.x},${p.y}`;
const move=[{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];
export const initialState=(level:Mission):RobotState=>({x:level.start.x,y:level.start.y,dir:1,energy:100,carrying:false,picked:false,delivered:false,switchOn:false,crystals:[],bumps:0,actions:0,ticks:0,failed:false,message:'System ready. Plan your route.'});
export class RobotEngine {
 state:RobotState; frames:Frame[]=[];
 constructor(public level:Mission){this.state=initialState(level);this.snapshot(0,'Mission initialized');}
 reset(){this.state=initialState(this.level);this.frames=[];this.snapshot(0,'Robot restored');}
 clone(){return {...this.state,crystals:[...this.state.crystals]};}
 tile(x:number,y:number){return this.level.map[y]?.[x]||'#';}
 snapshot(line:number,description:string){this.frames.push({line,description,state:this.clone()});}
 sensor(name:string){const s=this.state;const d=move[s.dir];switch(name){
  case 'obstacle_ahead':case 'detect_obstacle':case 'wall_ahead':return this.blocked(s.x+d.x,s.y+d.y);
  case 'path_clear':return !this.blocked(s.x+d.x,s.y+d.y);
  case 'at_goal':return s.x===this.level.goal.x&&s.y===this.level.goal.y;
  case 'carrying':return s.carrying;
  case 'get_x':return s.x;
  case 'get_y':return s.y;
  case 'get_energy':return s.energy;
  case 'on_switch':return this.tile(s.x,s.y)==='T';
  case 'on_package':return this.tile(s.x,s.y)==='P'&&!s.picked;
  case 'on_charger':return this.tile(s.x,s.y)==='+';
  case 'on_conveyor':return '>^<v'.includes(this.tile(s.x,s.y));
  case 'distance_to_goal':return Math.abs(s.x-this.level.goal.x)+Math.abs(s.y-this.level.goal.y);
  case 'crystals_collected':return s.crystals.length;
  case 'scan':return `Front: ${this.blocked(s.x+d.x,s.y+d.y)?'blocked':'clear'} · energy: ${s.energy}%`;
  default:throw Error(`Unknown sensor robot.${name}().`);
 }}
 blocked(x:number,y:number){const t=this.tile(x,y);return t==='#'||t==='d'&&!this.state.switchOn;}
 beltShift(line:number){const s=this.state;const t=this.tile(s.x,s.y);const direction:{[key:string]:[number,number]}={'>':[1,0],'<':[-1,0],'^':[0,-1],v:[0,1]};const d=direction[t];if(!d)return false;
 const nx=s.x+d[0],ny=s.y+d[1];if(this.blocked(nx,ny))return false;s.x=nx;s.y=ny;s.energy=Math.max(0,s.energy-1);if(this.tile(nx,ny)==='C'&&!s.crystals.includes(`${nx},${ny}`))s.crystals.push(`${nx},${ny}`);
 s.ticks++;s.message='Conveyor transferred robot';this.snapshot(line,s.message);if(s.energy===0)s.failed=true;return true;}
 action(name:string,args:unknown[],line=0){const s=this.state;if(s.failed)throw Error('The robot is disabled. Reset the mission.');
 const integer=(n:unknown)=>{if(typeof n!=='number'||!Number.isInteger(n)||n<1||n>24)throw Error('Distance must be a whole number from 1 to 24.');return n;};
 const done=(msg:string)=>{s.actions++;s.ticks++;s.message=msg;this.snapshot(line,msg);};
 switch(name){
  case 'move_forward':{
   const steps=integer(args.length?args[0]:1);for(let i=0;i<steps;i++){
    const d=move[s.dir],nx=s.x+d.x,ny=s.y+d.y;
    if(this.blocked(nx,ny)){s.bumps++;s.energy=Math.max(0,s.energy-2);done('Blocked! Adjust the route or open the gate.');break;}
    s.x=nx;s.y=ny;s.energy=Math.max(0,s.energy-1);const t=this.tile(nx,ny);
    if(t==='~')s.energy=Math.max(0,s.energy-13);
    if(t==='C'&&!s.crystals.includes(`${nx},${ny}`))s.crystals.push(`${nx},${ny}`);
    done(t==='C'?'Data crystal secured':t==='G'?'Destination reached':'Robot moved forward');
    this.beltShift(line);
    if(s.energy===0){s.failed=true;s.message='Battery depleted. Find a charging station.';this.snapshot(line,s.message);break;}
   }return null;
  }
  case 'turn_left':s.dir=(s.dir+3)%4 as Facing;done('Robot rotated left');return null;
  case 'turn_right':s.dir=(s.dir+1)%4 as Facing;done('Robot rotated right');return null;
  case 'turn_around':s.dir=(s.dir+2)%4 as Facing;done('Robot turned around');return null;
  case 'pick_up':if(this.tile(s.x,s.y)!=='P'||s.picked){done('There is no uncollected parcel here');return null;}s.carrying=true;s.picked=true;done('Parcel secured in cargo bay');return null;
  case 'drop':case 'deliver':if(!s.carrying){done('Robot is not carrying anything');return null;}if(this.tile(s.x,s.y)!=='B'){done('Move to the yellow delivery depot first');return null;}s.carrying=false;s.delivered=true;done('Package successfully delivered');return null;
  case 'activate':if(this.tile(s.x,s.y)!=='T'){done('No control switch under the robot');return null;}s.switchOn=true;done('Security switch activated · gate unlocked');return null;
  case 'charge':if(this.tile(s.x,s.y)!=='+'){done('Stand on a charging platform to recharge');return null;}s.energy=100;done('Battery recharged to 100%');return null;
  case 'scan':done(String(this.sensor('scan')));return null;
  case 'wait':{const count=integer(args.length?args[0]:1);for(let i=0;i<count;i++){done('Robot waiting for clearance');this.beltShift(line);}return null;}
  default:throw Error(`Unknown action robot.${name}(). Available: move_forward, turn_left, turn_right, pick_up, drop, activate, charge, scan, wait.`);
 }
 }
 evaluate(usage:{loop:boolean;condition:boolean}={loop:false,condition:false}){
  const s=this.state,l=this.level;const goal=s.x===l.goal.x&&s.y===l.goal.y;
  const checks=[{id:'goal',label:'Reach destination',done:goal}];
  if(l.objectives.includes('pickup'))checks.push({id:'pickup',label:'Collect the cargo',done:s.picked});
  if(l.objectives.includes('deliver'))checks.push({id:'deliver',label:'Deliver cargo to the depot',done:s.delivered});
  if(l.objectives.includes('switch'))checks.push({id:'switch',label:'Activate security console',done:s.switchOn});
  if(l.objectives.includes('crystals'))checks.push({id:'crystals',label:`Collect all ${l.crystals.length} data crystals`,done:s.crystals.length===l.crystals.length});
  if(l.objectives.includes('loop'))checks.push({id:'loop',label:'Use a Python loop',done:usage.loop});
  if(l.objectives.includes('condition'))checks.push({id:'condition',label:'Use a Python condition',done:usage.condition});
  const success=checks.every(c=>c.done)&&!s.failed;
  const stars=success?(s.bumps===0&&s.actions<=l.par*2?3:s.bumps<=2?2:1):0;
  const score=success?250+stars*125+Math.max(0,80-s.actions):0;
  return {checks,success,stars,score,actions:s.actions,energy:s.energy,bumps:s.bumps};
 }
}
