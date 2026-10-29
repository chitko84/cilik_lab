/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  Layers,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { CodingClass } from '../../types';
import {RealPhoto} from '../../components/visual/RealPhoto';
import {PhotoSlideshow} from '../../components/visual/PhotoSlideshow';

export const ExploreClasses: React.FC = () => {
  const { classes, enrollClass, leaveClass, selectExercise, selectClass, setActiveTab } = useApp();
  const {t,language} = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedClassForModal, setSelectedClassForModal] = useState<CodingClass | null>(null);

  const categories = ['All', 'Basics', 'Logic & Loops', 'Game Dev', 'Creative Coding', 'Data & Lists', 'Problem Solving'];
  const difficulties = ['All', 'Beginner', 'Elementary', 'Intermediate'];

  const filteredClasses = classes.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Enrolled' && c.isEnrolled) ||
      (selectedStatus === 'Available' && !c.isEnrolled);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const handleEnroll = (classId: string) => {
    enrollClass(classId);
    if (selectedClassForModal && selectedClassForModal.id === classId) {
      setSelectedClassForModal({
        ...selectedClassForModal,
        isEnrolled: true,
        enrolledCount: selectedClassForModal.enrolledCount + 1,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('explore')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {language==='ms'?'Cari kelas Python yang menarik, aktiviti interaktif dan cabaran kreatif.':'Discover playful programming journeys, interactive challenges, and game-building labs.'}
        </p>
      </div>

      <section className="premium-learning-ribbon premium-classes-ribbon"><PhotoSlideshow variant="compact" label={language==='ms'?'Galeri kelas Python':'Python classes gallery'} autoPlayMs={10500} slides={[
        {photo:'tabletClass',alt:'Teacher using a tablet to guide students in a classroom',fallback:'/arcade/code-maze.svg'},
        {photo:'focusedLab',alt:'Children learning at computers in their classroom',fallback:'/visuals/coding-friends.webp'},
        {photo:'labPortrait',alt:'Young learner working on a computer in class',fallback:'/visuals/hero-adventure.webp'}
      ]}/><div><span>{language==='ms'?'CARI PENGEMBARAAN BAHARU':'DISCOVER A NEW ADVENTURE'}</span><h2>{language==='ms'?'Cari kelas yang sesuai dengan kamu.':'Find a class that fits your curiosity.'}</h2><p>{language==='ms'?'Terokai, pilih topik dan terus mula belajar.':'Explore creative topics, choose your level and start learning.'}</p></div><button onClick={()=>setActiveTab('lessons')}>{language==='ms'?'Buka pelajaran':'View lessons'} <ArrowRight size={17}/></button></section>
      {/* Search & Filter Controls */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language==='ms'?'Cari topik, kata kunci atau guru...':'Search by topic, keyword, or instructor...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Difficulty:
            </span>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 bg-white"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Enrollment status filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 bg-white"
            >
              <option value="All">All Classes</option>
              <option value="Enrolled">My Enrolled</option>
              <option value="Available">Available to Join</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">Category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Four-Column Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-xl border border-slate-200">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No classes found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or filters.</p>
          </div>
        ) : (
          filteredClasses.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => setSelectedClassForModal(c)}
            >
              {/* Original locally bundled artwork: meaningful class preview, no remote dependency. */}
              <div className="premium-class-cover v24-class-cover">{/Basics|Problem Solving/i.test(c.category) ? <RealPhoto photo={c.category==='Basics'?'childrenITClass':'modernComputerClass'} alt={c.category==='Basics'?'Children learning fundamental computer skills':'Students practicing problem solving at computers'} fallback="/arcade/code-maze.svg"/> : <img src={/Game|game|Create|create/i.test(c.category+' '+c.title)?'/arcade/space-invaders.svg':/Loop|Logic|loop|logic/i.test(c.category+' '+c.title)?'/arcade/logic-builder.svg':/Data|List|data|list/i.test(c.category+' '+c.title)?'/arcade/treasure-sorter.svg':'/arcade/code-maze.svg'} alt="" loading="lazy"/>}<span>{c.category}</span></div>
              <div className="p-4 pb-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-[11px]">
                    {c.category}
                  </span>
                  <span className="text-slate-500 text-[11px] font-medium">{c.difficulty}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug mb-1.5">
                  {c.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {c.description}
                </p>
              </div>

              {/* Card Meta & Action */}
              <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 mt-auto">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {c.lessonsCount} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {c.durationHours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {c.enrolledCount}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={c.instructorAvatar}
                      alt={c.instructorName}
                      className="w-5 h-5 rounded-full border border-slate-200 shrink-0"
                    />
                    <span className="text-[11px] text-slate-700 font-medium truncate">
                      {c.instructorName}
                    </span>
                  </div>

                  {c.isEnrolled ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Enrolled
                    </span>
                  ) : (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleEnroll(c.id);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-md transition-colors shrink-0"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Class Detail Modal */}
      {selectedClassForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs">
                  <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {selectedClassForModal.category}
                  </span>
                  <span className="text-slate-500 font-medium">
                    {selectedClassForModal.difficulty}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{selectedClassForModal.language}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">
                  {selectedClassForModal.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedClassForModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  About this class
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedClassForModal.description}
                </p>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  What you will learn
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedClassForModal.learningOutcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syllabus Outline */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Class Syllabus ({selectedClassForModal.syllabus.length} Modules)
                </h3>
                <div className="space-y-2">
                  {selectedClassForModal.syllabus.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 text-xs hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[11px]">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-900 block">{item.title}</span>
                          <span className="text-[11px] text-slate-500 capitalize">
                            {item.type} · {item.durationMin} mins
                          </span>
                        </div>
                      </div>

                      {item.completed ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : item.exerciseId ? (
                        <button
                          onClick={() => {
                            setSelectedClassForModal(null);
                            selectExercise(item.exerciseId!);
                          }}
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold rounded"
                        >
                          Launch Exercise
                        </button>
                      ) : (
                        <span className="text-slate-400">Lesson</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor Section */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={selectedClassForModal.instructorAvatar}
                  alt={selectedClassForModal.instructorName}
                  className="w-10 h-10 rounded-full border border-slate-200"
                />
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">
                    Instructor
                  </span>
                  <span className="text-xs font-bold text-slate-900 block">
                    {selectedClassForModal.instructorName}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Lead Educator & Curriculum Mentor
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">
                  {selectedClassForModal.enrolledCount} learners enrolled
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedClassForModal.isEnrolled ? (
                  <>
                    <button
                      onClick={() => {
                        leaveClass(selectedClassForModal.id);
                        setSelectedClassForModal({
                          ...selectedClassForModal,
                          isEnrolled: false,
                          enrolledCount: Math.max(0, selectedClassForModal.enrolledCount - 1),
                        });
                      }}
                      className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Leave Class
                    </button>
                    <button
                      onClick={() => {
                        selectClass(selectedClassForModal.id);
                        setSelectedClassForModal(null);
                      }}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Continue Class</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEnroll(selectedClassForModal.id)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Enroll Now for Free</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
