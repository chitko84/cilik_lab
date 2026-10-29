import {RealPhoto} from '../../components/visual/RealPhoto';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  LibraryBig,
  Gamepad2,
  CheckCircle2,
  Code2,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export const LessonsView: React.FC = () => {
  const { selectExercise, selectComic, setActiveTab } = useApp();
  const {language,t} = useLanguage();

  const [activeLessonId, setActiveLessonId] = useState<string>('les_01');
  const [sliderCount, setSliderCount] = useState<number>(3);
  const [isConditionTrue, setIsConditionTrue] = useState<boolean>(true);

  const lessons = [
    {
      id: 'les_01',
      title: '1. Saying Hello: The Print Function',
      topic: 'Basics',
      summary: 'Learn how computers print messages to the screen using quotes and parentheses.',
      interactiveType: 'print',
      relatedExerciseId: 'ex_01',
      content: `The \`print()\` function is your way of speaking to the computer! 
When you write \`print("Hello!")\`, Python takes the text inside the quotation marks and displays it directly on your screen.

Quotation marks tell Python: "This is human text (a string), don't treat it as code instructions!"`,
      keyTakeaway: 'Always remember to open and close both the quotation marks (" ") and parentheses ( )!',
    },
    {
      id: 'les_02',
      title: '2. Memory Boxes: Variables in Python',
      topic: 'Variables',
      summary: 'Store names, score counters, and numbers in named memory containers.',
      interactiveType: 'variable',
      relatedExerciseId: 'ex_02',
      content: `Imagine variables as labeled boxes in your room. 
If you write \`hero_name = "Captain Code"\`, Python creates a box labeled \`hero_name\` and places \`"Captain Code"\` inside. 

Whenever you call \`print(hero_name)\` later, Python peeks inside the box and tells you what is stored there!`,
      keyTakeaway: 'Variable names cannot have spaces. Use an underscore like `hero_name` instead.',
    },
    {
      id: 'les_03',
      title: '3. Repetition Machines: The For Loop',
      topic: 'Logic & Loops',
      summary: 'Repeat actions 3, 10, or 100 times without writing redundant lines of code.',
      interactiveType: 'loop',
      relatedExerciseId: 'ex_04',
      content: `Loops are the superpower of programming. Instead of typing \`print("Step")\` 5 times, a loop lets you say: 
\`for i in range(5): print("Step")\`.

Python will automatically run the indented instructions for every single step!`,
      keyTakeaway: 'The colon (:) at the end of the for-loop line tells Python "get ready for the repeated block".',
    },
    {
      id: 'les_04',
      title: '4. Decision Making: If & Else',
      topic: 'Conditionals',
      summary: 'Teach your code to make smart choices depending on whether conditions are True or False.',
      interactiveType: 'condition',
      relatedExerciseId: 'ex_07',
      content: `Life is full of decisions: If it is raining, take an umbrella. Else, wear sunglasses!
Python checks conditions using \`if\` and \`else\`. 

When the condition is True, it runs the first block. If False, it skips to the else block.`,
      keyTakeaway: 'In Python, we check equality with two equal signs (==), not just one (=)!',
    },
  ];

  // Malay instructional text for the four existing introductory lessons.
  // Python examples and exercise assertions remain unchanged.
  const malayLessons: Record<string,{title:string;topic:string;summary:string;content:string;keyTakeaway:string}> = {
    les_01: {
      title:'1. Helo Python: Fungsi print()', topic:'Asas',
      summary:'Belajar cara memaparkan mesej pada skrin menggunakan tanda petik dan kurungan.',
      content:'Fungsi `print()` digunakan untuk memaparkan mesej pada skrin.\nContohnya, `print("Helo!")` akan memaparkan perkataan Helo!\n\nTanda petik memberitahu Python bahawa perkataan di dalamnya ialah teks, bukannya arahan kod.',
      keyTakeaway:'Ingat untuk menutup tanda petik dan kurungan yang kamu buka.',
    },
    les_02: {
      title:'2. Kotak Ingatan: Pemboleh Ubah', topic:'Pemboleh Ubah',
      summary:'Simpan nama, skor dan nombor menggunakan pemboleh ubah.',
      content:'Bayangkan pemboleh ubah seperti kotak yang mempunyai label.\nApabila kamu menulis `hero_name = "Kapten Kod"`, Python menyediakan kotak bernama `hero_name` dan menyimpan teks itu di dalamnya.\n\nApabila kamu menulis `print(hero_name)`, Python memaparkan kandungan kotak tersebut.',
      keyTakeaway:'Nama pemboleh ubah tidak boleh mengandungi ruang kosong. Gunakan garis bawah seperti `hero_name`.',
    },
    les_03: {
      title:'3. Mesin Ulangan: Gelung for', topic:'Logik & Gelung',
      summary:'Ulang arahan beberapa kali tanpa perlu menulis kod yang sama berulang kali.',
      content:'Gelung membolehkan komputer mengulangi tugas secara automatik.\nDaripada menulis `print("Langkah")` lima kali, kamu boleh gunakan `for i in range(5):` dan arahan berinden pada baris berikutnya.\n\nPython akan mengulangi arahan itu sebanyak lima kali.',
      keyTakeaway:'Tanda titik bertindih (:) di hujung baris for menunjukkan permulaan blok kod berulang.',
    },
    les_04: {
      title:'4. Membuat Pilihan: if dan else', topic:'Syarat',
      summary:'Ajar Python membuat keputusan apabila sesuatu syarat benar atau salah.',
      content:'Dalam kehidupan harian, kita membuat pilihan. Jika hujan, bawa payung. Jika tidak, mungkin kita tidak memerlukannya.\n\nPython menggunakan `if` dan `else` untuk memilih arahan yang perlu dijalankan berdasarkan syarat.',
      keyTakeaway:'Dalam Python, gunakan dua tanda sama dengan (`==`) untuk menyemak kesamaan nilai.',
    },
  };
  const displayLessons = lessons.map(l => language === 'ms' ? {...l, ...malayLessons[l.id]} : l);
  const currentLesson = displayLessons.find(l => l.id === activeLessonId) || displayLessons[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('lessonIntro')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('lessonIntroDesc')}
        </p>
      </div>

      <section className="premium-learning-ribbon premium-lessons-ribbon"><RealPhoto photo="readingFocus" alt="Child reading and learning attentively in a classroom" fallback="/arcade/logic-builder.svg"/><div><span>{language==='ms'?'BELAJAR SECARA INTERAKTIF':'INTERACTIVE LEARNING'}</span><h2>{language==='ms'?'Belajar satu idea, cuba terus dalam kod.':'Learn one idea. Try it in code.'}</h2><p>{language==='ms'?'Empat pelajaran asas, latihan dan permainan yang saling berkaitan.':'Build your foundations, then apply them in games and exercises.'}</p></div><button onClick={()=>setActiveTab('cilik_arcade')}>{language==='ms'?'Main Arcade':'Play Arcade'} <ArrowRight size={17}/></button></section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lesson Selector Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {t('lessonModules')}
          </div>
          {displayLessons.map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLessonId(l.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                activeLessonId === l.id
                  ? 'bg-sky-50 border-sky-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-sky-700 bg-sky-100/60 px-2 py-0.5 rounded text-[10px]">
                  {l.topic}
                </span>
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{l.title}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{l.summary}</p>
            </button>
          ))}
        </div>

        {/* Right Column: Interactive Lesson Reader (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
              {currentLesson.topic}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{currentLesson.title}</h2>
          </div>

          {/* Explanation Text */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
            {currentLesson.content}
          </div>

          {/* Interactive Simulation Sandbox */}
          <div className="p-4 bg-slate-900 rounded-xl text-white space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" /> {language==='ms' ? 'Latihan Konsep Interaktif' : 'Interactive Concept Sandbox'}
              </span>
              <span className="text-[11px] text-slate-400">{language==='ms' ? 'Cuba ubah tetapan di bawah!' : 'Try adjusting the controls below!'}</span>
            </div>

            {currentLesson.interactiveType === 'loop' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>Loop range(1, {sliderCount + 1}):</span>
                  <span className="text-emerald-400 font-bold">{sliderCount} {language==='ms'?'ulangan':'repetitions'}</span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="6"
                  value={sliderCount}
                  onChange={e => setSliderCount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
                  <div className="text-slate-400">// Output produced:</div>
                  {Array.from({ length: sliderCount }, (_, i) => (
                    <div key={i} className="text-emerald-400">
                      {language==='ms'?'Langkah':'Step'} {i + 1}: {language==='ms'?'Robot bergerak ke depan':'Robot moved forward'} 🚀
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentLesson.interactiveType === 'print' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="text-slate-300">{language==='ms'?'Kod dalam editor:':'Code in editor:'}</div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-amber-300">
                  print(&quot;Hello, CilikLab!&quot;)
                </div>
                <div className="text-slate-300">{language==='ms'?'Paparan komputer:':'Computer screen:'}</div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-emerald-400 font-bold">
                  Hello, CilikLab!
                </div>
              </div>
            )}

            {currentLesson.interactiveType === 'variable' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">{language==='ms'?'Nama kotak':'Box Label'}</span>
                    <span className="text-amber-400 font-bold">hero_name</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">{language==='ms'?'Kandungan':'Stored Inside'}</span>
                    <span className="text-emerald-400 font-bold">&quot;Captain Code&quot;</span>
                  </div>
                </div>
              </div>
            )}

            {currentLesson.interactiveType === 'condition' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span>{language==='ms'?'Adakah kod pintu betul?':'Is door passcode correct?'}</span>
                  <button
                    onClick={() => setIsConditionTrue(!isConditionTrue)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                      isConditionTrue
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {isConditionTrue ? (language === 'ms' ? 'Kod: BETUL' : 'Passcode: CORRECT') : (language === 'ms' ? 'Kod: SALAH' : 'Passcode: WRONG')}
                  </button>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-emerald-400 font-bold">
                  {isConditionTrue ? '>> Door opens: "Welcome hero!"' : '>> Door stays locked: "Access Denied"'}
                </div>
              </div>
            )}
          </div>

          {/* Key Takeaway Callout */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">{language==='ms'?'Apa yang kita pelajari':'Key Lesson Takeaway'}</span>
              <span>{currentLesson.keyTakeaway}</span>
            </div>
          </div>

          {/* Comics are optional; existing lesson and exercise flows are unchanged. */}
          {currentLesson.id !== 'les_01' && (
            <button type="button" onClick={() => selectComic(currentLesson.id === 'les_02' ? 'variables' : currentLesson.id === 'les_03' ? 'loops' : 'conditions')}
              className="w-full text-left flex items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-100 hover:border-indigo-300">
              <div className="flex items-center gap-3"><span className="p-2.5 bg-white rounded-xl text-indigo-600"><LibraryBig size={22}/></span><span><strong className="block text-sm text-slate-900">ComicCode</strong><span className="block text-xs text-slate-600">{language==='ms'?'Baca cerita berkaitan pelajaran ini':'Read a story about this lesson'}</span></span></div>
              <ArrowRight size={18} className="text-indigo-600 shrink-0"/>
            </button>
          )}

          {['les_03','les_04'].includes(currentLesson.id) && (
            <button onClick={() => setActiveTab('cilik_arcade')} className="w-full px-4 py-3 border border-violet-100 rounded-xl text-violet-800 bg-violet-50 text-sm font-bold flex justify-between items-center gap-2">
              <span className="flex items-center gap-2"><Gamepad2 size={18}/>{language==='ms'?'Latih konsep ini dalam Cilik Arcade':'Practise this concept in Cilik Arcade'}</span><ArrowRight size={17}/>
            </button>
          )}

          {/* Action to Launch Related Coding Exercise */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">{language==='ms'?'Sedia untuk mencuba?':'Ready to put this into practice?'}</span>
            <button
              onClick={() => selectExercise(currentLesson.relatedExerciseId)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              <span>{t('practiceNow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
