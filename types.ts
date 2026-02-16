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

export interface PrayerRequest {
  id: string;
  user: string;
  request: string;
  likes: number;
  timestamp: number;
  isAmen?: boolean;
}