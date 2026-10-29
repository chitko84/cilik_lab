/** Original CilikLab quiz wording. Stable, child-appropriate facts; no runtime API needed.
 * Format: question | option 1 | option 2 | option 3 | option 4 | correct option 0..3 | explanation
 */
export const QUIZ_TOPICS=[
 {id:'animals',en:'Animal Kingdom',ms:'Dunia Haiwan',icon:'🦁',color:'#e8f5dd',tag:'Living world'},
 {id:'science',en:'Everyday Science',ms:'Sains Harian',icon:'🔬',color:'#e8f3ff',tag:'Discoveries'},
 {id:'space',en:'Space Explorers',ms:'Peneroka Angkasa',icon:'🪐',color:'#eee9ff',tag:'Our universe'},
 {id:'geography',en:'Around the World',ms:'Keliling Dunia',icon:'🌍',color:'#e7f5ef',tag:'Places'},
 {id:'heroes',en:'Superhero Fun',ms:'Wira Super',icon:'🦸',color:'#fff0df',tag:'Fiction & comics'},
 {id:'nature',en:'Nature Detectives',ms:'Detektif Alam',icon:'🌱',color:'#e6f4e6',tag:'Our planet'},
 {id:'coding',en:'Computers & Code',ms:'Komputer & Kod',icon:'💻',color:'#e7f3ff',tag:'Tech skills'},
 {id:'arts',en:'Sports & Arts',ms:'Sukan & Seni',icon:'🎨',color:'#fff0ec',tag:'Play & creativity'},
] as const;
export type QuizTopic=typeof QUIZ_TOPICS[number]['id'];
export type QuizQuestion={id:string;topic:QuizTopic;question:string;options:[string,string,string,string];correct:0|1|2|3;explanation:string};
const RAW:Record<QuizTopic,string>= {
 animals:`Which animal is the largest on land?|African elephant|Giraffe|Hippopotamus|Zebra|0|African elephants are the largest living land animals.
Which animal begins life as a tadpole?|Frog|Rabbit|Duck|Cat|0|A tadpole grows into a frog.
How many arms does an octopus have?|Eight|Six|Ten|Four|0|An octopus has eight arms.
Which animal makes honey?|Honeybee|Butterfly|Ant|Beetle|0|Honeybees make honey from flower nectar.
Which bird cannot fly but swims very well?|Penguin|Eagle|Owl|Sparrow|0|Penguins use their wings as flippers in the water.
Which animal is a mammal?|Dolphin|Shark|Goldfish|Octopus|0|Dolphins breathe air and feed milk to their young.
What do giant pandas mainly eat?|Bamboo|Meat|Seaweed|Grasshoppers|0|Bamboo makes up most of a giant panda's diet.
Which mammal is capable of sustained flight?|Bat|Squirrel|Koala|Panda|0|Bats are the only mammals that truly fly.
Which animal is famous for its very fast running speed?|Cheetah|Sloth|Tortoise|Hippo|0|Cheetahs are the fastest land animals over short distances.
Which animal carries its baby in a pouch?|Kangaroo|Horse|Tiger|Elephant|0|Female kangaroos carry their joeys in pouches.`,
 science:`What pulls objects toward the ground?|Gravity|Light|Sound|Heat|0|Gravity pulls objects toward Earth.
What does the heart pump around the body?|Blood|Water|Air|Food|0|The heart pumps blood through the circulatory system.
Which organ helps you hear sounds?|Ears|Nose|Elbows|Teeth|0|Your ears detect sound vibrations.
Which material is strongly attracted to a magnet?|Iron|Wood|Paper|Glass|0|Iron is attracted to magnets.
What do we call water when it becomes a solid?|Ice|Steam|Mist|Rain|0|Frozen water is ice.
Which part of a plant often makes food using sunlight?|Leaves|Roots|Seeds|Trunk|0|Leaves use sunlight for photosynthesis.
At normal air pressure, around what temperature does pure water freeze?|0 degrees Celsius|20 degrees Celsius|50 degrees Celsius|100 degrees Celsius|0|Water freezes at about 0°C at normal pressure.
What causes day and night on Earth?|Earth spinning on its axis|Clouds moving|The Moon glowing|Rain falling|0|Different parts of Earth face the Sun as Earth rotates.
Which of these is a gas?|Oxygen|Ice|Stone|Pencil|0|Oxygen is a gas in the air around us.
Which body part is the main control center for thinking?|Brain|Stomach|Knee|Skin|0|The brain controls thinking and many body functions.`,
 space:`What kind of object is the Sun?|A star|A planet|A moon|A comet|0|The Sun is the star at the center of our solar system.
Which planet is third from the Sun?|Earth|Venus|Mars|Jupiter|0|Earth is the third planet from the Sun.
Which planet is called the Red Planet?|Mars|Neptune|Saturn|Earth|0|Iron-rich dust helps give Mars its reddish color.
What orbits Earth naturally?|The Moon|The Sun|Jupiter|Mercury|0|Our Moon is Earth's natural satellite.
Which is the largest planet in our solar system?|Jupiter|Mars|Earth|Venus|0|Jupiter is the largest planet in our solar system.
Which planet is famous for its beautiful rings?|Saturn|Mercury|Venus|Mars|0|Saturn has a large system of icy rings.
Which galaxy contains our solar system?|Milky Way|Andromeda|Whirlpool|Sombrero|0|Our solar system lies inside the Milky Way galaxy.
What do astronauts wear to work outside a spacecraft?|A spacesuit|A raincoat|A school uniform|A wetsuit|0|Spacesuits help protect astronauts in space.
How many planets orbit the Sun in our solar system?|Eight|Six|Ten|Twelve|0|The International Astronomical Union recognizes eight planets.
Which planet is closest to the Sun?|Mercury|Earth|Jupiter|Uranus|0|Mercury is the innermost planet.`,
 geography:`What is the capital city of France?|Paris|Rome|Berlin|Madrid|0|Paris is the capital of France.
What is the capital city of Japan?|Tokyo|Seoul|Bangkok|Beijing|0|Tokyo is Japan's capital.
On which continent is Egypt?|Africa|Europe|South America|Australia|0|Egypt is located in northeastern Africa.
Which is Earth's largest ocean?|Pacific Ocean|Arctic Ocean|Indian Ocean|Atlantic Ocean|0|The Pacific is the largest ocean.
The Amazon rainforest is mostly on which continent?|South America|Europe|Antarctica|Australia|0|The Amazon rainforest spreads across northern South America.
Mount Everest is part of which mountain range?|Himalayas|Alps|Andes|Rockies|0|Mount Everest lies in the Himalayas.
Which country is also the name of a continent?|Australia|Canada|Japan|Kenya|0|Australia is both a country and a continent in common school geography.
On which continent is the Sahara Desert?|Africa|Asia|Europe|Antarctica|0|The Sahara is a large desert in North Africa.
What imaginary line circles Earth halfway between the poles?|Equator|Prime meridian|Tropic of Cancer|Date line|0|The equator divides Earth into northern and southern hemispheres.
Which direction is opposite to north?|South|East|West|Up|0|South is the opposite compass direction to north.`,
 heroes:`Who is Batman's secret identity?|Bruce Wayne|Tony Stark|Peter Parker|Clark Kent|0|Bruce Wayne protects Gotham City as Batman.
Which fictional city is Batman known for protecting?|Gotham City|Metropolis|Wakanda|Asgard|0|Gotham City is Batman's home city.
Who is Batman's trusted butler and helper?|Alfred Pennyworth|Nick Fury|Loki|Doctor Strange|0|Alfred supports Bruce Wayne and helps him as Batman.
Who wears the Iron Man suit?|Tony Stark|Steve Rogers|Bruce Banner|Peter Quill|0|Tony Stark is Iron Man in Marvel stories.
What weapon is Thor famous for using?|A hammer|A bow|A shield|A trident|0|Thor's famous hammer is called Mjolnir.
Which hero often carries a circular shield?|Captain America|Spider-Man|Batman|The Flash|0|Captain America is well known for his shield.
Who transforms into the Hulk?|Bruce Banner|Tony Stark|Alfred|Clark Kent|0|Bruce Banner transforms into the Hulk.
Which fictional African nation is the home of Black Panther?|Wakanda|Gotham|Narnia|Atlantis|0|Black Panther protects Wakanda.
Which heroine often uses the Lasso of Truth?|Wonder Woman|Black Widow|Supergirl|Wasp|0|Wonder Woman is known for her Lasso of Truth.
Which hero can climb walls and swing through a city?|Spider-Man|Aquaman|Thor|Green Lantern|0|Spider-Man uses his powers and webs to move around the city.`,
 nature:`Which part of a plant absorbs water from the soil?|Roots|Flowers|Leaves|Fruit|0|Roots take up water and minerals.
What can appear when sunlight passes through raindrops?|Rainbow|Volcano|Earthquake|Tornado|0|Raindrops can split sunlight into rainbow colors.
What does a caterpillar turn into in many butterfly species?|Butterfly|Fish|Frog|Bee|0|A caterpillar changes into a butterfly during metamorphosis.
What gas do many plants release during photosynthesis?|Oxygen|Helium|Methane|Neon|0|Photosynthesis releases oxygen into the air.
What is the thick central stem of a tree called?|Trunk|Petal|Wing|Fin|0|A trunk supports a tree's branches.
What are most clouds made of?|Tiny water droplets or ice crystals|Cotton|Sand|Smoke only|0|Clouds contain tiny drops of water or ice crystals.
What do we call molten rock after it erupts onto Earth's surface?|Lava|Snow|Soil|Coal|0|Magma becomes lava when it reaches the surface.
Which item can often be recycled into new paper?|Old newspaper|Banana peel|Broken glass cup|Used battery|0|Paper can often be collected and recycled.
What can fossils teach us about?|Life from long ago|Tomorrow's weather|Computer passwords|Future planets|0|Fossils preserve clues about ancient living things.
What is wind?|Moving air|Frozen water|Loud sunlight|Moving soil|0|Wind is air moving from one place to another.`,
 coding:`Which language is used in CilikLab's Python lessons?|Python|Music|French|HTML only|0|CilikLab teaches Python-style coding ideas.
What does a loop help a program do?|Repeat instructions|Turn off the screen|Paint a wall|Delete the internet|0|Loops repeat a set of instructions.
What does an if statement help a program make?|A decision|A snack|A photograph|A phone call|0|An if statement runs code depending on a condition.
What does a variable store in a program?|A value|A bicycle|A cloud|A keyboard|0|Variables let programs remember data.
What is a bug in computer code?|A mistake or problem|A tiny pet|A new keyboard|A music note|0|A bug makes a program behave incorrectly.
Which Python function can display a message?|print()|sleep()|jump()|dance()|0|print() sends output to the screen or console.
What device is often used to type letters into a computer?|Keyboard|Speaker|Monitor|Printer|0|A keyboard lets you enter text.
What part of a computer shows pictures and words?|Monitor|Mousepad|USB cable|Microphone|0|A monitor displays information.
What connects many computers around the world?|The internet|A pencil|A ruler|A flashlight|0|The internet connects networks worldwide.
What is a good rule for passwords?|Keep them private|Share them with strangers|Write them on public pages|Use your name everywhere|0|Strong, private passwords help protect accounts.`,
 arts:`Which player usually protects the goal in football (soccer)?|Goalkeeper|Striker|Referee|Coach|0|The goalkeeper guards the goal.
What do players try to score through in basketball?|A hoop|A net on the ground|A wicket|A finish gate|0|Basketball players shoot a ball into a raised hoop.
What equipment do people use to hit a tennis ball?|Racket|Baseball bat|Hockey stick|Golf club|0|Tennis players use rackets.
Where is a swimming race usually held?|Swimming pool|Football field|Basketball court|Tennis court|0|Swimming races are often held in pools.
What tool might an artist use to paint a picture?|Paintbrush|Spoon|Compass|Whistle|0|Paintbrushes spread paint onto a surface.
What is rhythm in music?|A pattern of beats|A kind of animal|A map|A planet|0|Rhythm organizes beats in time.
What instrument has black and white keys?|Piano|Drum|Trumpet|Triangle|0|A piano has rows of black and white keys.
How many players are on the field for one standard football team?|Eleven|Five|Seven|Fifteen|0|A standard association football team fields eleven players.
Which chess piece must be protected from checkmate?|King|Pawn|Knight|Bishop|0|Checkmate happens when a king is threatened without escape.
How many interlocking rings are on the Olympic symbol?|Five|Three|Seven|Ten|0|The Olympic symbol contains five rings.`,
};
export const QUIZ_QUESTIONS:QuizQuestion[]=Object.entries(RAW).flatMap(([topic,lines])=>lines.trim().split('\n').map((line,i)=>{
 const [question,a,b,c,d,correct,explanation]=line.split('|');
 const original=[a,b,c,d]; const shift=(i+QUIZ_TOPICS.findIndex(t=>t.id===topic))%4;
 const reordered=original.map((_,j)=>original[(j-shift+4)%4]) as [string,string,string,string];
 return {id:`${topic}-${i+1}`,topic:topic as QuizTopic,question,options:reordered,correct:((Number(correct)+shift)%4) as 0|1|2|3,explanation};
}));
export function quizScore(answers:Record<string,number|null>,questions:QuizQuestion[]){return questions.reduce((sum,q)=>sum+Number(answers[q.id]===q.correct),0);}
export function quizGrade(score:number,total:number){const pct=score/Math.max(1,total);return pct>=.9?'Superstar!':pct>=.7?'Great work!':pct>=.5?'Keep exploring!':'Every question helps you learn!';}
