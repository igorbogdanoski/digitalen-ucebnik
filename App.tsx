import React, { useState, useMemo, useEffect } from 'react';
import { MATH_CONTENT } from './constants';
import { Menu, Book, PenTool, ChevronRight, GraduationCap, ClipboardList } from 'lucide-react';
import TheoryTab from './components/TheoryTab';
import PracticeTab from './components/PracticeTab';
import Assistant from './components/Assistant';

function App() {
  // Set default lesson to Investigation ('lesson-investigation')
  const [activeLessonId, setActiveLessonId] = useState('lesson-investigation');
  const [activeTab, setActiveTab] = useState<'theory' | 'practice'>('practice'); // Default to practice for this lesson
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Derive current lesson data
  const currentLesson = useMemo(() => 
    MATH_CONTENT.lessons.find(l => l.id === activeLessonId) || MATH_CONTENT.lessons[0], 
  [activeLessonId]);

  // Context string for AI
  const aiContext = useMemo(() => {
    if (!currentLesson) return "Math basics";
    const base = `Lession: ${currentLesson.title}. `;
    if (activeTab === 'theory') {
      return base + "Content: " + currentLesson.theory.map(t => t.content).join(" ");
    } else {
      return base + "Exercises: " + currentLesson.practice.map(p => p.instruction).join(" ");
    }
  }, [currentLesson, activeTab]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      
      {/* Sidebar Navigation */}
      <aside 
        className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col overflow-hidden shadow-xl z-10`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-indigo-700 text-white">
          <GraduationCap className="w-8 h-8" />
          <div>
             <h1 className="font-bold text-xl leading-tight tracking-tight">MathFlow</h1>
             <p className="text-indigo-200 text-xs font-medium">Дигитален Учебник</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
           <div className="mb-6 px-2">
             <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Наставна Програма</h2>
             
             <div className="space-y-3">
               {/* Diagnostic Check - Special Styling */}
                {MATH_CONTENT.lessons.filter(l => l.id === 'diagnostic').map(lesson => (
                 <button
                   key={lesson.id}
                   onClick={() => setActiveLessonId(lesson.id)}
                   className={`w-full text-left p-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between shadow-sm
                     ${activeLessonId === lesson.id 
                       ? 'bg-amber-100 text-amber-800 border-2 border-amber-300' 
                       : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                     }
                   `}
                 >
                   <div className="flex items-center">
                     <ClipboardList className={`w-5 h-5 mr-3 ${activeLessonId === lesson.id ? 'text-amber-600' : 'text-gray-400'}`} />
                     <span>{lesson.title}</span>
                   </div>
                   {activeLessonId === lesson.id && <ChevronRight className="w-4 h-4 shrink-0 text-amber-600" />}
                 </button>
               ))}

               <div className="h-px bg-gray-200 my-4 mx-2"></div>

               <div className="px-2 pb-2 text-xs font-semibold text-gray-500 uppercase">Тема: {MATH_CONTENT.title}</div>

               {/* Regular Lessons */}
               {MATH_CONTENT.lessons.filter(l => l.id !== 'diagnostic').map((lesson, index) => (
                 <button
                   key={lesson.id}
                   onClick={() => setActiveLessonId(lesson.id)}
                   className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group relative pl-10
                     ${activeLessonId === lesson.id 
                       ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                     }
                   `}
                 >
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                     {index + 1}
                   </div>
                   <span className="truncate mr-2">{lesson.title}</span>
                   {activeLessonId === lesson.id && <ChevronRight className="w-4 h-4 shrink-0" />}
                 </button>
               ))}
             </div>
           </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-center text-gray-400">Верзија 1.3 • МКД Стандард</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50">
        
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-gray-800 text-lg truncate max-w-xl">
              {currentLesson?.title}
            </h2>
          </div>
          
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
             <button
               onClick={() => setActiveTab('theory')}
               className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all
                 ${activeTab === 'theory' 
                   ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-black/5' 
                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                 }
               `}
             >
               <Book className="w-4 h-4" />
               Учебник
             </button>
             <button
               onClick={() => setActiveTab('practice')}
               className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all
                 ${activeTab === 'practice' 
                   ? 'bg-white text-green-700 shadow-sm ring-1 ring-black/5' 
                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                 }
               `}
             >
               <PenTool className="w-4 h-4" />
               Тетратка
             </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth">
          <div className="container mx-auto px-6 py-8 max-w-5xl">
            {currentLesson ? (
              activeTab === 'theory' ? (
                <TheoryTab blocks={currentLesson.theory} />
              ) : (
                <PracticeTab exercises={currentLesson.practice} />
              )
            ) : (
              <div className="text-center mt-20 text-gray-400">
                Изберете лекција од менито.
              </div>
            )}
          </div>
        </div>
        
        {/* Floating AI Assistant */}
        <Assistant contextText={aiContext} />
        
      </main>
    </div>
  );
}

export default App;