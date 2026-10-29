/* Original, deterministic game rules. No eval, Function, or arbitrary code execution. */
export type BiText = {ms:string;en:string};
const bi=(ms:string,en:string):BiText=>({ms,en});

export const PIXEL_PALETTE = {
  R:{label:bi('Merah','Red'),color:'#fb6e83'},
  B:{label:bi('Biru','Blue'),color:'#638df7'},
  Y:{label:bi('Kuning','Yellow'),color:'#ffc65f'},
  G:{label:bi('Hijau','Green'),color:'#43c8a1'},
  P:{label:bi('Ungu','Purple'),color:'#ab8bed'},
  W:{label:bi('Putih','White'),color:'#ffffff'}
} as const;
export type PixelColor=keyof typeof PIXEL_PALETTE;
export type PixelLevel={id:string;title:BiText;concept:BiText;pattern:string[];tip:BiText};
export const PIXEL_LEVELS:PixelLevel[]=[
 {id:'pixel-1',title:bi('Hati Ceria','Happy Heart'),concept:bi('Koordinat X dan Y','X and Y coordinates'),pattern:['.R.R.','RRRRR','RRRRR','.RRR.','..R..'],tip:bi('Mula pada petak merah di bahagian atas.','Start with a red square near the top.')},
 {id:'pixel-2',title:bi('Bintang Emas','Golden Star'),concept:bi('Ulang warna dalam corak','Patterns and repetition'),pattern:['..Y..','.YYY.','YYYYY','.YYY.','Y...Y'],tip:bi('Warnakan titik tengah dahulu.','Paint the centre pixel first.')},
 {id:'pixel-3',title:bi('Robot Mini','Mini Robot'),concept:bi('Lukis menggunakan grid','Draw using a grid'),pattern:['.BBB.','BBBBB','BWBWB','BBBBB','.B.B.'],tip:bi('Mata robot berwarna putih.','The robot has white eyes.')},
 {id:'pixel-4',title:bi('Bunga Ajaib','Magic Flower'),concept:bi('Bentuk dengan arahan','Shapes as instructions'),pattern:['.P.P.','..P..','.PPP.','..G..','.GGG.'],tip:bi('Kelopak ungu, tangkai hijau.','Purple petals, green stem.')},
 {id:'pixel-5',title:bi('Roket Cilik','Little Rocket'),concept:bi('Gabung arahan warna','Combine paint commands'),pattern:['..R..','.RRR.','.BBB.','RBBBR','Y.Y.Y'],tip:bi('Mulakan dengan muncung merah.','Begin with the red nose cone.')},
 {id:'pixel-6',title:bi('Pelangi Kod','Coding Rainbow'),concept:bi('Bina corak berbilang warna','Multi-colour patterns'),pattern:['RRRRR','YYYYY','GGGGG','BBBBB','PPPPP'],tip:bi('Setiap baris menggunakan satu warna.','Each row uses one colour.')}
];
export const blankPixels=()=>Array.from({length:5},()=>'.'.repeat(5));
export function paintPixel(rows:string[],x:number,y:number,color:PixelColor):string[]{
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<1||x>5||y<1||y>5)throw Error('Coordinates must be between 1 and 5');
 const next=rows.slice();const s=next[y-1];next[y-1]=s.slice(0,x-1)+color+s.slice(x);return next;
}
export const pixelMatchCount=(level:PixelLevel,rows:string[])=>level.pattern.reduce((sum,row,y)=>sum+[...row].filter((char,x)=>char!=='.'&&rows[y]?.[x]===char).length,0);
export const pixelNeeded=(level:PixelLevel)=>level.pattern.join('').split('').filter(char=>char!=='.').length;
export const pixelComplete=(level:PixelLevel,rows:string[])=>rows.length===5&&rows.every((r,y)=>r===level.pattern[y]);
export function pixelScore(level:PixelLevel,mistakes:number){return Math.max(40,pixelNeeded(level)*12+110-Math.max(0,mistakes)*8);}
export type PixelCommand={x:number;y:number;color:PixelColor;line:number};
export class PixelCodeError extends Error {constructor(public line:number,message:string){super(message);this.name='PixelCodeError';}}
export function compilePixelCode(input:string):PixelCommand[]{
 if(input.length>3500)throw new PixelCodeError(0,'Code is too long');
 const lines=input.replace(/\r/g,'').split('\n');if(lines.length>100)throw new PixelCodeError(0,'Too many lines');
 const actions:PixelCommand[]=[];
 for(let n=0;n<lines.length;n++){const s=lines[n].trim();if(!s||s.startsWith('#'))continue;
 const m=s.match(/^paint\(\s*([1-5])\s*,\s*([1-5])\s*,\s*(red|blue|yellow|green|purple|white)\s*\)$/i);
 if(!m)throw new PixelCodeError(n+1,'Use paint(x, y, red) with coordinates 1–5');
 const cmap:Record<string,PixelColor>={red:'R',blue:'B',yellow:'Y',green:'G',purple:'P',white:'W'};
 actions.push({x:+m[1],y:+m[2],color:cmap[m[3].toLowerCase()],line:n+1});
 if(actions.length>75)throw new PixelCodeError(n+1,'Maximum 75 paint commands');
 }
 if(!actions.length)throw new PixelCodeError(1,'Write at least one paint command');return actions;
}

