
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
  value: number;
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
  classCode: string; // Announcement is now per group
}

export interface Student {
  id: number;
  name: string;
  username: string;
  password: string;
  group: string; 
  status: 'approved' | 'pending'; 
  classCode: string; 
  points: number;       
  namazPoints: number;  
  inventory: string[];  
  badges: string[];     
  completedTasks: number[]; 
  attendance: Record<string, 'present' | 'absent' | 'none'>; 
  reading: Record<string, 'passed' | 'study' | 'failed' | 'none'>; 
  memorization: Record<string, 'passed' | 'repeat' | 'none'>; 
  prayers: Record<string, PrayerStatus>; 
}

export interface Instructor {
  id: number;
  name: string;
  username: string;
  password: string;
  classCodes: string[]; // List of codes/groups this instructor created
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
