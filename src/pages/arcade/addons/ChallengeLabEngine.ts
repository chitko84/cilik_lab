/** Two independent, increasingly challenging game engines. No server or paid assets required. */
export type CipherLevel={id:string;word:string;shift:number;title:string;hint:string;xp:number};
const cipherWords=['CAT','HERO','MOON','ROBOT','BRAVE','SIGNAL','PLANET','GADGET','RESCUE','DINOSAUR','STARLIGHT','SUPERPOWER'];
export const CIPHER_LEVELS:CipherLevel[]=cipherWords.map((word,i)=>({id:`cipher-${i+1}`,word,shift:1+(i%7),title:['First secret','A caped clue','Moon message','Robot radio','Courage code','The hidden signal','Planet patrol','Inventor lab','A rescue note','Jurassic mystery','Star beacon','Final hero code'][i],hint:i<4?'Find the original letters by moving backwards.':i<8?'Try a few backwards shifts. Notice the same shift works for every letter.':'A long message needs patience: keep all letters moving by the same number.',xp:50+10*i}));
export function encryptMessage(word:string,shift:number):string{return word.toUpperCase().replace(/[A-Z]/g,c=>String.fromCharCode(65+(c.charCodeAt(0)-65+shift)%26))}
export function decryptMessage(word:string,shift:number):string{return encryptMessage(word,26-(shift%26))}
export type PatternLevel={id:string;title:string;sequence:number[];answer:number;hint:string;choices:number[];xp:number};
const patternRows:{sequence:number[];answer:number;title:string;hint:string}[]=[
 {sequence:[2,4,6,8],answer:10,title:'Dinosaur footprints',hint:'Add 2 each time.'},
 {sequence:[3,6,9,12],answer:15,title:'Raptor steps',hint:'Add 3 to get the next number.'},
 {sequence:[10,9,8,7],answer:6,title:'Fossil countdown',hint:'Take away 1 each time.'},
 {sequence:[4,8,12,16],answer:20,title:'Four eggs per nest',hint:'Count by fours.'},
 {sequence:[2,4,8,16],answer:32,title:'Dino population doubles',hint:'Multiply the previous number by 2.'},
 {sequence:[1,3,6,10],answer:15,title:'Ancient triangles',hint:'The added amount grows by 1 each time: +2, +3, +4 ...'},
 {sequence:[1,1,2,3,5],answer:8,title:'Fossil Fibonacci',hint:'Add the two previous numbers.'},
 {sequence:[30,25,20,15],answer:10,title:'Explorer supplies',hint:'Take away 5 each time.'},
 {sequence:[1,4,9,16],answer:25,title:'Square stepping stones',hint:'The numbers are 1×1, 2×2, 3×3, 4×4 ...'},
 {sequence:[2,6,12,20],answer:30,title:'Footprint multiplication',hint:'Think 1×2, 2×3, 3×4, 4×5 ...'},
 {sequence:[3,5,9,17],answer:33,title:'Dino eggs mystery',hint:'Multiply by 2 then subtract 1.'},
 {sequence:[2,3,5,8,12],answer:17,title:'The fossil finale',hint:'Add 1, then 2, then 3, then 4, then 5.'}
];
export const PATTERN_LEVELS:PatternLevel[]=patternRows.map((r,i)=>{
 const distractors=[r.answer-1,r.answer+2,r.answer+Math.max(3,i+1)];
 const choices=[r.answer,...distractors].sort((a,b)=>((a*7+i*3)%13)-((b*7+i*3)%13));
 return {id:`fossil-${i+1}`,...r,choices,xp:45+i*12};
});
export const checkCipher=(l:CipherLevel,shift:number)=>decryptMessage(encryptMessage(l.word,l.shift),shift)===l.word;
export const checkPattern=(l:PatternLevel,guess:number)=>l.answer===guess;