export type SortItem={label:string;bin:0|1};
export type SortLevel={id:string;title:BiText;rule:BiText;bins:[BiText,BiText];items:SortItem[];tip:BiText};
export const SORT_LEVELS:SortLevel[]=[
 {id:'sort-1',title:bi('Nombor Kecil dan Besar','Small and Big'),rule:bi('Jika nombor kurang daripada 5, pilih kotak kiri.','If the number is less than 5, choose the left bin.'),bins:[bi('Kurang 5','Under 5'),bi('5 atau lebih','5 or more')],items:[{label:'2',bin:0},{label:'8',bin:1},{label:'4',bin:0},{label:'9',bin:1},{label:'1',bin:0},{label:'6',bin:1}],tip:bi('Semak sama ada nombor < 5.','Check if the number is < 5.')},
 {id:'sort-2',title:bi('Genap atau Ganjil','Even or Odd'),rule:bi('Nombor genap boleh dibahagi dengan 2.','Even numbers divide exactly by 2.'),bins:[bi('Genap','Even'),bi('Ganjil','Odd')],items:[{label:'6',bin:0},{label:'3',bin:1},{label:'12',bin:0},{label:'7',bin:1},{label:'10',bin:0},{label:'5',bin:1}],tip:bi('Nombor genap berakhir dengan 0, 2, 4, 6 atau 8.','Even numbers end in 0, 2, 4, 6 or 8.')},
 {id:'sort-3',title:bi('Cabaran Sepuluh','The Ten Challenge'),rule:bi('Gunakan keadaan num >= 10.','Use the condition num >= 10.'),bins:[bi('Bawah 10','Below 10'),bi('10 ke atas','10 and up')],items:[{label:'12',bin:1},{label:'5',bin:0},{label:'10',bin:1},{label:'3',bin:0},{label:'15',bin:1},{label:'9',bin:0}],tip:bi('Sepuluh juga termasuk dalam kumpulan kanan.','Ten belongs in the right group too.')},
 {id:'sort-4',title:bi('Kuasa Tiga','Power of Three'),rule:bi('Jika nombor boleh dibahagi dengan 3, pilih kiri.','If divisible by 3, choose the left bin.'),bins:[bi('Gandaan 3','Multiple of 3'),bi('Lain-lain','Other')],items:[{label:'6',bin:0},{label:'8',bin:1},{label:'12',bin:0},{label:'11',bin:1},{label:'15',bin:0},{label:'14',bin:1}],tip:bi('3, 6, 9, 12 dan 15 ialah gandaan 3.','3, 6, 9, 12 and 15 are multiples of 3.')},
 {id:'sort-5',title:bi('Betul atau Salah','True or False'),rule:bi('Nilai setiap perbandingan.','Evaluate each comparison.'),bins:[bi('True','True'),bi('False','False')],items:[{label:'3 < 8',bin:0},{label:'9 < 2',bin:1},{label:'4 == 4',bin:0},{label:'5 > 9',bin:1},{label:'10 >= 8',bin:0},{label:'7 == 1',bin:1}],tip:bi('== bermaksud sama dengan.','== means equal to.')},
 {id:'sort-6',title:bi('Juara Syarat','Condition Champion'),rule:bi('Jika nombor antara 10 dan 20 (termasuk), pilih kiri.','If the number is between 10 and 20 inclusive, choose left.'),bins:[bi('10 hingga 20','10 to 20'),bi('Luar julat','Outside')],items:[{label:'10',bin:0},{label:'25',bin:1},{label:'19',bin:0},{label:'8',bin:1},{label:'20',bin:0},{label:'2',bin:1}],tip:bi('10 dan 20 juga termasuk.','10 and 20 are included.')}
];
export const sortScore=(correct:number,errors:number,finished:boolean)=>Math.max(0,correct*30+(finished?100:0)-errors*12);

