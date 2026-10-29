import type {UILocale} from '../../locales/registry';

/** Localized introduction shown on the public homepage. No programming tokens or
 * saved learning content are modified when the language changes. */
export type IntroCopy = {
  eyebrow: string; heading: string; description: string;
  childHeading: string; childBody: string;
  teacherHeading: string; teacherBody: string;
  journeyLabel: string; steps: readonly [string,string,string];
  photoCaption: string;
};

export const INTRO_COPY: Record<UILocale, IntroCopy> = {
  en: {
    eyebrow: 'GET TO KNOW CILIKLAB',
    heading: 'Where young minds learn to think like creators.',
    description: 'CilikLab makes coding approachable through playful games, guided lessons, real Python practice, quizzes and interactive comic stories. Children can experiment, learn from mistakes and build confidence one small challenge at a time.',
    childHeading: 'For young learners',
    childBody: 'Discover coding at your own pace, solve fun puzzles and see your progress as you grow.',
    teacherHeading: 'For teachers',
    teacherBody: 'Guide your classes, review learning attempts and support children along the way.',
    journeyLabel: 'THE LEARNING JOURNEY',
    steps: ['Explore an idea', 'Try it yourself', 'Grow with feedback'],
    photoCaption: 'Curiosity is where every great idea begins.',
  },
  ms: {
    eyebrow: 'KENALI CILIKLAB',
    heading: 'Tempat minda muda belajar menjadi pencipta.',
    description: 'CilikLab menjadikan pengekodan mudah didekati melalui permainan menyeronokkan, pelajaran berpandu, latihan Python sebenar, kuiz dan cerita komik interaktif. Kanak-kanak boleh mencuba, belajar daripada kesilapan dan membina keyakinan melalui cabaran kecil.',
    childHeading: 'Untuk murid',
    childBody: 'Terokai pengekodan mengikut rentak sendiri, selesaikan teka-teki dan lihat perkembangan kamu.',
    teacherHeading: 'Untuk guru',
    teacherBody: 'Bimbing kelas, semak percubaan pembelajaran dan bantu murid sepanjang perjalanan mereka.',
    journeyLabel: 'PERJALANAN PEMBELAJARAN',
    steps: ['Terokai idea', 'Cuba sendiri', 'Maju dengan maklum balas'],
    photoCaption: 'Rasa ingin tahu ialah permulaan setiap idea hebat.',
  },
  bn: {
    eyebrow: 'CILIKLAB সম্পর্কে জানো',
    heading: 'যেখানে ছোটরা সৃজনশীল চিন্তা করতে শেখে।',
    description: 'CilikLab-এ মজার গেম, ধাপে ধাপে পাঠ, আসল Python অনুশীলন, কুইজ ও ইন্টারঅ্যাকটিভ কমিকের মাধ্যমে কোডিং শেখা সহজ হয়। শিশুরা নিজে চেষ্টা করতে, ভুল থেকে শিখতে ও ছোট ছোট চ্যালেঞ্জে আত্মবিশ্বাস বাড়াতে পারে।',
    childHeading: 'শিক্ষার্থীদের জন্য',
    childBody: 'নিজের গতিতে কোডিং শেখো, মজার ধাঁধা সমাধান করো এবং নিজের অগ্রগতি দেখো।',
    teacherHeading: 'শিক্ষকদের জন্য',
    teacherBody: 'ক্লাস পরিচালনা করুন, শেখার চেষ্টা পর্যালোচনা করুন এবং শিক্ষার্থীদের সহায়তা করুন।',
    journeyLabel: 'শেখার পথ',
    steps: ['নতুন ধারণা জানো', 'নিজে চেষ্টা করো', 'মতামত থেকে এগিয়ে যাও'],
    photoCaption: 'কৌতূহল থেকেই নতুন ভাবনার শুরু।',
  },
  my: {
    eyebrow: 'CILIKLAB အကြောင်း',
    heading: 'ကလေးများ စိတ်ကူးဖန်တီးတတ်လာစေမည့် နေရာ။',
    description: 'CilikLab တွင် ပျော်စရာဂိမ်းများ၊ အဆင့်လိုက်သင်ခန်းစာများ၊ Python ကုဒ်လက်တွေ့ရေးသားမှု၊ ဉာဏ်စမ်းမေးခွန်းများနှင့် ကာတွန်းဇာတ်လမ်းများဖြင့် ကုဒ်ရေးခြင်းကို လွယ်ကူစွာ သင်ယူနိုင်သည်။ ကလေးများသည် ကိုယ်တိုင်စမ်းသပ်ရင်း အမှားများမှ သင်ယူကာ ယုံကြည်မှု တိုးတက်လာနိုင်သည်။',
    childHeading: 'ကျောင်းသားများအတွက်',
    childBody: 'မိမိအရှိန်အဟုန်ဖြင့် ကုဒ်ရေးလေ့လာ၊ ပဟေဠိများ ဖြေရှင်းပြီး တိုးတက်မှုကို ကြည့်ပါ။',
    teacherHeading: 'ဆရာ၊ ဆရာမများအတွက်',
    teacherBody: 'အတန်းများကို လမ်းညွှန်၊ လေ့ကျင့်မှုများကို စစ်ဆေးပြီး ကျောင်းသားများကို ကူညီပါ။',
    journeyLabel: 'သင်ယူမှုခရီးစဉ်',
    steps: ['အကြံသစ်ကို လေ့လာ', 'ကိုယ်တိုင်စမ်းကြည့်', 'အကြံပြုချက်ဖြင့် တိုးတက်'],
    photoCaption: 'စူးစမ်းလိုစိတ်က အကြံကောင်းများ၏ အစဖြစ်သည်။',
  },
  pcm: {
    eyebrow: 'KNOW CILIKLAB',
    heading: 'Na here young minds dey learn how to create.',
    description: 'CilikLab dey make coding easy with fun games, small-small lessons, real Python practice, quiz and comic stories wey you fit follow. Pikin fit try things, learn from mistake and gain confidence one challenge at a time.',
    childHeading: 'For young learners',
    childBody: 'Learn coding for your own pace, solve fun puzzles and see how you dey improve.',
    teacherHeading: 'For teachers',
    teacherBody: 'Guide your class, check wetin students try and help dem as dem dey learn.',
    journeyLabel: 'HOW LEARNING DEY GO',
    steps: ['Find new idea', 'Try am yourself', 'Learn from feedback'],
    photoCaption: 'Na curiosity dey start better ideas.',
  },
  fa: {
    eyebrow: 'آشنایی با CILIKLAB',
    heading: 'جایی که ذهن‌های جوان خلاقانه فکر کردن را می‌آموزند.',
    description: 'CilikLab یادگیری برنامه‌نویسی را با بازی‌های سرگرم‌کننده، درس‌های گام‌به‌گام، تمرین واقعی پایتون، آزمون‌ها و داستان‌های کمیک تعاملی آسان‌تر می‌سازد. کودکان می‌توانند تجربه کنند، از اشتباه‌ها بیاموزند و با هر چالش کوچک اعتمادبه‌نفس پیدا کنند.',
    childHeading: 'برای دانش‌آموزان',
    childBody: 'با سرعت خودت برنامه‌نویسی یاد بگیر، معما حل کن و پیشرفتت را ببین.',
    teacherHeading: 'برای آموزگاران',
    teacherBody: 'صنف‌ها را راهنمایی کنید، تمرین‌های شاگردان را بررسی کنید و در یادگیری کمک‌شان کنید.',
    journeyLabel: 'مسیر یادگیری',
    steps: ['یک ایده را کشف کن', 'خودت امتحان کن', 'با بازخورد پیشرفت کن'],
    photoCaption: 'کنجکاوی آغاز هر فکر بزرگ است.',
  },
  ar: {
    eyebrow: 'تعرّف إلى CILIKLAB',
    heading: 'مساحة يتعلم فيها الصغار التفكير بإبداع.',
    description: 'يجعل CilikLab تعلم البرمجة أسهل من خلال الألعاب الممتعة والدروس الموجّهة والتدرّب على بايثون والاختبارات والقصص المصورة التفاعلية. يمكن للأطفال التجربة والتعلم من الأخطاء وبناء الثقة خطوة بخطوة.',
    childHeading: 'للطلاب الصغار',
    childBody: 'تعلم البرمجة على مهل، وحل الألغاز الممتعة، وتابع تقدّمك.',
    teacherHeading: 'للمعلمين',
    teacherBody: 'وجّه الصفوف وراجع محاولات التعلم وساعد الأطفال خلال رحلتهم.',
    journeyLabel: 'رحلة التعلّم',
    steps: ['اكتشف فكرة', 'جرّب بنفسك', 'تقدّم مع الملاحظات'],
    photoCaption: 'الفضول هو بداية كل فكرة رائعة.',
  },
  id: {
    eyebrow: 'KENALI CILIKLAB',
    heading: 'Tempat anak belajar berpikir kreatif.',
    description: 'CilikLab memudahkan anak belajar pemrograman melalui permainan seru, pelajaran bertahap, latihan Python sungguhan, kuis, dan komik interaktif. Anak dapat bereksperimen, belajar dari kesalahan, dan membangun rasa percaya diri melalui tantangan kecil.',
    childHeading: 'Untuk pelajar',
    childBody: 'Jelajahi coding sesuai ritmemu, pecahkan teka-teki, dan lihat kemajuanmu.',
    teacherHeading: 'Untuk guru',
    teacherBody: 'Bimbing kelas, tinjau percobaan belajar, dan bantu siswa di setiap langkah.',
    journeyLabel: 'PERJALANAN BELAJAR',
    steps: ['Temukan ide', 'Coba sendiri', 'Berkembang lewat masukan'],
    photoCaption: 'Rasa ingin tahu adalah awal setiap ide hebat.',
  },
};
