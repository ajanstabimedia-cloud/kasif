export type UserRole = 'instructor' | 'student' | null;

export interface PrayerStatus {
  type: 'tek' | 'cemaat' | 'none';
  timestamp: number;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  value: number; // Added point value
}

export interface WeeklyTask {
  id: number;
  title: string;
  reward: number;
  currency: 'GP' | 'NP';
  target: number; 
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  date: string;
}

export interface Student {
  id: number;
  name: string;
  group: string; // e.g., 'A Grubu'
  status: 'approved' | 'pending'; 
  classCode: string; 
  points: number;       
  namazPoints: number;  
  inventory: string[];  
  badges: string[];     
  completedTasks: number[]; 
  
  // Kaşif Data
  attendance: Record<string, 'present' | 'absent' | 'none'>; 
  reading: Record<string, 'passed' | 'study' | 'failed' | 'none'>; 
  memorization: Record<string, 'passed' | 'repeat' | 'none'>; 
  
  // Namaz Data
  prayers: Record<string, PrayerStatus>; 
}

export interface MarketItem {
  id: string;
  title: string;
  price: number;
  currency: 'GP' | 'NP';
  icon: string;
  description: string;
}

export interface Surah {
  id: string;
  title: string;
  audioUrl: string;
}