export type GardenLevel={id:string;name:BiText;topic:BiText;flowers:number[];tip:BiText};
export const GARDEN_LEVELS:GardenLevel[]=[
 {id:'garden-1',name:bi('Dua Bunga','Two Flowers'),topic:bi('Arahan mengikut turutan','Sequence your commands'),flowers:[0,1],tip:bi('Tanam, bergerak, kemudian tanam lagi.','Plant, move, then plant again.')},
 {id:'garden-2',name:bi('Barisan Bunga','Flower Row'),topic:bi('Ulang langkah yang sama','Repeat a simple action'),flowers:[0,1,2],tip:bi('Boleh guna gelung for untuk mengulang langkah.','Use a for loop to repeat steps.')},
 {id:'garden-3',name:bi('Bunga Berselang','Alternate Flowers'),topic:bi('Lompati petak kosong','Skip empty plots'),flowers:[0,2,4],tip:bi('Gerak dua kali sebelum menanam yang seterusnya.','Move twice before planting the next flower.')},
 {id:'garden-4',name:bi('Taman Simetri','Symmetry Garden'),topic:bi('Rancang susunan','Plan the sequence'),flowers:[1,2,4,5],tip:bi('Biarkan petak pertama kosong.','Leave the first plot empty.')},
 {id:'garden-5',name:bi('Gelung Hebat','Power Loop'),topic:bi('Gelung empat kali','Four-step loops'),flowers:[0,1,2,3],tip:bi('Cuba for i in range(4): untuk perintah yang berulang.','Try for i in range(4): for repeated commands.')},
 {id:'garden-6',name:bi('Taman Juara','Garden Champion'),topic:bi('Gabung gelung dan corak','Combine loops and patterns'),flowers:[1,3,5,6],tip:bi('Buat rancangan: gerak, tanam, ulang.','Make a plan: move, plant, repeat.')}
];
export type GardenCommand={op:'plant'|'right';line:number};
export type GardenFrame={position:number;planted:number[];steps:number;errors:number;line:number;status:'ok'|'duplicate'|'wrong'|'edge'|'win'};
export const initialGardenFrame=():GardenFrame=>({position:0,planted:[],steps:0,errors:0,line:0,status:'ok'});
export class GardenCodeError extends Error {constructor(public line:number,message:string){super(message);this.name='GardenCodeError';}}
export function compileGardenCode(input:string):GardenCommand[]{
 if(input.length>3200)throw new GardenCodeError(0,'Program too long');
 const lines=input.replace(/\r/g,'').split('\n');if(lines.length>90)throw new GardenCodeError(0,'Too many lines');
 const actions:GardenCommand[]=[];
 const add=(op:GardenCommand['op'],line:number)=>{actions.push({op,line});if(actions.length>120)throw new GardenCodeError(line,'Maximum 120 actions');};
 for(let i=0;i<lines.length;i++){
  const raw=lines[i],s=raw.trim();if(!s||s.startsWith('#'))continue;
  const loop=s.match(/^for\s+[A-Za-z_]\w*\s+in\s+range\((\d+)\):$/);
  if(loop){const repeat=+loop[1];if(repeat<1||repeat>20)throw new GardenCodeError(i+1,'Loop must be 1–20 repetitions');
   const inner:GardenCommand[]=[];let j=i+1;for(;j<lines.length;j++){
    const r=lines[j];if(!r.trim())continue;if(!/^\s/.test(r))break;
    const command=r.trim();if(command!=='plant()'&&command!=='move_right()')throw new GardenCodeError(j+1,'Use plant() or move_right() in loops');
    inner.push({op:command==='plant()'?'plant':'right',line:j+1});
   }
   if(!inner.length)throw new GardenCodeError(i+1,'Add an indented loop command');
   for(let k=0;k<repeat;k++)for(const x of inner)add(x.op,x.line);i=j-1;continue;
  }
  if(/^\s/.test(raw))throw new GardenCodeError(i+1,'Unexpected indentation');
  if(s!=='plant()'&&s!=='move_right()')throw new GardenCodeError(i+1,'Use plant() or move_right()');
  add(s==='plant()'?'plant':'right',i+1);
 }
 if(!actions.length)throw new GardenCodeError(1,'Write a command to begin');return actions;
}
export function advanceGarden(level:GardenLevel,frame:GardenFrame,command:GardenCommand):GardenFrame {
 if(frame.status==='win')return frame;
 if(command.op==='right')return {...frame,position:Math.min(6,frame.position+1),steps:frame.steps+1,line:command.line,status:frame.position===6?'edge':'ok'};
 if(frame.planted.includes(frame.position))return {...frame,steps:frame.steps+1,errors:frame.errors+1,line:command.line,status:'duplicate'};
 if(!level.flowers.includes(frame.position))return {...frame,steps:frame.steps+1,errors:frame.errors+1,line:command.line,status:'wrong'};
 const planted=[...frame.planted,frame.position];return {...frame,planted,steps:frame.steps+1,line:command.line,status:planted.length===level.flowers.length?'win':'ok'};
}
export function gardenScore(level:GardenLevel,frame:GardenFrame){return frame.planted.length*35+(frame.status==='win'?120+Math.max(0,70-frame.steps*3):0)-frame.errors*10;}
