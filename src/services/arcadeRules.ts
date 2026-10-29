import {isOpen,parseMaze,VECTORS} from '../pages/arcade/arcadeData';
import type {Direction,MazeLevel,Point} from '../pages/arcade/arcadeData';
import type {ParsedMove} from './arcadeCommandRunner';

export type MazeFrame = {position:Point; stars:string[]; steps:number; line:number; hitWall:boolean; won:boolean};
export function mazeScore(stars:number,steps:number,won:boolean) {
  return stars*25+(won?100+Math.max(0,40-steps*2):0);
}
export function advanceMaze(level:MazeLevel,position:Point,stars:string[],steps:number,dir:Direction,line=0):MazeFrame {
  const d=VECTORS[dir],next={x:position.x+d.x,y:position.y+d.y};
  if(!isOpen(level,next))return {position,stars,steps,line,hitWall:true,won:false};
  const {door}=parseMaze(level),key=`${next.x},${next.y}`;
  return {position:next,stars:level.map[next.y][next.x]==='*'&&!stars.includes(key)?[...stars,key]:stars,steps:steps+1,line,hitWall:false,won:next.x===door.x&&next.y===door.y};
}
export function simulateMazeCode(level:MazeLevel,moves:ParsedMove[]) {
  const {start}=parseMaze(level); let frame:MazeFrame={position:start,stars:[],steps:0,line:0,hitWall:false,won:false};
  const frames:MazeFrame[]=[frame];
  for(const m of moves){frame=advanceMaze(level,frame.position,frame.stars,frame.steps,m.direction,m.line);frames.push(frame);if(frame.won||frame.hitWall)break;}
  return frames;
}
