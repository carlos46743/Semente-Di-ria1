
export interface BibleStudy {
  verse: string;
  reference: string;
  context: string;
  application: string;
  prayer: string;
  theme: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  category: 'faith' | 'purpose' | 'peace' | 'family' | 'growth';
}

export interface UserProgress {
  streak: number;
  totalPoints: number;
  completedDays: string[]; // ISO dates
  favorites: string[]; // Verse references
  notes: JournalEntry[];
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
}

export interface PrayerRequest {
  id: string;
  user: string;
  request: string;
  likes: number;
  timestamp: number;
}
