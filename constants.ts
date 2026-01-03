
import { Badge, MarketItem, Student, Surah, WeeklyTask, Announcement, Instructor } from './types';

export const SURAH_LIST: Surah[] = [
  { id: 'duha', title: 'Duha Suresi', audioUrl: 'https://server8.mp3quran.net/afs/093.mp3' },
  { id: 'insirah', title: 'İnşirah Suresi', audioUrl: 'https://server8.mp3quran.net/afs/094.mp3' },
  { id: 'tin', title: 'Tin Suresi', audioUrl: 'https://server8.mp3quran.net/afs/095.mp3' },
  { id: 'alak', title: 'Alak Suresi', audioUrl: 'https://server8.mp3quran.net/afs/096.mp3' },
  { id: 'kadir', title: 'Kadir Suresi', audioUrl: 'https://server8.mp3quran.net/afs/097.mp3' },
  { id: 'fil', title: 'Fil Suresi', audioUrl: 'https://server8.mp3quran.net/afs/105.mp3' },
  { id: 'kureys', title: 'Kureyş Suresi', audioUrl: 'https://server8.mp3quran.net/afs/106.mp3' },
  { id: 'maun', title: 'Maun Suresi', audioUrl: 'https://server8.mp3quran.net/afs/107.mp3' },
  { id: 'kevser', title: 'Kevser Suresi', audioUrl: 'https://server8.mp3quran.net/afs/108.mp3' },
  { id: 'kafirun', title: 'Kafirun Suresi', audioUrl: 'https://server8.mp3quran.net/afs/109.mp3' },
  { id: 'nasr', title: 'Nasr Suresi', audioUrl: 'https://server8.mp3quran.net/afs/110.mp3' },
  { id: 'tebbet', title: 'Tebbet Suresi', audioUrl: 'https://server8.mp3quran.net/afs/111.mp3' },
  { id: 'ihlas', title: 'İhlas Suresi', audioUrl: 'https://server8.mp3quran.net/afs/112.mp3' },
  { id: 'felak', title: 'Felak Suresi', audioUrl: 'https://server8.mp3quran.net/afs/113.mp3' },
  { id: 'nas', title: 'Nas Suresi', audioUrl: 'https://server8.mp3quran.net/afs/114.mp3' },
];

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  { id: 'chocolate', title: 'Çikolata', price: 300, currency: 'GP', icon: '🍫', description: 'Lezzetli bir ödül.' },
  { id: 'game_time', title: '15 Dk Oyun', price: 500, currency: 'GP', icon: '🎮', description: 'Ekstra oyun süresi.' },
  { id: 'football', title: 'Halı Saha', price: 2000, currency: 'NP', icon: '⚽', description: 'Hafta sonu maçı bileti.' },
  { id: 'toy', title: 'Oyuncak Araba', price: 1500, currency: 'GP', icon: '🏎️', description: 'Küçük oyuncak araba.' },
];

export const AVAILABLE_BADGES: Badge[] = [
  { id: 'namaz_kurtu', title: 'Namaz Kurdu', icon: '🐺', description: '5 Vakit namazını eksiksiz kılanlar için.', color: 'bg-emerald-500', value: 100 },
  { id: 'ezber_ustasi', title: 'Ezber Ustası', icon: '🧠', description: 'Haftanın en çok ezber yapanı.', color: 'bg-indigo-500', value: 150 },
  { id: 'erkenci_kus', title: 'Erkenci Kuş', icon: '🐦', description: 'Sabah namazına camiye gelenler.', color: 'bg-amber-500', value: 50 },
  { id: 'cemaat_gulu', title: 'Cemaat Gülü', icon: '🌹', description: 'Sürekli cemaatle kılanlar.', color: 'bg-rose-500', value: 75 },
];

export const INITIAL_TASKS: WeeklyTask[] = [
  { id: 1, title: 'Cuma Günü Camiye Git ve Namaz Kıl', reward: 150, currency: 'NP', target: 1 },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: 'Hoşgeldiniz', message: 'Yeni dönem hayırlı olsun!', date: '01.01.2024', classCode: '1453' }
];

export const INITIAL_INSTRUCTORS: Instructor[] = [
  { id: 1, name: 'Hoca Ahmet', username: 'hoca', password: '123', classCodes: ['1453'] }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 101,
    name: 'Örnek Öğrenci',
    username: 'ogrenci',
    password: '123',
    group: 'Kaşif Grubu',
    status: 'approved',
    classCode: '1453',
    points: 1000,
    namazPoints: 50,
    inventory: [],
    badges: [],
    completedTasks: [],
    attendance: {},
    reading: {},
    memorization: {},
    prayers: {}
  }
];

export const PRAYER_TIMES = [
  { id: 'sabah', label: 'Sabah', icon: '🌅', hour: 5 },
  { id: 'ogle', label: 'Öğle', icon: '☀️', hour: 13 },
  { id: 'ikindi', label: 'İkindi', icon: '🌤️', hour: 16 },
  { id: 'aksam', label: 'Akşam', icon: '🌆', hour: 19 },
  { id: 'yatsi', label: 'Yatsı', icon: '🌙', hour: 21 },
];
