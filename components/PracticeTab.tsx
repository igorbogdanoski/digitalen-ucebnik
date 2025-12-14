import React, { useState } from 'react';
import { Exercise, QuestionPart } from '../types';
import MathFraction from './MathFraction';
import FractionInput from './FractionInput';
import Latex from './Latex';
import FormattedText from './FormattedText';
import { CheckCircle2, XCircle, PenTool, RotateCcw, User, MessageSquare } from 'lucide-react';

interface PracticeTabProps {
  exercises: Exercise[];
}

const PracticeTab: React.FC<PracticeTabProps> = ({ exercises }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (results[questionId] !== undefined) {
      const newResults = { ...results };
      delete newResults[questionId];
      setResults(newResults);
    }
  };

  const checkAnswer = (questionId: string, correctAnswer: string) => {
    const userAnswer = answers[questionId]?.trim();
    if (!userAnswer) return;
    
    // Normalize format for comparison
    const normalizedUser = userAnswer.replace(/\s*\/\s*/g, '/').toLowerCase();
    const normalizedCorrect = correctAnswer.replace(/\s*\/\s*/g, '/').toLowerCase();

    // Check strict equality or wildcard
    let isCorrect = normalizedUser === normalizedCorrect;
    if (correctAnswer === '*') isCorrect = true;

    setResults(prev => ({ ...prev, [questionId]: isCorrect }));
  };

  // Helper to render a single input/select field
  const renderInput = (q: QuestionPart) => {
    const isCorrect = results[q.id];
    
    if (q.type === 'SELECT' && q.options) {
        return (
            <div className="flex gap-2 items-center">
                {q.options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => handleInputChange(q.id, opt)}
                        disabled={isCorrect === true}
                        className={`w-10 h-10 rounded text-lg font-bold border transition-all flex items-center justify-center
                            ${answers[q.id] === opt 
                                ? 'border-indigo-600 bg-indigo-600 text-white' 
                                : 'border-gray-300 bg-white text-gray-600 hover:border-indigo-400'
                            }
                            ${isCorrect === true && answers[q.id] === opt ? '!bg-green-500 !border-green-500 !text-white' : ''}
                            ${isCorrect === false && answers[q.id] === opt ? '!bg-red-500 !border-red-500 !text-white' : ''}
                        `}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        );
    } 
    
    if (q.inputType === 'FRACTION') {
        return (
            <div className="relative group">
                <FractionInput 
                    value={answers[q.id] || ''}
                    onChange={(val) => handleInputChange(q.id, val)}
                    onEnter={() => checkAnswer(q.id, q.correctAnswer)}
                    disabled={isCorrect === true}
                    status={isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : 'neutral'}
                />
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-[150px]">
            <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer(q.id, q.correctAnswer)}
                placeholder={q.placeholder || "?"}
                className={`w-full p-2 text-center text-lg font-math-num border rounded outline-none transition-all
                    ${isCorrect === true 
                        ? 'border-green-500 bg-green-50 text-green-900 font-bold' 
                        : isCorrect === false 
                            ? 'border-red-400 bg-red-50 text-red-900'
                            : 'border-gray-300 focus:border-indigo-500'
                    }
                `}
            />
        </div>
    );
  };

  const renderCheckButton = (q: QuestionPart) => {
    if (results[q.id] === true) return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    
    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={() => checkAnswer(q.id, q.correctAnswer)}
                disabled={!answers[q.id]}
                className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 disabled:opacity-50"
            >
                OK
            </button>
            {results[q.id] === false && (
                <button onClick={() => handleInputChange(q.id, '')}>
                    <RotateCcw className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
            )}
        </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in slide-in-from-right-4 fade-in duration-500">
      
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md mb-8">
        <h2 className="flex items-center text-green-800 font-bold text-lg mb-1">
          <PenTool className="w-5 h-5 mr-2" />
          Дел за Вежбање (Работна Тетратка)
        </h2>
        <p className="text-green-600 text-sm">
          Реши ги задачите за да го потврдиш твоето знаење.
        </p>
      </div>

      {exercises.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
          Сè уште нема додадени вежби за оваа лекција.
        </div>
      ) : (
        exercises.map((exercise) => {
          
          // --- TABLE LAYOUT RENDER ---
          if (exercise.displayMode === 'TABLE') {
             // Group questions by label to form rows
             const rows: Record<string, QuestionPart[]> = {};
             const rowLabels: string[] = [];
             
             exercise.questions.forEach(q => {
                 if (q.label && !rows[q.label]) {
                     rows[q.label] = [];
                     rowLabels.push(q.label);
                 }
                 if (q.label) rows[q.label].push(q);
             });

             return (
               <div key={exercise.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 overflow-hidden">
                 <div className="border-b border-gray-100 pb-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{exercise.title}</h3>
                    <p className="text-gray-600 mt-2"><FormattedText text={exercise.instruction} /></p>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-indigo-50 border-b-2 border-indigo-100 text-indigo-800">
                                <th className="p-3 font-bold">Единечна Дропка</th>
                                <th className="p-3 font-bold">Децимален Број</th>
                                <th className="p-3 font-bold">Тип (К/П)</th>
                                <th className="p-3 font-bold text-center">Проверка</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowLabels.map((label, idx) => {
                                const rowQs = rows[label];
                                const qDecimal = rowQs.find(q => q.type === 'INPUT');
                                const qType = rowQs.find(q => q.type === 'SELECT');
                                
                                return (
                                    <tr key={label} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="p-3">
                                            {qDecimal?.latex ? <Latex expression={qDecimal.latex} className="text-xl" /> : <span className="font-bold">{label}</span>}
                                        </td>
                                        <td className="p-3">
                                            {qDecimal && renderInput(qDecimal)}
                                        </td>
                                        <td className="p-3">
                                            {qType && renderInput(qType)}
                                        </td>
                                        <td className="p-3 text-center">
                                            {/* Unified Check Logic: Show check if both are correct, or check button if any input exists */}
                                            <div className="flex justify-center gap-2">
                                              {qDecimal && renderCheckButton(qDecimal)}
                                              {qType && renderCheckButton(qType)}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                 </div>
               </div>
             );
          }

          // --- STANDARD LIST LAYOUT RENDER ---
          return (
            <div key={exercise.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800">{exercise.title}</h3>
                <p className="text-gray-600 mt-2 text-lg">
                    <FormattedText text={exercise.instruction} />
                </p>
                </div>

                <div className="space-y-6">
                {exercise.questions.map((q) => {
                    // INFO BLOCK (Zara)
                    if (q.type === 'INFO') {
                        return (
                            <div key={q.id} className="flex flex-col md:flex-row gap-4 my-8 items-start bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                <div className="flex flex-col items-center shrink-0 mx-auto md:mx-0">
                                    <div className="w-20 h-20 rounded-full bg-pink-100 border-4 border-white shadow-md flex items-center justify-center mb-2 overflow-hidden">
                                        <User className="w-12 h-12 text-pink-500" />
                                    </div>
                                    <span className="font-bold text-pink-600 bg-white px-3 py-1 rounded-full text-xs shadow-sm border border-pink-100">
                                        {q.label || 'Зара'}
                                    </span>
                                </div>
                                <div className="relative bg-white p-5 rounded-xl shadow-sm border border-indigo-50 flex-1 w-full">
                                    <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-l border-b border-indigo-50 transform rotate-45 hidden md:block"></div>
                                    <div className="text-gray-800 text-lg italic leading-relaxed">
                                        <FormattedText text={q.postText || ''} />
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // STANDARD QUESTION
                    return (
                        <div key={q.id} className="flex flex-col md:flex-row md:items-center gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all">
                            <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center font-bold text-indigo-700 shrink-0 border border-indigo-200 self-start md:self-center shadow-sm">
                                {q.label}
                            </div>
                            <div className="flex items-center gap-4 flex-wrap grow">
                                {q.latex ? (
                                    <div className="px-2">
                                        <Latex expression={q.latex} className="text-2xl text-gray-900" />
                                    </div>
                                ) : (
                                    <>
                                        {q.preText && <span className="font-medium text-xl text-gray-800 font-math-num"><FormattedText text={q.preText} /></span>}
                                        {q.postText && <span className="font-medium text-xl text-gray-800 font-math-num"><FormattedText text={q.postText} /></span>}
                                    </>
                                )}
                                
                                {renderInput(q)}
                                {renderCheckButton(q)}
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PracticeTab;