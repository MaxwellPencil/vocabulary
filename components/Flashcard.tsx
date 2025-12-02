import React, { useState, useEffect } from 'react';
import { WordCard } from '../types';
import { Volume2, Sparkles, RefreshCcw, Image as ImageIcon, Loader2 } from 'lucide-react';

interface FlashcardProps {
  data: WordCard;
  isFlipped: boolean;
  onFlip: () => void;
  isLoadingImage?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ data, isFlipped, onFlip, isLoadingImage }) => {
  
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(data.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className="relative w-full max-w-md h-[500px] cursor-pointer group perspective-1000 mx-auto"
      onClick={onFlip}
    >
      <div className={`relative w-full h-full duration-700 card-preserve-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Face */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-indigo-50 p-8 flex flex-col items-center justify-center text-center">
          <span className={`absolute top-6 right-6 px-3 py-1 text-xs font-bold uppercase rounded-full
            ${data.difficulty === 'hard' ? 'bg-red-100 text-red-600' : 
              data.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
            {data.difficulty}
          </span>
          
          <h2 className="text-6xl font-bold text-slate-800 mb-6 tracking-wide">{data.word}</h2>
          
          <div className="flex items-center space-x-3 bg-slate-100 px-6 py-3 rounded-full mb-12 hover:bg-slate-200 transition-colors" onClick={playAudio}>
            <span className="text-slate-500 font-mono text-xl">/{data.phonetic}/</span>
            <button className="p-1 rounded-full">
              <Volume2 className="w-6 h-6 text-indigo-600" />
            </button>
          </div>

          <div className="mt-auto flex flex-col items-center gap-2 text-indigo-400">
             <span className="text-sm font-medium">点击查看趣味联想</span>
             <div className="w-12 h-1 bg-indigo-100 rounded-full group-hover:w-20 transition-all duration-300"></div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-3xl shadow-xl border border-indigo-50 flex flex-col overflow-hidden">
           
           {/* Image Section */}
           <div className="h-48 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-100 transition-colors">
              {data.imageUrl ? (
                <img 
                  src={data.imageUrl} 
                  alt={data.word} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  {isLoadingImage ? (
                    <>
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
                      <span className="text-xs font-medium text-indigo-500">正在绘制助记图...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-10 h-10 mb-2 opacity-30" />
                      <span className="text-xs">暂无图片</span>
                    </>
                  )}
                </div>
              )}
           </div>

           <div className="flex-1 p-6 flex flex-col overflow-y-auto no-scrollbar">
              {/* Definition */}
              <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{data.word}</h3>
                    <p className="text-lg text-indigo-600 font-medium">{data.definition}</p>
                  </div>
                  <button onClick={playAudio} className="p-2 bg-indigo-50 rounded-full hover:bg-indigo-100 text-indigo-600">
                     <Volume2 className="w-5 h-5" />
                  </button>
              </div>

              {/* Mnemonic Section - Highlight */}
              <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-100 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">联想记忆</span>
                  </div>
                  <p className="text-slate-800 text-sm leading-relaxed font-medium">
                    {data.mnemonic}
                  </p>
              </div>

              {/* Example */}
              <div className="mt-auto bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-slate-400 text-[10px] uppercase font-bold mb-1 tracking-wider">例句</p>
                  <p className="text-slate-700 text-sm italic mb-1">"{data.exampleSentence}"</p>
                  <p className="text-slate-500 text-xs">{data.exampleTranslation}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;