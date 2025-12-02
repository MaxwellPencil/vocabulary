export enum ExamCategory {
  GAOKAO = '高考英语',
  HENAN_ZHUANSHENGBEN = '河南专升本英语',
  CET4 = '大学英语四级',
  CET6 = '大学英语六级'
}

export interface WordCard {
  word: string;
  phonetic: string;
  definition: string;
  mnemonic: string; // The core association memory technique
  exampleSentence: string;
  exampleTranslation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string; // URL for the generated mnemonic image
}

export interface StudyStats {
  totalLearned: number;
  currentStreak: number;
  masteredCount: number;
}