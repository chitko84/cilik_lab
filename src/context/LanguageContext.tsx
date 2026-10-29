import {LOCALES,LOCALE_KEY,isLocale,isRtl,legacyLanguage,localizedCore} from '../locales/registry';
import type {UILocale} from '../locales/registry';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AppLanguage = 'ms' | 'en';

// Centralised interface copy. Existing lesson / exercise source code is never translated,
// so Python examples, assertions, saved drafts and teacher-authored content stay intact.
const messages = {
  en: {
    home: 'Home', learn: 'Learn', play: 'Play', code: 'Code', progress: 'Progress', me: 'Me',
    dashboard: 'Dashboard', explore: 'Explore Classes', myClasses: 'My Classes', lessons: 'Lessons & Challenges',
    workspace: 'Coding Workspace', myProgress: 'My Progress', community: 'Class Community',
    profile: 'My Profile', settings: 'Settings', teacherView: 'Teacher View', studentView: 'Student View',
    teacherSpace: 'Teacher Space', learningSpace: 'Learning Space', studentPortal: 'Student Portal',
    teacherPortal: 'Teacher Portal', language: 'Language', signOut: 'Exit to Home', notifications: 'Notifications',
    welcome: 'Hello', welcomeAgain: 'Welcome back', ready: 'Ready to make something amazing?',
    heroTag: 'Made for curious young minds',
    heroTitleA: 'Little minds.', heroTitleB: 'Big ideas.',
    heroDesc: 'Learn Python one small adventure at a time. Explore interactive lessons, try real code, and grow your confidence with friendly guidance.',
    startLearning: 'Start learning', teacherAccess: 'For educators',
    discover: 'Discover CilikLab', whatYouCanDo: 'A brighter way to learn coding',
    discoverDesc: 'Friendly explanations, hands-on practice and thoughtful support—all in one place.',
    benefitLearn: 'Learn step by step', benefitLearnDesc: 'Short lessons make new ideas easy to understand.',
    benefitCode: 'Try real Python', benefitCodeDesc: 'Write code, run it and see what happens.',
    benefitHelp: 'Understand your mistakes', benefitHelpDesc: 'Gentle hints help you find the answer yourself.',
    forKids: 'A happy place to learn and create', forTeachers: 'Helping every teacher guide every learner',
    forTeachersDesc: 'Follow learning journeys, review attempts and offer guidance when students need a little help.',
    enterStudent: 'Enter student space', enterTeacher: 'Enter teacher space',
    pythonPlayground: 'Try a little Python', changeName: 'Change the name and press Run!',
    run: 'Run code', running: 'Running...', output: 'Your output',
    note: 'No sign-up required to explore the learning space.',
    footer: 'Made for little learners with big ideas.',
    continueLearning: 'Continue learning', exploreMore: 'Explore more', myActiveClasses: 'My active classes',
    classesCaption: 'Pick up right where you left off', weeklyActivity: 'Weekly coding activity',
    activityCaption: 'Your time spent practising Python', teacherFeedback: 'Teacher feedback',
    learningLevel: 'Learning level', enrolledClasses: 'Enrolled classes', averageScore: 'Average score',
    dailyStreak: 'Learning streak', days: 'days', keepGoing: 'Keep it going!',
    totalXP: 'total XP', acrossCategories: 'Across your learning paths', strongProgress: 'Nice progress!',
    browseCourses: 'Find a class', quickAccess: 'Your next steps',
    practicePython: 'Practise Python', seeProgress: 'See my progress',
    goToLessons: 'Explore lessons', continueClass: 'Continue class',
    teacherDashboard: 'Your classroom at a glance', teacherDashboardDesc: 'See what is going well and who might need a little extra help.',
    activeClasses: 'Active classes', learners: 'Learners', openHelp: 'Help requests', createClass: 'Create class',
    myTeacherClasses: 'My Classes', createNewClass: 'Create Class', studentPerformance: 'Student Performance',
    supportQueue: 'Support Queue', classSupport: 'Class Support', guidanceLibrary: 'Guidance Library',
    feedbackReview: 'Feedback Review', reportsAnalytics: 'Reports & Analytics',
    profileSettings: 'Profile & settings', more: 'More', closeMenu: 'Close menu', openMenu: 'Open menu',
    lessonIntro: 'Interactive lessons', lessonIntroDesc: 'Explore a concept, then try it yourself.',
    lessonModules: 'Choose a lesson', practiceNow: 'Try it in Python',
    chooseLanguage: 'Choose your language', languageNote: 'Learning navigation and selected explanations are available in both languages. Teacher-authored material and Python code stay as written.',
    settingsTitle: 'Application settings', settingsCaption: 'Your learning preferences and saved work.',
    audioPrefs: 'Learning and audio preferences', soundEffects: 'Sound effects', learningReminders: 'Learning reminders',
    restoreData: 'Restore starter content', restoreCaption: 'Restore initial learning content and clear local changes on this device.',
    resetData: 'Restore learning content', clearDrafts: 'Clear saved drafts',
    comingNext: 'More learning adventures are on the way',
  },
  ms: {
    home: 'Utama', learn: 'Belajar', play: 'Main', code: 'Kod', progress: 'Kemajuan', me: 'Saya',
    dashboard: 'Papan Utama', explore: 'Terokai Kelas', myClasses: 'Kelas Saya', lessons: 'Pelajaran & Cabaran',
    workspace: 'Ruang Kod', myProgress: 'Kemajuan Saya', community: 'Komuniti Kelas',
    profile: 'Profil Saya', settings: 'Tetapan', teacherView: 'Paparan Guru', studentView: 'Paparan Murid',
    teacherSpace: 'Ruang Guru', learningSpace: 'Ruang Belajar', studentPortal: 'Ruang Murid',
    teacherPortal: 'Ruang Guru', language: 'Bahasa', signOut: 'Kembali ke Utama', notifications: 'Pemberitahuan',
    welcome: 'Hai', welcomeAgain: 'Selamat kembali', ready: 'Sedia untuk cipta sesuatu yang hebat?',
    heroTag: 'Untuk minda kecil yang ingin tahu',
    heroTitleA: 'Minda kecil.', heroTitleB: 'Idea besar.',
    heroDesc: 'Belajar Python melalui pengembaraan kecil. Terokai pelajaran interaktif, cuba kod sebenar dan bina keyakinan dengan bimbingan mesra.',
    startLearning: 'Mula belajar', teacherAccess: 'Untuk guru',
    discover: 'Kenali CilikLab', whatYouCanDo: 'Cara menyeronokkan untuk belajar kod',
    discoverDesc: 'Penerangan mudah, latihan praktikal dan sokongan mesra—semuanya di satu tempat.',
    benefitLearn: 'Belajar langkah demi langkah', benefitLearnDesc: 'Pelajaran ringkas memudahkan konsep baharu.',
    benefitCode: 'Cuba Python sebenar', benefitCodeDesc: 'Tulis kod, jalankan dan lihat hasilnya.',
    benefitHelp: 'Fahami kesilapan', benefitHelpDesc: 'Petunjuk mesra bantu kamu mencari jawapan sendiri.',
    forKids: 'Tempat ceria untuk belajar dan mencipta', forTeachers: 'Bantu guru membimbing setiap murid',
    forTeachersDesc: 'Pantau kemajuan, semak percubaan dan berikan bimbingan apabila murid memerlukan bantuan.',
    enterStudent: 'Masuk sebagai murid', enterTeacher: 'Masuk sebagai guru',
    pythonPlayground: 'Jom cuba Python', changeName: 'Tukar nama dan tekan Jalankan!',
    run: 'Jalankan kod', running: 'Sedang berjalan...', output: 'Hasil kod',
    note: 'Tiada pendaftaran diperlukan untuk meneroka ruang belajar.',
    footer: 'Untuk si cilik dengan idea yang besar.',
    continueLearning: 'Sambung belajar', exploreMore: 'Teroka lagi', myActiveClasses: 'Kelas aktif saya',
    classesCaption: 'Sambung pelajaran terakhir kamu', weeklyActivity: 'Aktiviti kod mingguan',
    activityCaption: 'Masa kamu berlatih Python', teacherFeedback: 'Maklum balas guru',
    learningLevel: 'Tahap pembelajaran', enrolledClasses: 'Kelas disertai', averageScore: 'Purata markah',
    dailyStreak: 'Hari berturut-turut', days: 'hari', keepGoing: 'Teruskan usaha!',
    totalXP: 'jumlah XP', acrossCategories: 'Dalam laluan pembelajaran kamu', strongProgress: 'Kemajuan yang baik!',
    browseCourses: 'Cari kelas', quickAccess: 'Langkah seterusnya',
    practicePython: 'Latihan Python', seeProgress: 'Lihat kemajuan',
    goToLessons: 'Terokai pelajaran', continueClass: 'Sambung kelas',
    teacherDashboard: 'Ringkasan kelas anda', teacherDashboardDesc: 'Lihat kemajuan kelas dan murid yang memerlukan bantuan.',
    activeClasses: 'Kelas aktif', learners: 'Murid', openHelp: 'Permintaan bantuan', createClass: 'Cipta kelas',
    myTeacherClasses: 'Kelas Saya', createNewClass: 'Cipta Kelas', studentPerformance: 'Prestasi Murid',
    supportQueue: 'Senarai Bantuan', classSupport: 'Sokongan Kelas', guidanceLibrary: 'Perpustakaan Panduan',
    feedbackReview: 'Semakan Maklum Balas', reportsAnalytics: 'Laporan & Analitik',
    profileSettings: 'Profil & tetapan', more: 'Lagi', closeMenu: 'Tutup menu', openMenu: 'Buka menu',
    lessonIntro: 'Pelajaran interaktif', lessonIntroDesc: 'Terokai konsep, kemudian cuba sendiri.',
    lessonModules: 'Pilih pelajaran', practiceNow: 'Cuba dalam Python',
    chooseLanguage: 'Pilih bahasa kamu', languageNote: 'Navigasi dan penerangan terpilih tersedia dalam kedua-dua bahasa. Kandungan guru dan kod Python kekal seperti asal.',
    settingsTitle: 'Tetapan aplikasi', settingsCaption: 'Pilihan pembelajaran dan kerja tersimpan.',
    audioPrefs: 'Pilihan pembelajaran dan audio', soundEffects: 'Kesan bunyi', learningReminders: 'Peringatan belajar',
    restoreData: 'Pulihkan kandungan asal', restoreCaption: 'Pulihkan bahan pembelajaran awal dan kosongkan perubahan setempat pada peranti ini.',
    resetData: 'Pulihkan kandungan belajar', clearDrafts: 'Kosongkan draf tersimpan',
    comingNext: 'Lebih banyak pengembaraan pembelajaran akan tiba',
  },
} as const;

type MessageKey = keyof typeof messages.en;
interface LanguageState { language: AppLanguage; locale: UILocale; setLanguage: (value: UILocale) => void; t: (key: MessageKey) => string }
const LanguageContext = createContext<LanguageState | undefined>(undefined);
/** Legacy ms/en selectors remain untouched. `locale` drives newly localized resources. */
export function LanguageProvider({children}: {children: React.ReactNode}) {
  const [locale, setLanguage] = useState<UILocale>(() => {
    try { const saved=localStorage.getItem(LOCALE_KEY); return isLocale(saved)?saved:'ms'; } catch {return 'ms'}
  });
  const language: AppLanguage=legacyLanguage(locale);
  useEffect(() => {
    document.documentElement.lang=LOCALES.find(l=>l.id===locale)!.code;
    document.documentElement.dir=isRtl(locale)?'rtl':'ltr';
    document.documentElement.dataset.locale=locale;
    try {localStorage.setItem(LOCALE_KEY,locale)} catch {/* private browsing */}
  },[locale]);
  const value=useMemo(()=>({language,locale,setLanguage,t:(key:MessageKey) =>
    localizedCore(key,locale) || messages[language][key] as string
  }),[language,locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}
