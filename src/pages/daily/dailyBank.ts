import {EXTRA_DAILY_PROBLEMS} from './dailyExpandedBank';
/** 100 deterministic, locally assessed Python practice problems.
 * No network, LLM, hidden execution, or invented test results are involved.
 * Each challenge has an authored runnable solution and an exact stdout contract.
 */
export type DailyProblem = {
 id:string; title:string; story:string; instructions:string; difficulty:'Starter'|'Explorer'|'Challenger';
 world:string; skill:string; starter:string; solution:string; expected:string; hint:string; points:number;
};
const worlds = [
 {name:'Robot Academy',hero:'Ciko',thing:'batteries'},
 {name:'Hero City',hero:'the caped hero',thing:'power stars'},
 {name:'Jungle Expedition',hero:'the jungle explorer',thing:'dinosaurs'},
 {name:'Space Patrol',hero:'the astronaut',thing:'moon rocks'},
 {name:'Malaysian Legends',hero:'the clever mousedeer',thing:'mangoes'},
 {name:'Bengal Storyland',hero:'the storybook tiger',thing:'laddus'},
 {name:'Ocean Rescue',hero:'the dolphin',thing:'pearls'},
 {name:'Dinosaur Park',hero:'the park ranger',thing:'fossils'},
 {name:'Mystery Mansion',hero:'the night detective',thing:'clues'},
 {name:'Coding Carnival',hero:'the carnival robot',thing:'tickets'},
] as const;
const quote=(value:string)=>JSON.stringify(value);
const ORIGINAL_DAILY_PROBLEMS:DailyProblem[]=worlds.flatMap((w,j)=>{
 const a=7+j*2, b=2+(j%4), c=3+(j%3);
 const intro=`${w.hero} needs your Python skills in ${w.name}.`;
 const templates:{title:string;skill:string;instructions:string;solution:string;expected:string;hint:string;difficulty:DailyProblem['difficulty']}[]=[
  {title:'Say hello',skill:'print()',instructions:`Print exactly: Welcome to ${w.name}!`,solution:`print(${quote('Welcome to '+w.name+'!')})`,expected:`Welcome to ${w.name}!`,hint:'Use print() and put text inside quotes.',difficulty:'Starter'},
  {title:'Count the collection',skill:'addition',instructions:`${w.hero} finds ${a} ${w.thing} and then ${b} more. Print the total number.`,solution:`print(${a} + ${b})`,expected:String(a+b),hint:'Use the + operator inside print().',difficulty:'Starter'},
  {title:'Share fairly',skill:'subtraction',instructions:`There are ${a} ${w.thing}. Give away ${b}. Print how many remain.`,solution:`print(${a} - ${b})`,expected:String(a-b),hint:'Subtraction uses a minus sign (-).',difficulty:'Starter'},
  {title:'Double the supplies',skill:'multiplication',instructions:`Each of ${b} teams finds ${a} ${w.thing}. Print the combined amount.`,solution:`print(${a} * ${b})`,expected:String(a*b),hint:'In Python, multiplication uses *.',difficulty:'Explorer'},
  {title:'Find the remainder',skill:'modulo',instructions:`Put ${a} ${w.thing} into groups of ${c}. Print the number left over.`,solution:`print(${a} % ${c})`,expected:String(a%c),hint:'The remainder operator is %.',difficulty:'Explorer'},
  {title:'Store your score',skill:'variables',instructions:`Start score at ${a}, then add ${b}. Print the final score. Use a variable called score.`,solution:`score = ${a}\nscore += ${b}\nprint(score)`,expected:String(a+b),hint:'Create score = number, then use score += number.',difficulty:'Explorer'},
  {title:'Three checkpoints',skill:'sequences',instructions:`Print three checkpoint numbers on separate lines: ${b}, ${b+1}, and ${b+2}.`,solution:`print(${b})\nprint(${b+1})\nprint(${b+2})`,expected:`${b}\n${b+1}\n${b+2}`,hint:'Each print() produces one new line.',difficulty:'Explorer'},
  {title:'A clever loop',skill:'for loops',instructions:`Use a for loop to print the numbers 1, 2, 3 and 4, one per line.`,solution:'for i in range(1, 5):\n    print(i)',expected:'1\n2\n3\n4',hint:'for i in range(1, 5): then indent print(i).',difficulty:'Challenger'},
  {title:'Choose the bigger value',skill:'conditions',instructions:`Compare ${a} and ${b}. Print Bigger if ${a} is larger, otherwise print Smaller. Use if and else.`,solution:`if ${a} > ${b}:\n    print("Bigger")\nelse:\n    print("Smaller")`,expected:'Bigger',hint:'Use if condition: followed by indented print().',difficulty:'Challenger'},
  {title:'Power-up calculation',skill:'combined operations',instructions:`${w.hero} has ${a} points. Earn ${b} bonus points, then triple the total. Print the result.`,solution:`power = ${a} + ${b}\npower *= 3\nprint(power)`,expected:String((a+b)*3),hint:'First add the bonus to a variable, then multiply using *=.',difficulty:'Challenger'},
 ];
 return templates.map((p,i)=>({
 id:`daily-${String(j*10+i+1).padStart(3,'0')}`,title:`${w.name}: ${p.title}`,
 story:intro,instructions:p.instructions,difficulty:p.difficulty,world:w.name,skill:p.skill,
 starter:i===7?'# Complete the loop\nfor i in range(1, 5):\n    ':i===8?'# Complete the decision\n':'# Write your Python here\n',
 solution:p.solution,expected:p.expected,hint:p.hint,
 points:p.difficulty==='Starter'?20:p.difficulty==='Explorer'?35:50
 }));
});
export const DAILY_PROBLEMS:DailyProblem[]=[...ORIGINAL_DAILY_PROBLEMS,...EXTRA_DAILY_PROBLEMS];
export type DailyRecord={id:string;score:number;attempts:number;lastSolved:string;lastAttempt:string;code:string};
export const DAILY_KEY='ciliklab_daily_solver_v1';
export function readDailyRecords():Record<string,DailyRecord>{try{const v=JSON.parse(localStorage.getItem(DAILY_KEY)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch{return {}}}
export function dailyChallengeId(date=new Date()){const start=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate());const days=Math.floor(start/86400000);return DAILY_PROBLEMS[days%DAILY_PROBLEMS.length].id;}
export function totalDailyPoints(records:Record<string,DailyRecord>){return Object.values(records).reduce((acc,r)=>acc+r.score,0)}
export function dailyStreak(records:Record<string,DailyRecord>,today=new Date()){let result=0;const day=new Date(today.getFullYear(),today.getMonth(),today.getDate());for(let i=0;i<365;i++){const key=`${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;if(Object.values(records).some(r=>r.score>0&&r.lastSolved.slice(0,10)===key))result++;else if(i>0||Object.values(records).some(r=>r.score>0&&r.lastSolved.slice(0,10)===key)===false && i!==0)break;else if(i===0) {day.setDate(day.getDate()-1);continue;}day.setDate(day.getDate()-1)}return result}
