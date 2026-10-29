/** Original, deterministic educational challenge data; no eval or remote execution. */
export type TextPair={ms:string;en:string};
export type Choice={id:string;title:TextPair;result:TextPair;right:boolean};
export type StoryChapter={id:string;title:TextPair;place:TextPair;intro:TextPair;lesson:TextPair;variable:string;value:boolean;choices:[Choice,Choice];tip:TextPair;scene:string};
const pair=(ms:string,en:string):TextPair=>({ms,en});
export const STORY_CHAPTERS:StoryChapter[]=[
 {id:'story-1',title:pair('Musang yang Hilang','The Lost Fox'),place:pair('Hutan Cahaya','Sunlit Forest'),intro:pair('Ciko jumpa seekor musang kecil. Ada peta dan dua laluan. Yang mana lebih selamat?','Ciko finds a lost fox. There is a map and two paths. Which is safer?'),lesson:pair('Jika ada peta, ikut laluan hutan yang ditandakan.','If you have a map, follow the marked forest path.'),variable:'has_map',value:true,choices:[{id:'forest',title:pair('Laluan hutan','Forest trail'),result:pair('Musang menemui jalan pulang!','The fox finds its way home!'),right:true},{id:'mountain',title:pair('Laluan gunung','Mountain trail'),result:pair('Kabut tebal! Ciko berpatah balik.','Heavy fog! Ciko turns back.'),right:false}],tip:pair('Semak nilai has_map sebelum memilih laluan.','Check has_map before choosing a path.'),scene:'forest'},
 {id:'story-2',title:pair('Jambatan Bintang','Star Bridge'),place:pair('Lembah Pelangi','Rainbow Valley'),intro:pair('Kawan Ciko mahu menyeberang. Jambatan kecil hanya boleh digunakan apabila ia kukuh.','Ciko’s friend needs to cross. The little bridge is usable only when it is strong.'),lesson:pair('Semak jambatan sebelum menyeberang.','Check the bridge before crossing.'),variable:'bridge_safe',value:false,choices:[{id:'cross',title:pair('Terus menyeberang','Cross now'),result:pair('Jambatan bergoyang. Ciko berhenti dahulu.','The bridge wobbles. Ciko stops.'),right:false},{id:'repair',title:pair('Baiki jambatan','Repair bridge'),result:pair('Jambatan dibaiki. Semua orang selamat!','The bridge is repaired. Everyone is safe!'),right:true}],tip:pair('bridge_safe ialah False. Pilih tindakan selamat.','bridge_safe is False. Choose the safer action.'),scene:'bridge'},
 {id:'story-3',title:pair('Robot Taman','Garden Robot'),place:pair('Taman Awan','Cloud Garden'),intro:pair('Bunga layu dan awan menghalang cahaya. Adakah bunga sudah disiram?','Flowers are drooping under the clouds. Have they been watered?'),lesson:pair('Periksa keadaan sebelum memilih tindakan.','Check the condition before acting.'),variable:'watered',value:false,choices:[{id:'water',title:pair('Siram bunga','Water flowers'),result:pair('Bunga berkembang mekar. Hebat!','The flowers bloom. Lovely!'),right:true},{id:'dance',title:pair('Menari sahaja','Only dance'),result:pair('Menari menyeronokkan, tetapi bunga masih dahaga.','Dancing is fun, but the flowers are still thirsty.'),right:false}],tip:pair('Jika watered False, bunga perlukan air.','If watered is False, the flowers need water.'),scene:'garden'},
 {id:'story-4',title:pair('Kota Robot','Robot Village'),place:pair('Kota Kilauan','Shimmer Town'),intro:pair('Lampu robot tidak berfungsi. Ciko membawa bateri simpanan.','The robot lights are out. Ciko carries a spare battery.'),lesson:pair('Gunakan sumber yang ada untuk membantu.','Use what you have to help.'),variable:'has_battery',value:true,choices:[{id:'replace',title:pair('Tukar bateri','Replace battery'),result:pair('Lampu menyala semula!','The lights shine again!'),right:true},{id:'ignore',title:pair('Abaikan masalah','Ignore it'),result:pair('Kota masih gelap. Ciko boleh mencuba lagi.','The village stays dark. Ciko can try again.'),right:false}],tip:pair('has_battery True bermakna bateri tersedia.','has_battery is True, so a battery is available.'),scene:'city'},
 {id:'story-5',title:pair('Pulau Penyu','Turtle Island'),place:pair('Pantai Biru','Blue Beach'),intro:pair('Seekor penyu mahu pulang ke laut, tetapi ada plastik di hadapannya.','A turtle wants to return to the sea, but plastic blocks its way.'),lesson:pair('Buat keputusan yang menjaga alam sekitar.','Make choices that care for nature.'),variable:'path_clear',value:false,choices:[{id:'clean',title:pair('Bersihkan pantai','Clean beach'),result:pair('Penyu berenang pulang dengan selamat!','The turtle swims home safely!'),right:true},{id:'rush',title:pair('Cepatkan penyu','Rush turtle'),result:pair('Laluan masih terhalang. Cuba cara lain.','The path is still blocked. Try another way.'),right:false}],tip:pair('Bersihkan laluan apabila path_clear ialah False.','Clear the route when path_clear is False.'),scene:'beach'},
 {id:'story-6',title:pair('Rumah di Angkasa','Home Among Stars'),place:pair('Stesen Bintang','Star Station'),intro:pair('Kapal kecil kehabisan tenaga. Ciko melihat panel suria yang boleh digunakan.','A small spaceship has low energy. Ciko sees a working solar panel.'),lesson:pair('Uji keadaan sebelum menyalakan enjin.','Test the condition before starting the engine.'),variable:'solar_ready',value:true,choices:[{id:'charge',title:pair('Cas menggunakan suria','Charge with solar'),result:pair('Tenaga dipulihkan. Semua pulang!','Power restored. Everyone gets home!'),right:true},{id:'launch',title:pair('Terus terbang','Launch now'),result:pair('Tenaga tidak cukup. Cuba cas dahulu.','Not enough energy. Try charging first.'),right:false}],tip:pair('solar_ready True membolehkan pengecasan.','solar_ready True means charging is available.'),scene:'space'}
];
export class CreativeCodeError extends Error {constructor(message:string,public line:number){super(message);this.name='CreativeCodeError';}}
export function compileStoryCode(source:string,chapter:StoryChapter):string{
 const text=source.replace(/\r/g,'').trim();if(text.length>900)throw new CreativeCodeError('Program is too long.',1);
 const rows=text.split('\n').filter(r=>r.trim()&&!r.trim().startsWith('#'));
 let chosen:string|undefined;
 if(rows.length===1){const m=rows[0].trim().match(/^choose\(['"]([a-z]+)['"]\)$/);if(m)chosen=m[1];}
 if(rows.length===4){const head=rows[0].trim().match(/^if\s+([a-z_]+)\s*:\s*$/);
  const yes=rows[1].match(/^ {4}choose\(['"]([a-z]+)['"]\)\s*$/);
  const els=/^else\s*:\s*$/.test(rows[2].trim());
  const no=rows[3].match(/^ {4}choose\(['"]([a-z]+)['"]\)\s*$/);
  if(head&&yes&&els&&no){if(head[1]!==chapter.variable)throw new CreativeCodeError('Use the available story variable.',1);chosen=chapter.value?yes[1]:no[1];}
 }
 if(!chosen)throw new CreativeCodeError('Write choose("option") or an if/else with four-space indentation.',1);
 if(!chapter.choices.some(c=>c.id===chosen))throw new CreativeCodeError('That route is not part of this story.',1);
 return chosen;
}
export const PET_ACTIONS=['feed','play','clean','rest'] as const;
export type PetAction=typeof PET_ACTIONS[number];
export type PetMission={id:string;title:TextPair;description:TextPair;hint:TextPair;actions:PetAction[]};
export const PET_MISSIONS:PetMission[]=[
 {id:'pet-1',title:pair('Selamat Datang, Kawan!','Welcome, Friend!'),description:pair('Beri makan kemudian bermain bersama.','Give your friend a meal, then play together.'),hint:pair('Makan dahulu, kemudian bermain.','Feed first, then play.'),actions:['feed','play']},
 {id:'pet-2',title:pair('Bersih dan Selesa','Fresh and Comfy'),description:pair('Bersihkan tempat tidur kemudian berehat.','Tidy the sleeping area, then rest.'),hint:pair('Bersih, kemudian rehat.','Clean, then rest.'),actions:['clean','rest']},
 {id:'pet-3',title:pair('Hari yang Aktif','An Active Day'),description:pair('Makan, bermain, kemudian berehat.','Eat, play, and then rest.'),hint:pair('Tiga tindakan mengikut turutan.','Three actions in order.'),actions:['feed','play','rest']},
 {id:'pet-4',title:pair('Dua Pusingan','Double Play'),description:pair('Main dua kali, kemudian minum dan makan.','Play twice, then have a meal.'),hint:pair('Gunakan for i in range(2) untuk bermain dua kali.','Use for i in range(2) to play twice.'),actions:['play','play','feed']},
 {id:'pet-5',title:pair('Rutin Bijak','Smart Routine'),description:pair('Bersih, makan, main, dan rehat.','Clean, eat, play, then rest.'),hint:pair('Ikut empat langkah satu demi satu.','Follow all four steps in order.'),actions:['clean','feed','play','rest']},
 {id:'pet-6',title:pair('Penjaga Hebat','Super Caregiver'),description:pair('Bermain dua kali, makan, bersih, dan tidur.','Play twice, feed, clean and rest.'),hint:pair('Dua kali play() sebelum feed(), clean(), rest().','Two play() calls before feed(), clean(), rest().'),actions:['play','play','feed','clean','rest']}
];
export function compilePetCode(source:string):PetAction[]{
 const rows=source.replace(/\r/g,'').split('\n'); const result:PetAction[]=[];
 for(let i=0;i<rows.length;i++){
  const raw=rows[i];if(!raw.trim()||raw.trim().startsWith('#'))continue;
  const loop=raw.match(/^for\s+[a-z_]\w*\s+in\s+range\((\d+)\):\s*$/);
  if(loop){const n=Number(loop[1]);if(n<1||n>8)throw new CreativeCodeError('Repeat count must be 1–8.',i+1);const next=rows[++i]||'';const inner=next.match(/^ {4}(feed|play|clean|rest)\(\)\s*$/);if(!inner)throw new CreativeCodeError('Indent one pet command by four spaces.',i+1);for(let j=0;j<n;j++)result.push(inner[1] as PetAction);}
  else {const m=raw.match(/^(feed|play|clean|rest)\(\)\s*$/);if(!m)throw new CreativeCodeError('Use feed(), play(), clean(), rest(), or a for loop.',i+1);result.push(m[1] as PetAction);}
  if(result.length>24)throw new CreativeCodeError('Too many actions.',i+1);
 }
 if(!result.length)throw new CreativeCodeError('Add at least one action.',1);
 return result;
}
export function petMatches(mission:PetMission,actions:PetAction[]){return mission.actions.filter((x,i)=>actions[i]===x).length;}
export function petCompleted(mission:PetMission,actions:PetAction[]){return actions.length===mission.actions.length&&mission.actions.every((a,i)=>a===actions[i]);}
export function petScore(mission:PetMission,actions:PetAction[]){return petCompleted(mission,actions)?80+mission.actions.length*16:0;}
export type CoachWorld={id:string;name:string;ids:readonly string[];};
export type CoachRecommendation={id:string;name:string;level:number;done:number;total:number;reason:'start'|'practice'|'continue'|'explore';hints:number;errors:number};
/** Deterministic recommendations. No inferred diagnoses, generated mastery scores or fake activity. */
export function recommendCoach(worlds:readonly CoachWorld[],completed:readonly string[],events:readonly {kind:string;level:string}[]):CoachRecommendation[]{
 const stats=worlds.map(w=>{const done=w.ids.filter(id=>completed.includes(id)).length;const recent=events.filter(e=>w.ids.includes(e.level)).slice(-40);return {id:w.id,name:w.name,level:Math.max(0,w.ids.findIndex(id=>!completed.includes(id))),done,total:w.ids.length,hints:recent.filter(e=>e.kind==='hint').length,errors:recent.filter(e=>e.kind==='code_error').length};});
 const notFinished=stats.filter(s=>s.done<s.total);
 const priority=[...notFinished].sort((a,b)=>{
  const pa=(a.errors+a.hints)*3+(a.done>0?5:0);const pb=(b.errors+b.hints)*3+(b.done>0?5:0);
  return pb-pa || a.done-b.done;
 });
 return priority.slice(0,3).map(s=>({...s,reason:s.hints+s.errors>0?'practice':s.done>0?'continue':completed.length===0?'start':'explore'}));
}
