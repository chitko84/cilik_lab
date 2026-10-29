import type {UILocale} from '../../../locales/registry';
import type {SportId} from './sportsEngine';
/** Localized sports tutorials, story events and buttons. Scoring logic and action IDs do not change. */
const WORDS = {
 "ms": {
  "intro": [
   "Rancang hantaran, elak pemain lawan dan jaringkan gol.",
   "Rancang gerakan, cari ruang dan masuk bola ke dalam jaring.",
   "Pilih gerakan yang selamat untuk menamatkan perlumbaan."
  ],
  "scene": [
   [
    "Rakan sepasukan kosong. Hantar bola kepadanya.",
    "Pemain pertahanan datang. Gelecek melepasinya.",
    "Pintu gol terbuka! Cuba jaringkan gol.",
    "Pasukan lawan menguasai bola. Bertahan untuk mengambilnya."
   ],
   [
    "Rakan sepasukan bersedia. Hantar bola.",
    "Gelecek bola ke arah jaring.",
    "Peluang terbuka! Jaringkan bola.",
    "Lawan cuba menjaringkan bola. Halang!"
   ],
   [
    "Laluan lapang. Lari ke depan.",
    "Ada halangan. Lompat!",
    "Ada palang rendah. Tunduk!",
    "Tiba di stesen air. Berehat seketika."
   ]
  ],
  "actions": [
   [
    "Hantar",
    "Gelecek",
    "Jaring",
    "Bertahan"
   ],
   [
    "Hantar",
    "Gelecek",
    "Jaring",
    "Halang"
   ],
   [
    "Lari",
    "Lompat",
    "Tunduk",
    "Berehat"
   ]
  ],
  "ui": [
   "Misi sukan",
   "Pilih tindakan yang betul mengikut urutan.",
   "Pilih gerakan seterusnya",
   "Pelan permainan",
   "Tahap selesai",
   "Gerakan",
   "Pemain baharu",
   "Berlatih",
   "Juara",
   "Hebat! Misi selesai!",
   "Cuba lagi.",
   "Tahap seterusnya",
   "STESEN KAWALAN",
   "Batal langkah",
   "Mula semula",
   "Semak pelan",
   "Main semula",
   "Tahap",
   "Belajar urutan, keputusan dan logik melalui sukan."
  ]
 },
 "id": {
  "intro": [
   "Rencanakan operan, hindari lawan, dan cetak gol.",
   "Rencanakan gerakan, cari ruang, dan masukkan bola.",
   "Susun gerakan aman untuk menyelesaikan lintasan."
  ],
  "scene": [
   [
    "Rekanmu bebas. Oper bola kepadanya.",
    "Pemain bertahan mendekat. Dribel melewatinya.",
    "Gawang terbuka! Tembak!",
    "Lawan menguasai bola. Bertahan untuk merebutnya."
   ],
   [
    "Temanmu siap. Oper bolanya.",
    "Dribel menuju ring.",
    "Ada peluang! Tembak ke ring.",
    "Lawan menembak. Blokir!"
   ],
   [
    "Lintasan kosong. Lari!",
    "Ada rintangan. Lompat!",
    "Ada palang rendah. Merunduk!",
    "Tiba di tempat minum. Istirahat sebentar."
   ]
  ],
  "actions": [
   [
    "Oper",
    "Dribel",
    "Tembak",
    "Bertahan"
   ],
   [
    "Oper",
    "Dribel",
    "Tembak",
    "Blokir"
   ],
   [
    "Lari",
    "Lompat",
    "Merunduk",
    "Istirahat"
   ]
  ],
  "ui": [
   "Misi olahraga",
   "Pilih aksi dalam urutan yang tepat.",
   "Pilih gerakan berikutnya",
   "Rencana permainan",
   "Level selesai",
   "Gerakan",
   "Pemula",
   "Berlatih",
   "Juara",
   "Hebat! Misi selesai!",
   "Coba lagi.",
   "Level berikutnya",
   "PUSAT KONTROL",
   "Batalkan langkah",
   "Mulai ulang",
   "Periksa rencana",
   "Main lagi",
   "Level",
   "Pelajari urutan, keputusan, dan logika lewat olahraga."
  ]
 },
 "bn": {
  "intro": [
   "বুদ্ধি করে পাস দাও, বাধা পেরিয়ে গোল করো।",
   "সঠিক চাল বেছে নিয়ে বাস্কেট করো।",
   "দৌড়ের বাধা পেরোনোর নিরাপদ পরিকল্পনা করো।"
  ],
  "scene": [
   [
    "তোমার সতীর্থ ফাঁকা। তাকে বল পাস দাও।",
    "রক্ষক আসছে। ড্রিবল করে পাশ কাটাও।",
    "গোলপোস্ট খালি! শট নাও।",
    "প্রতিপক্ষের কাছে বল আছে। প্রতিরোধ করো।"
   ],
   [
    "সতীর্থ প্রস্তুত। বল পাস দাও।",
    "বল ড্রিবল করে বাস্কেটের দিকে যাও।",
    "সুযোগ এসেছে! শট নাও।",
    "প্রতিপক্ষ শট নিচ্ছে। ব্লক করো।"
   ],
   [
    "সামনে ফাঁকা পথ। দৌড়াও।",
    "সামনে বাধা। লাফ দাও!",
    "নিচু দণ্ড আছে। নিচু হও!",
    "পানির জায়গায় পৌঁছেছ। একটু বিশ্রাম নাও।"
   ]
  ],
  "actions": [
   [
    "পাস",
    "ড্রিবল",
    "শট",
    "রক্ষা"
   ],
   [
    "পাস",
    "ড্রিবল",
    "শট",
    "ব্লক"
   ],
   [
    "দৌড়",
    "লাফ",
    "নিচু হও",
    "বিশ্রাম"
   ]
  ],
  "ui": [
   "খেলার মিশন",
   "সঠিক ক্রমে কাজগুলো বেছে নাও।",
   "পরের চাল বেছে নাও",
   "খেলার পরিকল্পনা",
   "শেষ করা ধাপ",
   "চাল",
   "নতুন খেলোয়াড়",
   "অনুশীলন",
   "চ্যাম্পিয়ন",
   "দারুণ! মিশন শেষ!",
   "আবার চেষ্টা করো।",
   "পরের ধাপ",
   "নিয়ন্ত্রণ কেন্দ্র",
   "শেষ চাল বাতিল",
   "আবার শুরু",
   "পরিকল্পনা যাচাই",
   "আবার খেলো",
   "ধাপ",
   "খেলাধুলার মাধ্যমে ক্রম, সিদ্ধান্ত ও যুক্তি শেখো।"
  ]
 },
 "my": {
  "intro": [
   "ဘောလုံးကို ပေးပို့၊ ပြိုင်ဘက်ကိုကျော်ပြီး ဂိုးသွင်းပါ။",
   "လှုပ်ရှားမှုစဉ်းစားပြီး ဘတ်စကတ်ဘောဂိုးသွင်းပါ။",
   "အတားအဆီးများကို ဘေးကင်းစွာ ကျော်ဖြတ်ပြီး ပန်းဝင်ပါ။"
  ],
  "scene": [
   [
    "အသင်းဖော်လွတ်နေသည်။ ဘောလုံးပေးပါ။",
    "နောက်ခံလူ လာနေသည်။ ဘောလုံးဆွဲပြီး ကျော်ပါ။",
    "ဂိုးပေါက်လွတ်နေပြီ။ ကန်သွင်းပါ။",
    "ပြိုင်ဘက်မှာ ဘောလုံးရှိသည်။ ကာကွယ်ပါ။"
   ],
   [
    "အသင်းဖော် အဆင်သင့်ဖြစ်နေသည်။ ဘောလုံးပေးပါ။",
    "ဘောလုံးကို ဒရစ်ဘယ်လုပ်၍ ဂိုးနားသွားပါ။",
    "အခွင့်အရေးရပြီ။ ပစ်သွင်းပါ။",
    "ပြိုင်ဘက် ပစ်နေသည်။ ပိတ်ဆို့ပါ။"
   ],
   [
    "လမ်းရှင်းနေသည်။ ပြေးပါ။",
    "အတားအဆီးရှိသည်။ ခုန်ပါ။",
    "နိမ့်သောတန်းရှိသည်။ ငုံ့ပါ။",
    "ရေသောက်ရာရောက်ပြီ။ ခဏနားပါ။"
   ]
  ],
  "actions": [
   [
    "ပေးပို့",
    "ဘောလုံးဆွဲ",
    "ဂိုးသွင်း",
    "ကာကွယ်"
   ],
   [
    "ပေးပို့",
    "ဘောလုံးဆွဲ",
    "ပစ်သွင်း",
    "ပိတ်ဆို့"
   ],
   [
    "ပြေး",
    "ခုန်",
    "ငုံ့",
    "အနားယူ"
   ]
  ],
  "ui": [
   "အားကစားမစ်ရှင်",
   "လုပ်ဆောင်ချက်များကို မှန်ကန်သောအစဉ်အတိုင်း ရွေးပါ။",
   "နောက်လှုပ်ရှားမှုရွေးပါ",
   "ကစားနည်းအစီအစဉ်",
   "ပြီးဆုံးသောအဆင့်များ",
   "လှုပ်ရှားမှုများ",
   "စတင်သူ",
   "လေ့ကျင့်သူ",
   "ချန်ပီယံ",
   "ကောင်းလိုက်တာ! မစ်ရှင်ပြီးပြီ။",
   "ထပ်ကြိုးစားပါ။",
   "နောက်အဆင့်",
   "ထိန်းချုပ်ရေးဌာန",
   "နောက်ဆုံးလှုပ်ရှားမှုပယ်ဖျက်",
   "ပြန်စမယ်",
   "အစီအစဉ်စစ်မယ်",
   "ထပ်ကစားမယ်",
   "အဆင့်",
   "အားကစားဖြင့် အစဉ်လိုက်လုပ်ဆောင်မှုနှင့် ယုတ္တိသင်ယူပါ။"
  ]
 },
 "pcm": {
  "intro": [
   "Plan your pass, dodge defender and score goal.",
   "Plan your move, find space and put ball for basket.",
   "Choose safe moves to finish the race."
  ],
  "scene": [
   [
    "Your teammate free. Pass ball give am.",
    "Defender dey come. Dribble pass am.",
    "Goal clear! Shoot!",
    "Other team get ball. Defend am."
   ],
   [
    "Your teammate ready. Pass am ball.",
    "Dribble go basket.",
    "Chance don show! Shoot ball.",
    "Opponent wan shoot. Block am!"
   ],
   [
    "Road clear. Run!",
    "Hurdle dey front. Jump!",
    "Low bar dey front. Duck!",
    "Water station dey here. Rest small."
   ]
  ],
  "actions": [
   [
    "Pass",
    "Dribble",
    "Shoot",
    "Defend"
   ],
   [
    "Pass",
    "Dribble",
    "Shoot",
    "Block"
   ],
   [
    "Run",
    "Jump",
    "Duck",
    "Rest"
   ]
  ],
  "ui": [
   "Sports mission",
   "Choose your moves for correct order.",
   "Choose your next move",
   "Your playbook",
   "Levels you finish",
   "Moves",
   "Rookie",
   "Rising",
   "Champion",
   "Correct! Mission don finish!",
   "Try again.",
   "Next level",
   "ACTION CORNER",
   "Remove last move",
   "Start again",
   "Check your plan",
   "Play another time",
   "Level",
   "Learn order, choice and correct thinking as you play sport."
  ]
 },
 "ar": {
  "intro": [
   "خطط للتمرير وتجاوز المدافعين وسجّل هدفًا.",
   "اختر حركاتك بذكاء وسجّل في السلة.",
   "اختر حركات آمنة لإنهاء سباق الحواجز."
  ],
  "scene": [
   [
    "زميلك متاح. مرّر له الكرة.",
    "يقترب المدافع. راوغ لتتجاوزه.",
    "المرمى مفتوح! سدّد.",
    "الخصم يملك الكرة. دافع لاستعادتها."
   ],
   [
    "زميلك مستعد. مرّر الكرة.",
    "راوغ بالكرة باتجاه السلة.",
    "الفرصة مناسبة! سدّد للسلة.",
    "الخصم يسدّد. اصدّ الكرة!"
   ],
   [
    "المسار خالٍ. اركض.",
    "هناك حاجز. اقفز!",
    "هناك عارضة منخفضة. انحنِ!",
    "وصلت إلى محطة الماء. استرح قليلًا."
   ]
  ],
  "actions": [
   [
    "مرّر",
    "راوغ",
    "سدّد",
    "دافع"
   ],
   [
    "مرّر",
    "راوغ",
    "سدّد",
    "اصدّ"
   ],
   [
    "اركض",
    "اقفز",
    "انحنِ",
    "استرح"
   ]
  ],
  "ui": [
   "المهمة الرياضية",
   "اختر الحركات بالترتيب الصحيح.",
   "اختر الحركة التالية",
   "خطة اللعب",
   "المستويات المكتملة",
   "حركات",
   "مبتدئ",
   "متقدم",
   "بطل",
   "رائع! اكتملت المهمة!",
   "حاول مجددًا.",
   "المستوى التالي",
   "لوحة التحكم",
   "تراجع عن الحركة",
   "ابدأ من جديد",
   "تحقق من الخطة",
   "العب مجددًا",
   "المستوى",
   "تعلّم الترتيب واتخاذ القرار والتفكير المنطقي من خلال الرياضة."
  ]
 },
 "fa": {
  "intro": [
   "پاس بده، از مدافع بگذر و گول بزن.",
   "حرکت‌هایت را برنامه‌ریزی کن و توپ را داخل سبد بینداز.",
   "برای پایان مسابقه از مانع‌ها به‌درستی بگذر."
  ],
  "scene": [
   [
    "هم‌تیمی‌ات آزاد است. توپ را پاس بده.",
    "مدافع نزدیک می‌شود. توپ را دریبل کن و بگذر.",
    "دروازه باز است! شوت بزن.",
    "توپ دست حریف است. دفاع کن."
   ],
   [
    "هم‌تیمی آماده است. پاس بده.",
    "توپ را به‌سوی سبد دریبل کن.",
    "فرصت خوبی است! شوت بزن.",
    "حریف شوت می‌زند. بلاک کن!"
   ],
   [
    "راه باز است. بدو.",
    "مانع پیش رو است. بپر!",
    "میلهٔ کوتاه پیش رو است. خم شو!",
    "به ایستگاه آب رسیدی. کمی استراحت کن."
   ]
  ],
  "actions": [
   [
    "پاس",
    "دریبل",
    "شوت",
    "دفاع"
   ],
   [
    "پاس",
    "دریبل",
    "شوت",
    "بلاک"
   ],
   [
    "دویدن",
    "پرش",
    "خم‌شدن",
    "استراحت"
   ]
  ],
  "ui": [
   "مأموریت ورزشی",
   "حرکت‌ها را به ترتیب درست انتخاب کن.",
   "حرکت بعدی را انتخاب کن",
   "برنامهٔ بازی",
   "مرحله‌های تکمیل‌شده",
   "حرکت‌ها",
   "تازه‌کار",
   "در حال پیشرفت",
   "قهرمان",
   "آفرین! مأموریت تمام شد!",
   "دوباره کوشش کن.",
   "مرحلهٔ بعدی",
   "ایستگاه کنترول",
   "لغو حرکت آخر",
   "دوباره شروع کن",
   "برنامه را بررسی کن",
   "دوباره بازی کن",
   "مرحله",
   "با ورزش، ترتیب حرکت‌ها، تصمیم‌گیری و منطق را یاد بگیر."
  ]
 }
} as const;
const indices: Record<SportId,number>={football:0,basketball:1,track:2};
const actions:Record<SportId,string[]>={football:['pass','dribble','shoot','defend'],basketball:['pass','dribble','shoot','block'],track:['run','jump','duck','rest']};
const EN={intro:['Make smart passes, dodge defenders and score a goal.','Plan your moves, find space and shoot a basket.','Program a safe obstacle course and finish the race.'],ui:['SPORTS MISSION','Choose actions in the correct order.','Choose your next move','Your playbook','Levels completed','Moves','Rookie','Rising','Champion','Great! Mission complete!','Try again.','Next level','ACTION STATION','Undo','Reset','Check play','Play again','Level','Practice sequences, decisions and logic through sport.']};
export const sportLocalized=(locale:UILocale,sport:SportId)=>{
 const n=indices[sport],copy=locale==='en'?null:WORDS[locale];
 const scenes=copy?.scene[n];const names=copy?.actions[n];
 return {intro:copy?.intro[n]||EN.intro[n],action:(id:string,fallback:string)=>names?.[actions[sport].indexOf(id)]||fallback,
  scene:(id:string,fallback:string)=>scenes?.[actions[sport].indexOf(id)]||fallback,
  ui:(i:number)=>copy?.ui[i]||EN.ui[i]};
};
