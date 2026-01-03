
import React, { useState, useEffect } from 'react';
import { 
  FaBookOpen, FaGamepad, FaShoppingBasket, FaSignOutAlt, 
  FaCoins, FaStar, FaCheck, FaTimes, FaClock, FaUser, FaMicrophone, FaBolt, FaTasks, FaTrophy, FaPlay
} from 'react-icons/fa';
import { Student, MarketItem, WeeklyTask, Announcement, Badge } from '../types';
import { SURAH_LIST } from '../constants';
import QuizGame from './QuizGame';

interface StudentDashboardProps {
  student: Student;
  updateStudent: (id: number, updater: (s: Student) => Student) => void;
  onLogout: () => void;
  marketItems: MarketItem[];
  tasks: WeeklyTask[];
  announcements: Announcement[];
  badges: Badge[];
}

interface PrayerTime {
  id: string;
  label: string;
  time: string; // HH:mm format
  hour: number;
  minute: number;
}

export default function StudentDashboard({ 
  student, updateStudent, onLogout,
  marketItems, tasks, announcements, badges
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'academic' | 'ezber' | 'games' | 'market'>('home');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<'quiz' | null>(null);

  useEffect(() => {
    async function fetchPrayers() {
      try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Istanbul&country=Turkey&method=13');
        const json = await res.json();
        const timings = json.data.timings;
        const mapped: PrayerTime[] = [
          { id: 'sabah', label: 'Sabah', time: timings.Fajr, ...parseTime(timings.Fajr) },
          { id: 'ogle', label: 'Öğle', time: timings.Dhuhr, ...parseTime(timings.Dhuhr) },
          { id: 'ikindi', label: 'İkindi', time: timings.Asr, ...parseTime(timings.Asr) },
          { id: 'aksam', label: 'Akşam', time: timings.Maghrib, ...parseTime(timings.Maghrib) },
          { id: 'yatsi', label: 'Yatsı', time: timings.Isha, ...parseTime(timings.Isha) },
        ];
        setPrayerTimes(mapped);
      } catch (e) {
        console.error("API error", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPrayers();
  }, []);

  const parseTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return { hour: h, minute: m };
  };

  const getStatus = (p: PrayerTime) => {
    const now = new Date();
    const pDate = new Date();
    pDate.setHours(p.hour, p.minute, 0, 0);

    const nextIdx = prayerTimes.findIndex(pt => pt.id === p.id) + 1;
    let nextDate: Date | null = null;
    if (nextIdx < prayerTimes.length) {
      nextDate = new Date();
      nextDate.setHours(prayerTimes[nextIdx].hour, prayerTimes[nextIdx].minute, 0, 0);
    } else {
      // After Yatsi, it's past but stays the last one until midnight
    }

    if (now < pDate) return 'locked'; // Vakti gelmedi
    if (nextDate && now >= pDate && now < nextDate) return 'current'; // Şuan bu vakit içindeyiz
    return 'past'; // Vakti geçti ama bugünün vakti, girilebilir
  };

  const togglePrayer = (pid: string, type: 'tek' | 'cemaat') => {
    const dateKey = new Date().toISOString().split('T')[0];
    const key = `${dateKey}-${pid}`;
    updateStudent(student.id, (s: Student) => {
      const current = s.prayers[key];
      if (current && current.type === type) return s; 
      const newPoints = s.namazPoints + (type === 'cemaat' ? 20 : 10);
      return {
        ...s,
        namazPoints: newPoints,
        prayers: { ...s.prayers, [key]: { type, timestamp: Date.now() } }
      };
    });
  };

  const completeTask = (task: WeeklyTask) => {
    if (student.completedTasks.includes(task.id)) return;
    
    updateStudent(student.id, (s) => ({
      ...s,
      completedTasks: [...s.completedTasks, task.id],
      points: task.currency === 'GP' ? s.points + task.reward : s.points,
      namazPoints: task.currency === 'NP' ? s.namazPoints + task.reward : s.namazPoints
    }));
  };

  const handleGameComplete = (score: number) => {
    if (score > 0) {
      updateStudent(student.id, s => ({
        ...s,
        points: s.points + score
      }));
    }
    setActiveGame(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start z-10 relative">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50 text-2xl">👦</div>
             <div>
               <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-60">Hoş Geldin,</p>
               <h2 className="text-xl font-black">{student.name}</h2>
             </div>
          </div>
          <button onClick={onLogout} className="opacity-80 hover:opacity-100"><FaSignOutAlt /></button>
        </div>
        <div className="flex gap-3 mt-6">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center justify-center gap-2 border border-white/20">
            <FaCoins className="text-yellow-300" />
            <span className="font-black text-lg">{student.points}</span>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center justify-center gap-2 border border-white/20">
            <FaStar className="text-purple-300" />
            <span className="font-black text-lg">{student.namazPoints}</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
           {student.badges.map(badgeId => {
             const badge = badges.find(b => b.id === badgeId);
             return badge ? (
               <div key={badgeId} className={`${badge.color} text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm whitespace-nowrap animate-fade-in`}>
                 <span className="text-sm">{badge.icon}</span> {badge.title}
               </div>
             ) : null;
           })}
        </div>
      </div>

      <div className="p-5">
        {activeTab === 'home' && (
          <div className="animate-fade-in-up space-y-6">
             {/* Namaz Vakitleri */}
             <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-black text-gray-800 flex items-center gap-2 text-sm uppercase tracking-widest"><FaUser className="text-blue-600" /> Günlük Takip</h3>
                   <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1"><FaClock /> {new Date().toLocaleDateString('tr-TR')}</span>
                </div>
                {loading ? (
                   <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                   <div className="space-y-4">
                      {prayerTimes.map(p => {
                         const status = getStatus(p);
                         const isLocked = status === 'locked';
                         const isCurrent = status === 'current';
                         const dateKey = new Date().toISOString().split('T')[0];
                         const saved = student.prayers[`${dateKey}-${p.id}`];

                         return (
                            <div key={p.id} className={`p-4 rounded-3xl border-2 transition-all flex items-center justify-between ${saved ? 'bg-emerald-50 border-emerald-100' : isCurrent ? 'bg-blue-50 border-blue-200 shadow-md scale-[1.02]' : isLocked ? 'bg-gray-50 border-gray-100 opacity-50 grayscale' : 'bg-white border-gray-100'}`}>
                               <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${saved ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {saved ? <FaCheck /> : p.label.charAt(0)}
                                  </div>
                                  <div>
                                     <div className="font-black text-gray-800 text-sm">{p.label} <span className="text-gray-400 font-bold ml-1 text-xs">{p.time}</span></div>
                                     <div className="flex gap-1 mt-1">
                                        {isCurrent && !saved && <span className="text-[8px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase flex items-center gap-1"><FaBolt /> Vakit İçinde</span>}
                                        {!isLocked && !isCurrent && !saved && <span className="text-[8px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase">Geçmiş Vakit</span>}
                                        {saved && <span className="text-[8px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">{saved.type}</span>}
                                     </div>
                                  </div>
                               </div>
                               {!saved && !isLocked && (
                                  <div className="flex gap-2">
                                     <button onClick={() => togglePrayer(p.id, 'tek')} className="bg-gray-100 px-3 py-2 rounded-xl text-[10px] font-black uppercase text-gray-500 hover:bg-gray-200 transition">Tek</button>
                                     <button onClick={() => togglePrayer(p.id, 'cemaat')} className="bg-blue-600 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-100 hover:scale-105 transition">Cem.</button>
                                  </div>
                               )}
                            </div>
                         );
                      })}
                   </div>
                )}
             </div>

             {/* Haftalık Görevler */}
             {tasks.length > 0 && (
               <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                  <h3 className="font-black text-gray-800 flex items-center gap-2 text-sm uppercase tracking-widest mb-6"><FaTasks className="text-purple-600" /> Haftalık Görevler</h3>
                  <div className="space-y-3">
                    {tasks.map(task => {
                      const isCompleted = student.completedTasks.includes(task.id);
                      return (
                        <div key={task.id} className={`p-4 rounded-3xl border-2 transition-all flex items-center justify-between ${isCompleted ? 'bg-purple-50 border-purple-100 opacity-80' : 'bg-white border-gray-100'}`}>
                           <div>
                              <div className={`font-bold text-sm ${isCompleted ? 'text-purple-900 line-through' : 'text-gray-800'}`}>{task.title}</div>
                              <div className="text-[10px] font-black text-gray-400 uppercase mt-1">Ödül: {task.reward} {task.currency}</div>
                           </div>
                           <button 
                             onClick={() => completeTask(task)} 
                             disabled={isCompleted}
                             className={`px-4 py-3 rounded-2xl font-black text-xs transition shadow-lg ${isCompleted ? 'bg-purple-200 text-purple-400 cursor-not-allowed shadow-none' : 'bg-purple-600 text-white hover:scale-105'}`}
                           >
                             {isCompleted ? <FaCheck /> : 'Yap'}
                           </button>
                        </div>
                      )
                    })}
                  </div>
               </div>
             )}
          </div>
        )}
        
        {activeTab === 'academic' && (
           <div className="animate-fade-in-up space-y-4">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                 <h3 className="font-black text-gray-800 text-xs uppercase mb-4 tracking-widest flex items-center gap-2"><FaBookOpen className="text-blue-500" /> Yoklama Karnesi</h3>
                 <div className="flex flex-wrap gap-2">
                    {Object.entries(student.attendance).slice(-10).map(([date, status]) => (
                       <div key={date} className={`px-3 py-2 rounded-2xl text-[10px] font-black border ${status === 'present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{date.split('-').slice(1).reverse().join('.')}</div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'ezber' && (
           <div className="animate-fade-in-up space-y-4">
              {SURAH_LIST.map(s => (
                 <div key={s.id} className="bg-white p-5 rounded-3xl border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><FaMicrophone /></div>
                       <span className="font-bold text-gray-800">{s.title}</span>
                    </div>
                    {student.memorization[s.id] === 'passed' && <FaCheck className="text-emerald-500" />}
                 </div>
              ))}
           </div>
        )}

        {activeTab === 'games' && (
           <div className="animate-fade-in-up">
              {activeGame === 'quiz' ? (
                <QuizGame onClose={() => setActiveGame(null)} onComplete={handleGameComplete} />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                   <div 
                     onClick={() => setActiveGame('quiz')}
                     className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all group"
                   >
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 bg-yellow-100 rounded-3xl flex items-center justify-center text-3xl group-hover:bg-yellow-400 group-hover:text-white transition-colors">
                            <FaTrophy />
                         </div>
                         <div>
                            <h3 className="font-black text-gray-800 text-lg">Dini Bilgi Yarışması</h3>
                            <p className="text-xs text-gray-400 font-bold mt-1">Bilgini ölç, puanları topla!</p>
                         </div>
                      </div>
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-yellow-400 group-hover:text-white transition-all">
                         <FaPlay className="ml-1" />
                      </div>
                   </div>
                   
                   {/* Placeholder for future games */}
                   <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-bold text-sm">
                      <FaGamepad className="mr-2" /> Yakında Yeni Oyunlar...
                   </div>
                </div>
              )}
           </div>
        )}

        {activeTab === 'market' && (
           <div className="animate-fade-in-up grid grid-cols-2 gap-4">
              {marketItems.map(item => (
                 <div key={item.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm text-center flex flex-col items-center">
                    <span className="text-4xl mb-3">{item.icon}</span>
                    <h4 className="font-bold text-gray-800 text-sm mb-2">{item.title}</h4>
                    <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-3 py-1 rounded-full uppercase">{item.price} {item.currency}</span>
                 </div>
              ))}
           </div>
        )}
      </div>

      <div className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 p-3 flex justify-around items-center z-50">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<FaUser />} />
        <NavButton active={activeTab === 'academic'} onClick={() => setActiveTab('academic')} icon={<FaBookOpen />} />
        <NavButton active={activeTab === 'ezber'} onClick={() => setActiveTab('ezber')} icon={<FaMicrophone />} />
        <NavButton active={activeTab === 'games'} onClick={() => setActiveTab('games')} icon={<FaGamepad />} />
        <NavButton active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<FaShoppingBasket />} />
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center p-4 rounded-[2rem] transition-all relative ${active ? 'bg-blue-600 text-white shadow-lg scale-110' : 'text-gray-400'}`}>
      <span className="text-2xl">{icon}</span>
      {active && <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>}
    </button>
  );
}
