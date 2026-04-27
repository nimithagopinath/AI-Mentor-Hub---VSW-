import React, { useState, useEffect } from "react";
import { UserProfile, Roadmap } from "../types";
import { generateAssessmentQuiz, generateRoadmap } from "../services/geminiService";
import { motion } from "motion/react";
import { Loader2, Radio, CheckCircle2, XCircle, ArrowRight, BrainCircuit, Trophy } from "lucide-react";

interface AssessmentProps {
  profile: UserProfile;
  onComplete: (results: any, roadmap: Roadmap) => void;
}

export default function Assessment({ profile, onComplete }: AssessmentProps) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [status, setStatus] = useState("Generating evaluation...");

  useEffect(() => {
    async function init() {
      try {
        const quiz = await generateAssessmentQuiz(profile);
        setQuestions(quiz);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setStatus("Error initializing AI. Please try again.");
      }
    }
    init();
  }, [profile]);

  const handleSelectAnswer = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAnswers({ ...answers, [questions[currentQuestionIndex].id]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
    } else {
      setShowFeedback(false);
      setShowReport(true);
    }
  };

  const finalize = async () => {
    setIsFinalizing(true);
    setStatus("Analyzing responses and building roadmap...");
    try {
      const roadmap = await generateRoadmap(profile, answers);
      onComplete(answers, roadmap);
    } catch (error) {
      console.error(error);
      setStatus("Synthesis failed. Retrying...");
      setIsFinalizing(false);
    }
  };

  if (loading || isFinalizing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
        <Loader2 className="animate-spin text-indigo-600" size={48} strokeWidth={1} />
        <div className="text-center space-y-4">
          <p className="text-sm font-bold text-slate-800 uppercase tracking-widest animate-pulse">{status}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            Neural Core v3 // {isFinalizing ? "Strategy Synthesis" : "Question Generation"}
          </p>
        </div>
      </div>
    );
  }

  if (showReport) {
    const score = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    return (
      <div className="max-w-2xl mx-auto space-y-12 py-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
          <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-200">
            <Trophy size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Phase Complete</h2>
            <p className="text-slate-500 font-medium mt-2">Technical Proficiency Scan Results</p>
          </div>
          <div className="inline-flex items-center gap-4 bg-white border border-slate-200 px-8 py-5 rounded-3xl shadow-sm">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Proficiency Scored</p>
              <p className="text-3xl font-black text-slate-800">{score} / {questions.length}</p>
            </div>
            <div className="w-px h-12 bg-slate-100" />
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Assessment Status</p>
              <p className="text-lg font-bold text-green-600">Verified</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Detailed Analysis</h3>
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={q.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    answers[q.id] === q.correctAnswer ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {answers[q.id] === q.correctAnswer ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 truncate max-w-md">{q.question}</p>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Q{i+1}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={finalize}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl text-base font-bold shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          Initialize Learning Roadmap <BrainCircuit size={20} />
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Technical proficiency check</h2>
          <p className="text-2xl font-bold text-slate-800 tracking-tight">Active Evaluation</p>
        </div>
        <div className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
          Question {currentQuestionIndex + 1} / {questions.length}
        </div>
      </div>

      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <h3 className="text-xl lg:text-2xl font-bold text-slate-800 leading-snug">
          {currentQuestion.question}
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option: string) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedAnswer;
            
            return (
              <button
                key={option}
                onClick={() => handleSelectAnswer(option)}
                disabled={showFeedback}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left group ${
                  showFeedback 
                    ? isCorrect 
                      ? "border-green-500 bg-green-50 text-green-700" 
                      : isSelected 
                        ? "border-red-500 bg-red-50 text-red-700" 
                        : "border-slate-100 opacity-50 grayscale"
                    : "bg-white border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-lg transition-all"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center shrink-0 ${
                    showFeedback && isCorrect ? "border-green-500 bg-green-500 text-white" : "border-slate-200"
                  }`}>
                    {showFeedback && isCorrect && <CheckCircle2 size={12} />}
                  </div>
                  <span className="font-semibold text-sm">{option}</span>
                </div>
                {showFeedback && isSelected && !isCorrect && (
                  <XCircle size={18} className="text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border-l-4 space-y-3 ${
              selectedAnswer === currentQuestion.correctAnswer 
                ? "bg-green-50 border-green-500" 
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-widest ${
                selectedAnswer === currentQuestion.correctAnswer ? "text-green-700" : "text-red-700"
              }`}>
                {selectedAnswer === currentQuestion.correctAnswer ? "Correct Analysis" : "Incorrect response"}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              {currentQuestion.explanation}
            </p>
            <button
               onClick={nextQuestion}
               className="mt-4 flex items-center gap-2 text-indigo-600 text-xs font-bold hover:gap-3 transition-all"
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Analysis Point" : "View Final Scan Report"} <ArrowRight size={14} />
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Neural Scan Progress</span>
          <span>{Math.round(((currentQuestionIndex + (showFeedback ? 1 : 0)) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
          <motion.div
            className="absolute h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
