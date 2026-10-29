/** Original CilikLab sports puzzles: deterministic sequences, no external game services. */
export type SportId = 'football' | 'basketball' | 'track';
export type SportAction = {id:string;label:string;ms:string;emoji:string;explanation:string};
export type SportLevel = {id:string;index:number;sport:SportId;title:string;msTitle:string;objective:string;steps:string[];story:string;reward:number};
export const SPORTS: Record<SportId,{title:string;msTitle:string;intro:string;emoji:string;art:string;actions:SportAction[]}>={
 football:{title:'Football Playmaker',msTitle:'Perancang Bola Sepak',intro:'Make smart passes, dodge defenders and score a goal.',emoji:'⚽',art:'/arcade/football-playmaker.svg',actions:[
  {id:'pass',label:'Pass',ms:'Hantar',emoji:'🤝',explanation:'Share the ball with your teammate'},
  {id:'dribble',label:'Dribble',ms:'Gelecek',emoji:'🏃',explanation:'Move past a defender'},
  {id:'shoot',label:'Shoot',ms:'Jaring',emoji:'🥅',explanation:'Aim for the goal'},
  {id:'defend',label:'Defend',ms:'Bertahan',emoji:'🛡️',explanation:'Protect the ball from another team'}]},
 basketball:{title:'Hoop Heroes',msTitle:'Wira Bola Keranjang',intro:'Plan your moves, find space and shoot a basket.',emoji:'🏀',art:'/arcade/hoop-heroes.svg',actions:[
  {id:'pass',label:'Pass',ms:'Hantar',emoji:'🤝',explanation:'Pass to an open teammate'},
  {id:'dribble',label:'Dribble',ms:'Gelecek',emoji:'🏀',explanation:'Bounce toward the hoop'},
  {id:'shoot',label:'Shoot',ms:'Jaring',emoji:'🎯',explanation:'Shoot at the basket'},
  {id:'block',label:'Block',ms:'Halang',emoji:'✋',explanation:'Block the opponent’s shot'}]},
 track:{title:'Track & Field Quest',msTitle:'Misi Olahraga',intro:'Program a safe obstacle course and finish the race.',emoji:'🏅',art:'/arcade/track-quest.svg',actions:[
  {id:'run',label:'Run',ms:'Lari',emoji:'👟',explanation:'Run on a clear track'},
  {id:'jump',label:'Jump',ms:'Lompat',emoji:'🐇',explanation:'Jump over a hurdle'},
  {id:'duck',label:'Duck',ms:'Tunduk',emoji:'🙇',explanation:'Duck beneath a low bar'},
  {id:'rest',label:'Recover',ms:'Rehat',emoji:'💧',explanation:'Take a quick water break'}]}
};
const chapters=['First steps','Warm up','Learn the moves','Two challenges','Keep your focus','Smart teamwork','Make your plan','Watch the obstacles','Longer challenge','Championship trail','Expert challenge','The big final'];
const starts:{[K in SportId]:string[][]}={
 football:[['pass','shoot'],['dribble','shoot'],['pass','dribble','shoot']],
 basketball:[['dribble','shoot'],['pass','shoot'],['pass','dribble','shoot']],
 track:[['run','run'],['run','jump'],['run','duck','run']]
};
function makeSequence(sport:SportId,level:number):string[]{
 if(level<3)return [...starts[sport][level]];
 const all=SPORTS[sport].actions.map(a=>a.id);
 const size=Math.min(10,3+Math.floor((level+1)*0.65));
 const values=Array.from({length:size},(_,i)=>all[(i*3+level*5+Math.floor(i/2))%all.length]);
 // Finishing with a goal is appropriate in ball games; the track ends by running.
 values[size-1]=sport==='track'?'run':'shoot';
 return values;
}
export const SPORT_LEVELS:Record<SportId,SportLevel[]>=Object.fromEntries((Object.keys(SPORTS) as SportId[]).map(sport=>[sport,Array.from({length:12},(_,index)=>({
 id:`sport-${sport}-${index+1}`,sport,index,title:chapters[index],msTitle:`Tahap ${index+1}`,objective:index<3?'Choose the actions to finish the mission.':'Plan each move. Use order and repetition to complete the play.',
 steps:makeSequence(sport,index),story:index<3?'Practice one move at a time.':'Look at each scene carefully and choose the matching action.',reward:60+index*10
}))])) as Record<SportId,SportLevel[]>;
export const sportEventText=(sport:SportId,action:string):string=>{
 const hints:Record<SportId,Record<string,string>>={
  football:{pass:'Your teammate is open. Pass to them.',dribble:'A defender approaches. Dribble around them.',shoot:'The goal is clear! Take your shot.',defend:'The other team has the ball. Defend.'},
  basketball:{pass:'A teammate is free. Pass the ball.',dribble:'There is room ahead. Dribble.',shoot:'You are near the hoop. Shoot!',block:'An opponent is shooting. Block.'},
  track:{run:'Clear track ahead: run.',jump:'A hurdle is ahead: jump!',duck:'A low bar is ahead: duck!',rest:'The water station is here: recover.'}}
 return hints[sport][action]||'';
};
/** Validate exactly one action for each scene, in order, with detailed mismatch. */
export function evaluateSport(level:SportLevel,answers:string[]):{passed:boolean;firstWrong:number;correct:number}{
 const firstWrong=level.steps.findIndex((expected,i)=>answers[i]!==expected);
 return {passed:firstWrong===-1&&answers.length===level.steps.length,firstWrong:firstWrong===-1&&answers.length!==level.steps.length?answers.length:firstWrong,correct:level.steps.reduce((n,s,i)=>n+Number(answers[i]===s),0)};
}
