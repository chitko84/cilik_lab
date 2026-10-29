/** Fifty additional, authored children's programming challenges. Original 100 IDs are retained.
 * Named fictional heroes are used only as educational references, not official branding.
 */
import type {DailyProblem} from './dailyBank';
const places = [
 {world:'Gotham Gadget School',hero:'Batman',item:'signal lights',a:8,b:3},
 {world:'Armored Inventor Lab',hero:'Iron Man',item:'power cells',a:12,b:4},
 {world:'Jurassic Discovery',hero:'the dinosaur park ranger',item:'fossils',a:15,b:6},
 {world:'Kampung Hero Tales',hero:'Sang Kancil',item:'mangoes',a:11,b:5},
 {world:'Bengal Wonder Academy',hero:'Meena and her friends',item:'books',a:14,b:2}
] as const;
const chapterTitles=[
 ['Activate the Bat-Signal','Gotham light counter','Three night-patrol rules','Batmobile battery packs','Gadget-kit leftovers','Night-watch badge score','Countdown at Wayne Tower','Rooftop safety sensor','Six training rounds','Guardian mission complete'],
 ['Iron Man suit greeting','Arc reactor energy tally','Three suit startup checks','Workshop power-cell boxes','Armor component sharing','Flight-training badge tracker','Launch-pad countdown','Suit battery safety','Six robotic calibration tests','Tony’s champion readout'],
 ['Welcome to the fossil camp','Count the triceratops fossils','Three dinosaur-park reminders','Raptor enclosure supplies','Share the field tools','Fossil expedition score','Volcano warning countdown','Dinosaur gate sensor','Six dinosaur rescue drills','Ranger champion report'],
 ['Sang Kancil greets the forest','Mango basket counting','Three jungle safety steps','Village harvest crates','Share food with the animals','Forest friendship points','Festival countdown','Bridge safety check','Six clever jungle lessons','Kampung hero finale'],
 ['Meena starts the reading club','School library book tally','Three friendship messages','Books for learning circles','Share classroom supplies','Reading-star progress','School-bell countdown','Classroom safety check','Six learning adventures','Bengal learning champion']
] as const;
const chapterContext=[
 'Help Batman prepare a safe and clever plan for Gotham City.',
 'Help Iron Man build a responsible, energy-efficient hero suit.',
 'Explore a fictional dinosaur park while learning the basics of Python.',
 'Help Sang Kancil solve a village problem with kindness and logic.',
 'Join Meena and her friends in a friendly learning adventure.'
] as const;
type Challenge = Omit<DailyProblem,'id'|'world'|'story'>;
export const EXTRA_DAILY_PROBLEMS:DailyProblem[]=places.flatMap((w,j)=>{
 const n=w.a, m=w.b, label=w.hero;
 const data:Challenge[]=[
  {title:'Welcome, young hero!',difficulty:'Starter',skill:'print()',instructions:`${label} is opening the academy. Print exactly: Mission ready!`,solution:`print("Mission ready!")`,expected:'Mission ready!',starter:'# A hero begins with one line of code\n',hint:'Put the message inside print("...").',points:20},
  {title:'Count the mission supplies',difficulty:'Starter',skill:'arithmetic',instructions:`${label} collects ${n} ${w.item}, then ${m} more. Print the total.`,solution:`print(${n} + ${m})`,expected:String(n+m),starter:'# Add the supplies\n',hint:'Use + inside print().',points:25},
  {title:'Three safety reminders',difficulty:'Starter',skill:'sequences',instructions:'Print Ready, Set, and Go on three separate lines, in that order.',solution:'print("Ready")\nprint("Set")\nprint("Go")',expected:'Ready\nSet\nGo',starter:'# Three print statements, one per line\n',hint:'Each print creates a new line.',points:25},
  {title:'Power cells in every box',difficulty:'Explorer',skill:'multiplication',instructions:`There are ${m} supply boxes and each holds ${n} ${w.item}. Print the total.`,solution:`boxes = ${m}\nitems = ${n}\nprint(boxes * items)`,expected:String(m*n),starter:'# Store the numbers in variables\n',hint:'Multiply with *; try variables.',points:35},
  {title:'Split the team supplies',difficulty:'Explorer',skill:'floor division',instructions:`The team has ${n*m} ${w.item} shared equally by ${m} teams. Print how many each team gets.`,solution:`print(${n*m} // ${m})`,expected:String(n),starter:'# Find an even share\n',hint:'Python uses // for whole-number division.',points:35},
  {title:'Mission badge tracker',difficulty:'Explorer',skill:'variables',instructions:`Start with ${n} badges, earn ${m} more, then spend 2 badges. Print the final number. Use a variable called badges.`,solution:`badges = ${n}\nbadges += ${m}\nbadges -= 2\nprint(badges)`,expected:String(n+m-2),starter:'badges = 0\n# Update the badges\n',hint:'Use badges += ... and badges -= ...',points:40},
  {title:'Countdown before launch',difficulty:'Explorer',skill:'loops',instructions:'Use a for loop to print 3, 2, 1 on separate lines.',solution:'for tick in range(3, 0, -1):\n    print(tick)',expected:'3\n2\n1',starter:'# Count backwards using range()\n',hint:'range(3, 0, -1) walks backwards.',points:40},
  {title:'Hero safety check',difficulty:'Challenger',skill:'if / else',instructions:`If the energy value ${n} is at least 10, print Safe. Otherwise print Recharge. Use if and else.`,solution:`energy = ${n}\nif energy >= 10:\n    print("Safe")\nelse:\n    print("Recharge")`,expected:n>=10?'Safe':'Recharge',starter:`energy = ${n}\n# Add an if / else decision\n`,hint:'Use if energy >= 10: and else:, with indented print statements.',points:50},
  {title:'Train six times',difficulty:'Challenger',skill:'for loops',instructions:'The hero trains six times. Use a for loop to print Training! on six separate lines.',solution:'for step in range(6):\n    print("Training!")',expected:Array(6).fill('Training!').join('\n'),starter:'# Repeat six times using range()\n',hint:'Use for step in range(6): and an indented print.',points:60},
  {title:'Champion score report',difficulty:'Challenger',skill:'variables + loop + condition',instructions:`Start score at ${n}. Use a for loop to add ${m} points three times, then print Champion if score is at least ${n+3*m}, else print Keep going.`,solution:`score = ${n}\nfor turn in range(3):\n    score += ${m}\nif score >= ${n+3*m}:\n    print("Champion")\nelse:\n    print("Keep going")`,expected:'Champion',starter:`score = ${n}\n# Repeat the bonus, then check the score\n`,hint:'Repeat score += bonus three times, then check with if.',points:70}
 ];
 return data.map((p,i)=>({id:`daily-${String(101+j*10+i).padStart(3,'0')}`,world:w.world,story:chapterContext[j],...p,title:`${w.world}: ${chapterTitles[j][i]}`}));
});
