import React, {useState} from 'react';
import {ArrowRight, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Code2, Gamepad2, GraduationCap, Laptop, Lightbulb, Play, Sparkles, Trophy, Users, Video} from 'lucide-react';
import {useLanguage} from '../../context/LanguageContext';

type Props={openComics:()=>void;startStudent:()=>void;startTeacher:()=>void};
const books=[
  {title:'Ciko and the Lost Loop',en:'https://heyzine.com/flip-book/cc10d9ca9b.html',ms:'https://heyzine.com/flip-book/37d18a2e91.html',topic:'Loops',image:'/visuals/ciko-explorer.webp'},
  {title:'The Variable Treasure Hunt',en:'https://heyzine.com/flip-book/48dcc3748c.html',ms:'https://heyzine.com/flip-book/82e68cb1ab.html',topic:'Variables',image:'/visuals/creative-pixels.webp'},
  {title:'If-Else in the Jungle',en:'https://heyzine.com/flip-book/19b888f86a.html',ms:'https://heyzine.com/flip-book/eceb5e4395.html',topic:'Conditions',image:'/visuals/forest-adventure.webp'},
];

export function MoreAboutCilikLab({openComics,startStudent,startTeacher}:Props){
  const {language}=useLanguage();
  const ms=language==='ms';
  const [openQuestion,setOpenQuestion]=useState<number|null>(0);
  const steps=ms?[
    ['01','Terokai pelajaran','Mulakan dengan asas Python yang mudah difahami.'],
    ['02','Cuba cabaran','Latih kemahiran menulis kod dengan cabaran harian Python, C atau Java.'],
    ['03','Main dan cuba lagi','Terokai permainan, termasuk misi robot 3D menggunakan Python.'],
    ['04','Lihat kemajuan','Semak pencapaian dan teruskan pembelajaran mengikut kadar sendiri.'],
  ]:[
    ['01','Explore a lesson','Start with friendly, beginner-level Python lessons.'],
    ['02','Try a coding challenge','Practice problem-solving in Python, C or Java through the Daily Challenge.'],
    ['03','Play and experiment','Explore interactive games, including 3D robot missions powered by Python.'],
    ['04','Build on your progress','Review achievements and continue learning at your own pace.'],
  ];
  const faqs=ms?[
    ['Untuk siapa CilikLab?','CilikLab dibina untuk kanak-kanak, pelajar baharu dan guru yang mahu meneroka asas pengaturcaraan secara interaktif.'],
    ['Bahasa pengaturcaraan apa yang boleh digunakan?','Ruang pembelajaran utama dan RoboLab menggunakan Python. Cabaran Pengekodan Harian pula menyediakan pilihan Python, C dan Java.'],
    ['Bagaimana saya boleh membaca komik?','Buku 1–4 dan 10 mempunyai edisi Bahasa Inggeris dan Bahasa Melayu yang boleh dibaca sebagai flipbook. Buku 5–9 akan datang.'],
    ['Adakah terdapat ciri untuk guru?','Ya. Ruang guru menyediakan pengurusan kelas, panduan, sokongan murid dan ciri bilik darjah langsung.'],
  ]:[
    ['Who is CilikLab for?','CilikLab is designed for young learners, coding beginners and educators who want a friendly, interactive approach to programming.'],
    ['Which programming languages are supported?','The core lessons and RoboLab focus on Python. The Daily Coding Challenge also supports C and Java.'],
    ['How do I read the comics?','Books 1–4 and 10 have complete English and Malay flipbooks you can read here or on Heyzine. Books 5–9 are coming soon.'],
    ['Is there a separate teacher experience?','Yes. Teachers have class management, learning guidance, student support and live-classroom features.'],
  ];
  return <>
    <section id="learning-journey" className="morelab-journey" aria-labelledby="morelab-journey-title">
      <div className="morelab-container">
        <div className="morelab-section-title"><span>{ms?'LANGKAH DEMI LANGKAH':'A SIMPLE PATH FORWARD'}</span><h2 id="morelab-journey-title">{ms?'Belajar kod dengan cara kamu':'Your coding journey starts here'}</h2><p>{ms?'Setiap langkah membantu kamu mencuba sesuatu yang baharu.':'A clear path from your very first line of code to more exciting challenges.'}</p></div>
        <div className="morelab-steps">{steps.map(([number,title,description])=><div key={number} className="morelab-step"><span className="morelab-step-number">{number}</span><h3>{title}</h3><p>{description}</p></div>)}</div>
      </div>
    </section>
    <section id="comiccode" className="morelab-comics" aria-labelledby="morelab-comics-title">
      <div className="morelab-container">
        <div className="morelab-section-bar"><div className="morelab-section-title"><span><BookOpen size={16}/>{ms?'PERPUSTAKAAN COMICCODE':'COMICCODE LIBRARY'}</span><h2 id="morelab-comics-title">{ms?'Pengembaraan kod, dalam cerita':'Coding adventures you can read'}</h2><p>{ms?'Lima buku telah diterbitkan dalam dua bahasa. Lima lagi pengembaraan akan datang.':'Discover five complete bilingual flipbooks, with five more adventures on the way.'}</p></div><button type="button" onClick={openComics} className="morelab-outline-link">{ms?'Semua 10 buku':'Explore all 10 books'} <ArrowRight size={17}/></button></div>
        <div className="morelab-comic-grid">{books.map((book,i)=><article className="morelab-comic" key={book.title}>
          <div className="morelab-comic-visual"><img src={book.image} loading="lazy" alt=""/><span>BOOK {String(i+1).padStart(2,'0')}</span></div>
          <div className="morelab-comic-content"><small>{book.topic}</small><h3>{book.title}</h3><p>{ms?'Tersedia dalam dua bahasa':'Available in two languages'}</p>
            <div className="morelab-comic-actions"><a href={book.en} target="_blank" rel="noopener noreferrer">English <ArrowRight size={15}/></a><a href={book.ms} target="_blank" rel="noopener noreferrer">Bahasa Melayu <ArrowRight size={15}/></a></div>
          </div></article>)}</div>
        <div className="morelab-coming"><BookOpen size={19}/><span>{ms?'Buku 5–9: Edisi English dan Bahasa Melayu akan datang.':'Books 5–9: English and Malay editions coming soon.'}</span></div>
      </div>
    </section>
    <section id="more-to-explore" className="morelab-features" aria-labelledby="morelab-features-title"><div className="morelab-container">
      <div className="morelab-section-title"><span>{ms?'LEBIH DARIPADA PELAJARAN':'MORE THAN LESSONS'}</span><h2 id="morelab-features-title">{ms?'Belajar, main dan bina keyakinan':'Practice, play and make progress'}</h2><p>{ms?'Pelbagai cara untuk membina kemahiran dan rasa ingin tahu.':'Different ways to explore coding, whether you prefer puzzles, challenges or guided projects.'}</p></div>
      <div className="morelab-feature-grid">
        <article className="morelab-feature"><div className="morelab-feature-image"><img src="/visuals/coding-friends.webp" alt="Students learning coding together" loading="lazy"/></div><div className="morelab-feature-copy"><span><Code2 size={17}/> DAILY CODING</span><h3>{ms?'Cabaran dalam Python, C dan Java':'Python, C and Java challenges'}</h3><p>{ms?'Selesaikan soalan pengaturcaraan dan latih penyelesaian masalah dalam bahasa pilihan.':'Solve coding problems and practice logic in your chosen programming language.'}</p><button onClick={startStudent}>{ms?'Mula mencuba':'Start practicing'} <ArrowRight size={16}/></button></div></article>
        <article className="morelab-feature"><div className="morelab-feature-image morelab-feature-image--robot"><img src="/arcade/ciko-robolab.svg" alt="Ciko RoboLab 3D game graphic" loading="lazy"/></div><div className="morelab-feature-copy"><span><Gamepad2 size={17}/> PLAY & LEARN</span><h3>{ms?'Arcade dan Ciko RoboLab 3D':'Arcade and Ciko RoboLab 3D'}</h3><p>{ms?'Terokai permainan interaktif dan kawal robot 3D menggunakan arahan Python.':'Enjoy interactive games and control a virtual 3D robot with Python instructions.'}</p><button onClick={startStudent}>{ms?'Terokai Arcade':'Explore the Arcade'} <ArrowRight size={16}/></button></div></article>
        <article className="morelab-feature"><div className="morelab-feature-image"><img src="/visuals/teacher-call-preview.webp" alt="Teacher portrait used in the classroom preview" loading="lazy"/></div><div className="morelab-feature-copy"><span><Video size={17}/> LEARN TOGETHER</span><h3>{ms?'Kelas dan bimbingan guru':'Classes and teacher guidance'}</h3><p>{ms?'Guru boleh mengurus kelas, membantu pelajar dan menggunakan fungsi bilik darjah langsung.':'Teachers can organize classes, support learners and use live-classroom features.'}</p><button onClick={startTeacher}>{ms?'Ruang guru':'Teacher portal'} <ArrowRight size={16}/></button></div></article>
      </div>
    </div></section>
    <section id="questions" className="morelab-faq" aria-labelledby="morelab-faq-title"><div className="morelab-container morelab-faq-layout"><div className="morelab-faq-intro"><span>{ms?'SOALAN LAZIM':'GOOD TO KNOW'}</span><h2 id="morelab-faq-title">{ms?'Ada soalan tentang CilikLab?':'A few things to know about CilikLab'}</h2><p>{ms?'Jawapan ringkas untuk pelajar, ibu bapa dan guru.':'Helpful answers for students, families and educators.'}</p><button onClick={startStudent}>{ms?'Mulakan pembelajaran':'Start learning'} <ArrowRight size={16}/></button></div>
      <div className="morelab-faq-items">{faqs.map(([question,answer],i)=><div className="morelab-faq-item" key={question}><button type="button" onClick={()=>setOpenQuestion(openQuestion===i?null:i)} aria-expanded={openQuestion===i} aria-controls={`morelab-faq-${i}`}><span>{question}</span>{openQuestion===i?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</button>{openQuestion===i&&<p id={`morelab-faq-${i}`}>{answer}</p>}</div>)}</div>
    </div></section>
  </>;
}
