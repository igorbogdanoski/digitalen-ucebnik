import React, { useState } from 'react';
import { ContentBlock, ContentType } from '../types';
import MathFraction from './MathFraction';
import FormattedText from './FormattedText';
import Latex from './Latex';
import { Lightbulb, BookOpen, User, Volume2, LayoutGrid, Eye, CheckCircle2 } from 'lucide-react';

// Sub-component to handle state for revealing answers one by one
const FractionCardExercise: React.FC<{ block: ContentBlock }> = ({ block }) => {
  const [revealedIndex, setRevealedIndex] = useState(0);
  const totalAnswers = block.listItems?.length || 0;

  const handleReveal = () => {
    if (revealedIndex < totalAnswers) {
      setRevealedIndex(prev => prev + 1);
    }
  };

  return (
    <div className="my-10 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center mb-4 border-b border-slate-200 pb-3">
        <LayoutGrid className="w-5 h-5 text-indigo-600 mr-2" />
        <h4 className="font-bold text-indigo-900 text-lg">{block.label || 'Задача'}</h4>
      </div>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {block.cards?.map((card, cIdx) => (
          <div key={cIdx} className="flex flex-col items-center group">
            <span className="text-sm font-bold text-slate-400 mb-1 group-hover:text-indigo-500 transition-colors">{card.label}</span>
            <div className={`w-24 h-24 flex items-center justify-center shadow-sm rounded-xl border border-black/5 ${card.color} transform transition-transform group-hover:scale-110 group-hover:rotate-1`}>
              <MathFraction
                numerator={card.fraction.numerator}
                denominator={card.fraction.denominator}
                size="xl"
                className="scale-110 text-slate-800"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Question Content */}
      {block.content && (
        <div className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm text-gray-800 text-lg mb-6 leading-relaxed whitespace-pre-wrap">
          <FormattedText text={block.content} />
        </div>
      )}

      {/* Revealed Answers Area */}
      <div className="space-y-4">
        {block.listItems && block.listItems.map((item, i) => {
          if (i >= revealedIndex) return null;
          
          return (
            <div key={i} className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-100 animate-in slide-in-from-bottom-2 fade-in duration-500">
              <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 shrink-0" />
              <div className="text-gray-800 text-lg">
                {item.split('$').map((part, idx) =>
                  idx % 2 === 1 ? (
                    <Latex key={idx} expression={part} className="mx-1 font-bold text-indigo-900" />
                  ) : (
                    <span key={idx}>{part}</span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reveal Button */}
      {block.listItems && revealedIndex < totalAnswers && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleReveal}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all ring-4 ring-indigo-50"
          >
            <Eye className="w-5 h-5" />
            <span>
              Покажи одговор ({revealedIndex + 1}/{totalAnswers})
            </span>
          </button>
        </div>
      )}
      
      {revealedIndex === totalAnswers && totalAnswers > 0 && (
          <div className="mt-4 text-center text-sm text-gray-400 italic">
              Сите делови се прикажани.
          </div>
      )}
    </div>
  );
};

interface TheoryTabProps {
  blocks: ContentBlock[];
}

const TheoryTab: React.FC<TheoryTabProps> = ({ blocks }) => {
  
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'mk-MK'; 
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Вашиот прелистувач не поддржува аудио читање.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl shadow-sm mb-10">
        <h2 className="flex items-center text-indigo-900 font-bold text-xl mb-2">
          <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
          Теоретски Дел (Учебник)
        </h2>
        <p className="text-indigo-700 text-base">
          Следи ги упатствата и разгледај ги решените примери.
        </p>
      </div>

      {blocks.map((block, index) => {
        switch (block.type) {
          case ContentType.TEXT:
            return (
              <div key={index} className="text-gray-800 text-lg leading-loose mb-6">
                 {block.content?.split('$').map((part, i) => 
                    i % 2 === 1 ? (
                        <Latex key={i} expression={part} className="mx-1 font-bold text-gray-900" />
                    ) : (
                        <span key={i}>{part}</span>
                    )
                 )}
              </div>
            );
          
          case ContentType.LATEX_BLOCK:
             return (
                 <div key={index} className="flex justify-center my-8 py-4 px-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                     <Latex expression={block.content || ''} block={true} className="text-2xl text-slate-900" />
                 </div>
             );

          case ContentType.TIP:
            return (
              <div key={index} className="bg-amber-50 border-l-4 border-amber-400 p-5 flex gap-4 my-8 rounded-r-lg shadow-sm">
                <div className="shrink-0 pt-1">
                  <Lightbulb className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-lg">{block.label || 'Совет'}</h4>
                  <div className="text-gray-800 text-lg">
                     {block.content}
                  </div>
                </div>
              </div>
            );

          case ContentType.CHARACTER_SPEECH:
            return (
              <div key={index} className="flex flex-col md:flex-row gap-6 my-10 items-start">
                 <div className="flex flex-col items-center shrink-0 mx-auto md:mx-0">
                    <div className="w-24 h-24 rounded-full bg-pink-100 border-4 border-white shadow-lg flex items-center justify-center mb-2 overflow-hidden relative">
                        <User className="w-16 h-16 text-pink-500" />
                    </div>
                    <span className="font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full text-sm">
                        {block.label || 'Зара'}
                    </span>
                 </div>
                 <div className="relative bg-white p-6 rounded-2xl rounded-tl-none shadow-md border border-gray-100 flex-1">
                    <div className="absolute top-0 -left-3 w-0 h-0 border-t-[15px] border-t-white border-l-[15px] border-l-transparent hidden md:block" style={{ filter: 'drop-shadow(-1px 1px 1px rgba(0,0,0,0.05))' }}></div>
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-pink-600 font-bold text-sm uppercase tracking-wide">Размислувај како математичар</h4>
                        <button 
                            onClick={() => handleSpeak(block.audioText || block.content || '')}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full transition-colors"
                            title="Слушни го текстот"
                        >
                            <Volume2 className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-gray-800 text-lg leading-relaxed italic">
                        "{block.content?.split('$').map((part, i) => 
                            i % 2 === 1 ? (
                                <Latex key={i} expression={part} className="mx-1 font-bold text-gray-900" />
                            ) : (
                                <span key={i}>{part}</span>
                            )
                        )}"
                    </div>
                 </div>
              </div>
            );

          case ContentType.FRACTION_BLOCK:
            return (
              <div key={index} className="flex flex-wrap items-center gap-4 my-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm justify-center">
                 <span className="text-lg font-bold text-gray-500 mr-2 uppercase tracking-wider text-xs">Пример:</span>
                 <MathFraction 
                   numerator={block.fraction?.numerator || 0}
                   denominator={block.fraction?.denominator || 1}
                   whole={block.fraction?.whole}
                   size="lg"
                   className="text-gray-900 scale-125 origin-center"
                 />
                 <span className="text-2xl text-gray-900 ml-4 font-math-num">
                    <FormattedText text={block.content || ''} />
                 </span>
              </div>
            );
            
          case ContentType.FRACTION_CARDS:
            // Use the new stateful component
            return <FractionCardExercise key={index} block={block} />;

          case ContentType.EXAMPLE:
            return (
              <div key={index} className="border border-indigo-100 rounded-2xl overflow-hidden shadow-md bg-white my-10">
                <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mr-3 shadow-sm">
                        Пример
                    </span>
                    <span className="text-indigo-900 font-bold text-lg">
                        {block.label || 'Работен пример'}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 bg-white">
                  <p className="font-medium text-gray-900 mb-6 text-lg border-b border-gray-100 pb-4">
                     {block.content}
                  </p>
                  {block.listItems && (
                    <ul className="space-y-4">
                      {block.listItems.map((item, i) => (
                        <li key={i} className="flex items-start text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-indigo-100 transition-colors">
                          <span className="mr-4 mt-1 flex justify-center items-center w-7 h-7 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full shrink-0 border border-indigo-200 shadow-sm">
                            {i + 1}
                          </span>
                          <div className="text-lg flex-1">
                             {item.split('$').map((part, idx) => 
                                idx % 2 === 1 ? (
                                    <Latex key={idx} expression={part} className="mx-1 font-bold text-indigo-950 inline-block align-middle" />
                                ) : (
                                    <span key={idx} className="align-middle">{part}</span>
                                )
                             )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
            
          default:
            return null;
        }
      })}
    </div>
  );
};

export default TheoryTab;