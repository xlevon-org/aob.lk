import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COURSES_DATA } from '../data/courses';
import { CourseLesson } from '../types';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  Maximize2, 
  FileText, 
  Award, 
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';

interface CoursePlayerViewProps {
  slug?: string;
}

export const CoursePlayerView: React.FC<CoursePlayerViewProps> = ({ slug }) => {
  const { 
    currentParams, 
    navigate, 
    markLessonComplete, 
    isLessonCompleted, 
    getCourseProgressPercent,
    showToast 
  } = useApp();

  const activeSlug = slug || currentParams.courseSlug || 'mastering-deriv-synthetic-indices';
  const course = COURSES_DATA.find((c) => c.slug === activeSlug) || COURSES_DATA[0];

  // Flatten lessons to navigate easily
  const allLessons: { lesson: CourseLesson; moduleTitle: string }[] = [];
  course.modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      allLessons.push({ lesson: les, moduleTitle: mod.title });
    });
  });

  const [activeLessonId, setActiveLessonId] = useState<string>(allLessons[0]?.lesson.id || '');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz' | 'resources'>('notes');

  // Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentLessonData = allLessons.find((l) => l.lesson.id === activeLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.lesson.id === activeLessonId);

  const completed = isLessonCompleted(course.id, activeLessonId);
  const progressPercent = getCourseProgressPercent(course.id, course.totalLessons);

  const handleToggleComplete = () => {
    markLessonComplete(course.id, activeLessonId, !completed);
    showToast(
      !completed ? `Lesson marked as complete!` : 'Lesson marked as incomplete',
      !completed ? 'success' : 'info'
    );
  };

  const handleNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentIndex + 1].lesson.id);
      setIsPlaying(false);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      setActiveLessonId(allLessons[currentIndex - 1].lesson.id);
      setIsPlaying(false);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Simulated quiz question for this lesson
  const quizQuestion = {
    question: `Regarding ${currentLessonData.lesson.title}, which statement best reflects Deriv risk principles?`,
    options: [
      'Risk 10% of account equity when Volatility 75 breaks out of a channel.',
      'Always determine your Stop Loss distance first before sizing your position to risk 1-2%.',
      'Synthetic indices are influenced by real-world interest rate announcements.',
      'Stop losses are unnecessary because synthetic indices revert to mean automatically.'
    ],
    correctIndex: 1,
    explanation: 'Correct! Risk must always be predetermined based on Stop Loss distance. Deriv synthetics run 24/7 on audited PRNG algorithms without central bank intervention.'
  };

  return (
    <div id="course-player-page" className="min-h-screen bg-[#f8f9fa] pb-16">
      {/* Top Navbar */}
      <div className="bg-[#111317] text-white border-b border-[#222631] py-3.5 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/trading-courses')}
            className="flex items-center gap-2 text-[13px] font-semibold text-[#a0a6b1] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Courses</span>
          </button>

          <div className="text-center px-4 max-w-xl truncate">
            <span className="text-[14px] font-bold text-white truncate block">
              {course.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-[#88909e] uppercase font-semibold">Course Progress</div>
              <div className="text-[13px] font-bold text-[#008832]">{progressPercent}% Completed</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#008832]/20 border border-[#008832] flex items-center justify-center text-[#008832] font-bold text-[12px]">
              {progressPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Video & Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Immersive Video Screen Player */}
            <div className="relative aspect-[16/9] bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#222631] group">
              <img
                src={course.imageUrl}
                alt={currentLessonData.lesson.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-40' : 'opacity-70'}`}
              />

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-[#ff444f] hover:bg-[#eb3e48] text-white flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                </button>
              </div>

              {/* Watermark & Lesson Title in Player */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white text-[12px]">
                <span className="w-2 h-2 rounded-full bg-[#008832] animate-pulse" />
                <span className="font-semibold">{currentLessonData.lesson.title}</span>
              </div>

              {/* Video Bottom Scrubbing Bar Controls */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2">
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/30 hover:h-2 transition-all rounded-full overflow-hidden cursor-pointer">
                  <div className={`h-full bg-[#ff444f] ${isPlaying ? 'w-2/3 animate-pulse' : 'w-1/4'}`} />
                </div>

                <div className="flex items-center justify-between text-white text-[12px] font-medium pt-1">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-[#ff444f] cursor-pointer">
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <span>{isPlaying ? '04:15' : '00:00'} / {currentLessonData.lesson.duration}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Volume2 size={16} className="cursor-pointer hover:text-[#ff444f]" />
                    <Maximize2 size={16} className="cursor-pointer hover:text-[#ff444f]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Title & Completion Action Bar */}
            <div className="bg-white rounded-2xl p-6 border border-[#e6e9ea] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[12px] font-bold text-[#ff444f] uppercase tracking-wider">
                  {currentLessonData.moduleTitle}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111] font-heading">
                  {currentLessonData.lesson.title}
                </h2>
                <div className="flex items-center gap-2 text-[12px] text-[#6e6e6e]">
                  <Clock size={13} />
                  <span>Duration: {currentLessonData.lesson.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleComplete}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all flex items-center gap-2 cursor-pointer ${
                    completed
                      ? 'bg-[#e8f7ee] text-[#008832] border border-[#008832]/30'
                      : 'bg-[#ff444f] text-white hover:bg-[#eb3e48] shadow-xs'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  <span>{completed ? 'Completed' : 'Mark as Complete'}</span>
                </button>
              </div>
            </div>

            {/* Tabbed Info (Notes, Knowledge Check Quiz, Resources) */}
            <div className="bg-white rounded-2xl border border-[#e6e9ea] p-6 shadow-xs space-y-6">
              <div className="border-b border-[#e6e9ea] flex gap-6">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 text-[14px] font-bold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'notes' ? 'border-[#ff444f] text-[#ff444f]' : 'border-transparent text-[#6e6e6e]'
                  }`}
                >
                  Lesson Notes & Summary
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`pb-3 text-[14px] font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'quiz' ? 'border-[#ff444f] text-[#ff444f]' : 'border-transparent text-[#6e6e6e]'
                  }`}
                >
                  <HelpCircle size={15} />
                  <span>Knowledge Check</span>
                </button>
              </div>

              {activeTab === 'notes' ? (
                <div className="prose max-w-none text-[#333333] text-[15px] leading-relaxed space-y-4">
                  <p>
                    In this lesson, we study the key technical framework governing this market setup. Understanding liquidity sweeps and dynamic equilibrium zones is critical before committing real capital.
                  </p>
                  <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#e6e9ea] space-y-2">
                    <div className="font-bold text-[#111111] text-[14px]">Primary Rule:</div>
                    <p className="text-[13.5px] text-[#555555]">
                      Always verify that your risk-reward ratio is at least 1:2. Never enter an impulse trade without an identified invalidation level where your trade idea is proven false.
                    </p>
                  </div>
                </div>
              ) : (
                /* Interactive Quiz Simulator */
                <div className="space-y-5">
                  <div className="text-[15px] font-bold text-[#111111]">
                    {quizQuestion.question}
                  </div>

                  <div className="space-y-2.5">
                    {quizQuestion.options.map((opt, idx) => {
                      let btnStyle = 'border-[#e6e9ea] bg-[#f8f9fa] text-[#333333] hover:bg-[#f2f3f5]';
                      if (selectedQuizOption === idx) {
                        btnStyle = 'border-[#ff444f] bg-[#fff1f2] text-[#ff444f] font-medium';
                      }
                      if (quizSubmitted) {
                        if (idx === quizQuestion.correctIndex) {
                          btnStyle = 'border-[#008832] bg-[#e8f7ee] text-[#008832] font-bold';
                        } else if (selectedQuizOption === idx) {
                          btnStyle = 'border-[#ff444f] bg-[#fff1f2] text-[#ff444f] line-through';
                        }
                      }
                      return (
                        <button
                          key={idx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedQuizOption(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-[14px] transition-all cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[12px] shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      disabled={selectedQuizOption === null}
                      onClick={() => {
                        setQuizSubmitted(true);
                        if (selectedQuizOption === quizQuestion.correctIndex) {
                          showToast('Correct answer! Lesson concept mastered.', 'success');
                        } else {
                          showToast('Incorrect answer. Review the explanation.', 'warning');
                        }
                      }}
                      className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] disabled:opacity-50 text-white font-semibold text-[14px] rounded-lg transition-colors cursor-pointer"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="p-4 bg-[#e8f7ee] border border-[#008832]/30 rounded-xl space-y-2">
                      <div className="font-bold text-[#008832] text-[14px] flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        <span>Explanation</span>
                      </div>
                      <p className="text-[13.5px] text-[#222222]">
                        {quizQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Previous / Next Lesson Navigation Footer */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrevLesson}
                className="px-4 py-2.5 bg-white border border-[#d6dadb] hover:bg-[#f2f3f5] disabled:opacity-40 text-[#333333] font-semibold text-[13.5px] rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Previous Lesson</span>
              </button>

              <button
                disabled={currentIndex === allLessons.length - 1}
                onClick={handleNextLesson}
                className="px-5 py-2.5 bg-[#ff444f] hover:bg-[#eb3e48] disabled:opacity-40 text-white font-semibold text-[13.5px] rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Next Lesson</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Curriculum Syllabus Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-[#e6e9ea] p-5 shadow-xs space-y-4">
              <div className="space-y-2">
                <h3 className="text-[16px] font-bold text-[#111111] font-heading">
                  Course Modules & Syllabus
                </h3>
                <div className="flex items-center justify-between text-[12px] text-[#6e6e6e]">
                  <span>{allLessons.length} total lessons</span>
                  <span className="font-semibold text-[#008832]">{progressPercent}% complete</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-[#e6e9ea] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#008832] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Module Accordions */}
              <div className="space-y-4 pt-2">
                {course.modules.map((mod, modIdx) => (
                  <div key={mod.id} className="space-y-1.5">
                    <div className="text-[12px] font-bold text-[#6e6e6e] uppercase tracking-wider px-2">
                      Module {modIdx + 1}: {mod.title}
                    </div>

                    <div className="space-y-1">
                      {mod.lessons.map((les) => {
                        const isCurrent = les.id === activeLessonId;
                        const isDone = isLessonCompleted(course.id, les.id);
                        return (
                          <button
                            key={les.id}
                            onClick={() => {
                              setActiveLessonId(les.id);
                              setIsPlaying(false);
                              setSelectedQuizOption(null);
                              setQuizSubmitted(false);
                            }}
                            className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-[#fff1f2] text-[#ff444f] font-semibold border border-[#ff444f]/30'
                                : 'hover:bg-[#f8f9fa] text-[#444444]'
                            }`}
                          >
                            <div className="flex items-center gap-3 truncate pr-2">
                              {isDone ? (
                                <CheckCircle2 size={16} className="text-[#008832] shrink-0" />
                              ) : (
                                <Circle size={16} className={isCurrent ? 'text-[#ff444f]' : 'text-[#999999]'} />
                              )}
                              <span className="text-[13.5px] truncate">{les.title}</span>
                            </div>
                            <span className="text-[11px] text-[#888888] shrink-0 font-mono">
                              {les.duration}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
