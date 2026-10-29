/** Spark Circuit: deterministic, fully local puzzle engine. No arbitrary code execution. */
export type Cell = {x:number;y:number};
export type Dir = 0|1|2|3; // up, right, down, left
export type Tile = {id:string;x:number;y:number;kind:'end'|'straight'|'corner';rotation:Dir;fixed:boolean};
export type CircuitLevel = {id:string;title:{ms:string;en:string};tip:{ms:string;en:string};size:number;route:Cell[];initial:Tile[]};
const DIRS = [[0,-1],[1,0],[0,1],[-1,0]] as const;
const key=(x:number,y:number)=>`${x},${y}`;
const direction=(a:Cell,b:Cell):Dir=>{
 const dx=b.x-a.x,dy=b.y-a.y;
 if(Math.abs(dx)+Math.abs(dy)!==1)throw new Error('Circuit route must move to adjacent cells');
 return (dx===1?1:dx===-1?3:dy===1?2:0) as Dir;
};
export function ports(tile:Tile): Dir[]{
 const r=tile.rotation;
 if(tile.kind==='end')return [r];
 if(tile.kind==='straight')return [r,((r+2)%4) as Dir];
 return [r,((r+1)%4) as Dir];
}
function rotationFor(kind:Tile['kind'],directions:Dir[]):Dir{
 for(let n=0;n<4;n++){const r=n as Dir;const parts=ports({id:'',x:0,y:0,kind,rotation:r,fixed:false});if(parts.length===directions.length&&directions.every(d=>parts.includes(d)))return r;}
 throw new Error('Impossible circuit shape');
}
function makeLevel(index:number,nameMs:string,nameEn:string,size:number,coords:number[][],tipMs:string,tipEn:string):CircuitLevel{
 const route=coords.map(([x,y])=>({x,y}));const seen=new Set<string>();
 for(const c of route){if(c.x<0||c.y<0||c.x>=size||c.y>=size||seen.has(key(c.x,c.y)))throw new Error(`Invalid circuit coordinates: ${index}`);seen.add(key(c.x,c.y));}
 const tiles=route.map((cell,i)=>{
  const directions:Dir[]=[];
  if(i>0)directions.push(direction(cell,route[i-1]));
  if(i<route.length-1)directions.push(direction(cell,route[i+1]));
  const end=i===0||i===route.length-1;
  const kind:Tile['kind']=end?'end':((directions[0]+2)%4===directions[1]?'straight':'corner');
  const solved=rotationFor(kind,directions);
  const initial=(end?solved:((solved+((i%3)+1))%4)) as Dir;
  return {id:`circuit-${index}-${i}`,x:cell.x,y:cell.y,kind,rotation:initial,fixed:end};
 });
 return {id:`circuit-${index}`,title:{ms:nameMs,en:nameEn},tip:{ms:tipMs,en:tipEn},size,route,initial:tiles};
}
export const CIRCUIT_LEVELS:CircuitLevel[]=[
 makeLevel(1,'Cahaya Pertama','First Light',4,[[0,1],[1,1],[2,1],[3,1]],'Putar wayar supaya semuanya bersambung.','Rotate the wires until all pieces connect.'),
 makeLevel(2,'Sudut Ceria','Clever Corner',4,[[0,0],[1,0],[1,1],[1,2],[2,2],[3,2]],'Perhatikan wayar yang berbelok.','Watch the wires that turn a corner.'),
 makeLevel(3,'Laluan Hijau','Green Path',4,[[0,3],[0,2],[1,2],[2,2],[2,1],[2,0]],'Setiap sambungan mesti menghadap wayar jiran.','Every connection must face its neighbour.'),
 makeLevel(4,'Kelip-kelip','Firefly Trail',5,[[0,0],[1,0],[1,1],[2,1],[3,1],[3,2],[3,3],[4,3]],'Pusingkan sambungan lurus dan bengkok.','Rotate both straight and curved wires.'),
 makeLevel(5,'Putaran Bijak','Smart Turns',5,[[0,4],[1,4],[1,3],[1,2],[2,2],[3,2],[3,1],[4,1],[4,0]],'Cuba mula dari lampu dan lihat ke belakang.','Start at the bulb and work backward.'),
 makeLevel(6,'Sungai Tenaga','Energy River',5,[[0,0],[0,1],[0,2],[1,2],[1,3],[2,3],[3,3],[3,2],[4,2]],'Setiap wayar mempunyai arah yang betul.','Each wire has a correct direction.'),
 makeLevel(7,'Litar Bintang','Star Circuit',6,[[0,5],[0,4],[1,4],[2,4],[2,3],[2,2],[3,2],[4,2],[4,1],[5,1],[5,0]],'Bina laluan berterusan ke mentol.','Build a continuous path to the lightbulb.'),
 makeLevel(8,'Jurutera Cilik','Little Engineer',6,[[0,0],[1,0],[1,1],[1,2],[2,2],[2,3],[3,3],[4,3],[4,4],[5,4],[5,5]],'Semak setiap sudut sebelum menghidupkan lampu.','Check each corner to power the bulb.'),
];
export function rotateTile(tiles:Tile[],id:string):Tile[]{return tiles.map(t=>t.id===id&&!t.fixed?{...t,rotation:((t.rotation+1)%4) as Dir}:t);}
export function poweredCells(level:CircuitLevel,tiles:Tile[]):Set<string>{
 const map=new Map<string,Tile>(tiles.map(t=>[key(t.x,t.y),t] as const));
 const first=level.route[0],last=level.route[level.route.length-1];
 const queue=[key(first.x,first.y)],visited=new Set<string>();
 for(let i=0;i<queue.length;i++){
  const at=queue[i];if(visited.has(at))continue; visited.add(at);
  const tile=map.get(at);if(!tile)continue;
  for(const dir of ports(tile)){
   const [dx,dy]=DIRS[dir],neighbour=map.get(key(tile.x+dx,tile.y+dy));
   if(neighbour&&ports(neighbour).includes(((dir+2)%4) as Dir))queue.push(key(neighbour.x,neighbour.y));
  }
 }
 return visited;
}
export function circuitWon(level:CircuitLevel,tiles:Tile[]):boolean{
 const goal=level.route[level.route.length-1];return poweredCells(level,tiles).has(key(goal.x,goal.y));
}
export function solvedTiles(level:CircuitLevel):Tile[]{
 return level.initial.map((tile,i)=>{
  const cell=level.route[i],dirs:Dir[]=[];
  if(i>0)dirs.push(direction(cell,level.route[i-1]));
  if(i<level.route.length-1)dirs.push(direction(cell,level.route[i+1]));
  return {...tile,rotation:rotationFor(tile.kind,dirs)};
 });
}
export function circuitScore(level:CircuitLevel,moves:number,hints:number){
 return Math.max(40,160+(level.route.length*8)-moves*3-hints*18);
}
