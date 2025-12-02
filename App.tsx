import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ExamCategory, WordCard, StudyStats } from './types';
import { generateVocabularyBatch, generateMnemonicImage } from './services/geminiService';
import Flashcard from './components/Flashcard';
import CategorySelect from './components/CategorySelect';
import { Brain, CheckCircle, XCircle, Loader2, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [category, setCategory] = useState<ExamCategory>(ExamCategory.HENAN_ZHUANSHENGBEN);
  const [words, setWords] = useState<WordCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Stats
  const [stats, setStats] = useState<StudyStats>({
    totalLearned: 0,
    currentStreak: 0,
    masteredCount: 0
  });

  // Track if we are currently generating an image for a specific word index
  const generatingImageRef = useRef<number | null>(null);

  // Load initial words
  const loadWords = useCallback(async (isInitial = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const excludeList = words.map(w => w.word);
      const newBatch = await generateVocabularyBatch(category, 5, excludeList);
      
      if (newBatch.length === 0) {
        throw new Error("No words generated");
      }

      setWords(prev => isInitial ? newBatch : [...prev, ...newBatch]);
      
      if (isInitial) {
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (err) {
      console.error(err);
      setError("网络连接不稳定，无法加载单词。请检查API Key或重试。");
    } finally {
      setLoading(false);
    }
  }, [category, words, loading]);

  useEffect(() => {
    // Initial load when category changes
    setWords([]);
    loadWords(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Logic to generate image for current card if missing
  useEffect(() => {
    const currentWord = words[currentIndex];
    if (currentWord && !currentWord.imageUrl && generatingImageRef.current !== currentIndex) {
      
      const fetchImage = async () => {
        generatingImageRef.current = currentIndex;
        setImageLoading(true);
        try {
          const imageUrl = await generateMnemonicImage(currentWord.word, currentWord.mnemonic);
          if (imageUrl) {
            setWords(prev => prev.map((w, idx) => 
              idx === currentIndex ? { ...w, imageUrl } : w
            ));
          }
        } finally {
          setImageLoading(false);
          generatingImageRef.current = null;
        }
      };

      fetchImage();
    }
  }, [currentIndex, words]);


  const handleNext = (known: boolean) => {
    // Update stats
    setStats(prev => ({
      totalLearned: prev.totalLearned + 1,
      currentStreak: known ? prev.currentStreak + 1 : 0,
      masteredCount: known ? prev.masteredCount + 1 : prev.masteredCount
    }));

    setIsFlipped(false);
    
    // Check if we need to load more
    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length - 2) {
      // Pre-fetch next batch when close to end
      loadWords(false);
    }
    
    if (nextIndex < words.length) {
      // Small delay for animation feel
      setTimeout(() => setCurrentIndex(nextIndex), 200); 
    } else if (!loading) {
       // Wait for load if we hit the absolute end
       loadWords(false);
    }
  };

  const handleRetry = () => {
    loadWords(words.length === 0);
  };

  const currentWord = words[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-800">LinkMemory</h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex flex-col items-end">
               <span>已学: <span className="text-indigo-600 font-bold text-sm">{stats.totalLearned}</span></span>
            </div>
            <div className="flex flex-col items-end">
               <span>掌握: <span className="text-green-600 font-bold text-sm">{stats.masteredCount}</span></span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto p-6 flex flex-col">
        
        {/* Category Selector */}
        <CategorySelect selected={category} onSelect={setCategory} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center min-h-[500px]">
          
          {error ? (
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100">
               <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
               </div>
               <p className="text-slate-600 mb-4">{error}</p>
               <button 
                  onClick={handleRetry}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition"
               >
                 重试
               </button>
            </div>
          ) : !currentWord ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
              <p>正在生成高频词汇...</p>
              <p className="text-xs mt-2 text-slate-400">AI 正在为您定制联想记忆故事与图片</p>
            </div>
          ) : (
            <>
              {/* Flashcard Container */}
              <div className="mb-8">
                <Flashcard 
                  data={currentWord} 
                  isFlipped={isFlipped} 
                  onFlip={() => setIsFlipped(!isFlipped)}
                  isLoadingImage={imageLoading}
                />
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <button
                  onClick={() => handleNext(false)}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold shadow-sm hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all active:scale-95"
                >
                  <RefreshCcw className="w-5 h-5" />
                  模糊 / 没记住
                </button>
                
                <button
                  onClick={() => handleNext(true)}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  <CheckCircle className="w-5 h-5" />
                  掌握 / 下一个
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Footer info */}
      <footer className="py-4 text-center text-slate-300 text-xs">
         专升本 & 高考英语 AI 助记
      </footer>
    </div>
  );
};

export default App;