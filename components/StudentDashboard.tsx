import React, { useState } from 'react';
import { 
  FaMosque, FaBookOpen, FaGamepad, FaShoppingBasket, FaSignOutAlt, 
  FaCoins, FaStar, FaBullhorn, FaTasks, FaCheck, FaTrophy, 
  FaPlay, FaPause, FaExclamation, FaUserTie, FaUserCheck, FaMicrophone, FaGraduationCap
} from 'react-icons/fa';
import { Student, MarketItem, WeeklyTask, Announcement, Badge } from '../types';
import { PRAYER_TIMES, SURAH_LIST } from '../constants';
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

export default function StudentDashboard({ 
  student, updateStudent, onLogout,
  marketItems, tasks, announcements, badges
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'academic' | 'ezber' | 'games' | 'market'>('home');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-b-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="flex justify-between items-start z-10 relative">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50 text-2xl">
               👦
             </div>
             <div>
               <p className="text-blue-100 text-xs font-medium">Selamün Aleyküm,</p>
               <h2 className="text-xl font-bold leading-tight">{student.name}</h2>
             </div>
          </div>
          <button onClick={onLogout} className="opacity-80 hover:opacity-100"><FaSignOutAlt /></button>
        </div>

        {/* Stats Pills */}
        <div className="flex gap-3 mt-6">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-2 flex items-center justify-center gap-2 border border-white/20">
            <FaCoins className="text-yellow-300" />
            <span className="font-bold text-lg">{student.points}</span>
            <span className="text-xs opacity-75">GP</span>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-2 flex items-center justify-center gap-2 border border-white/20">
            <FaStar className="text-purple-300" />
            <span className="font-bold text-lg">{student.namazPoints}</span>
            <span className="text-xs opacity-75">NP</span>
          </div>
        </div>

        {/* Badges Display in Header */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
           {student.badges.map(badgeId => {
             const badge = badges.find(b => b.id === badgeId);
             if(!badge) return null;
             return (
               <div key={badgeId} className={`${badge.color} text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm whitespace-nowrap`}>
                 <span className="text-sm">{badge.icon}</span> {badge.title}
               </div>
             )
           })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5">
        {activeTab === 'home' && <StudentHome student={student} updateStudent={updateStudent} tasks={tasks} announcements={announcements} />}
        {activeTab === 'academic' && <StudentAcademic student={student} />}
        {activeTab === 'ezber' && <StudentEzber student={student} updateStudent={updateStudent} />}
        {activeTab === 'market' && <StudentMarket student={student} updateStudent={updateStudent} marketItems={marketItems} />}
        {activeTab === 'games' && <StudentGames student={student} updateStudent={updateStudent} />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] px-2 py-2 flex justify-around items-center z-50">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<FaMosque />} label="Anasayfa" />
        <NavButton active={activeTab === 'academic'} onClick={() => setActiveTab('academic')} icon={<FaGraduationCap />} label="Akademik" />
        <NavButton active={activeTab === 'ezber'} onClick={() => setActiveTab('ezber')} icon={<FaBookOpen />} label="Ezber" />
        <NavButton active={activeTab === 'games'} onClick={() => setActiveTab('games')} icon={<FaGamepad />} label="Oyunlar" />
        <NavButton active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<FaShoppingBasket />} label="Market" />
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition duration-300 min-w-[60px] ${active ? 'text-blue-600 -translate-y-2' : 'text-gray-400 hover:text-gray-600'}`}
    >
      <div className={`text-xl ${active ? 'bg-blue-100 p-2 rounded-full' : ''}`}>{icon}</div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

// --- SUB COMPONENTS ---

function StudentAcademic({ student }: { student: Student }) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-blue-800 text-sm font-bold flex items-center gap-2">
         <FaGraduationCap className="text-lg" />
         Akademik durumunu buradan takip edebilirsin.
      </div>

      {/* Attendance Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
         <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
            <FaUserCheck className="text-teal-500" /> Yoklama Geçmişi
         </h4>
         <div className="flex flex-wrap gap-2">
            {Object.entries(student.attendance)
               .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
               .slice(0, 10)
               .map(([date, status]) => (
                  <div key={date} className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex flex-col items-center ${status === 'present' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                     <span>{new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                     <span>{status === 'present' ? 'VAR' : 'YOK'}</span>
                  </div>
               ))
            }
            {Object.keys(student.attendance).length === 0 && <div className="text-gray-400 text-xs italic">Henüz yoklama kaydı yok.</div>}
         </div>
      </div>

      {/* Reading Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
         <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
            <FaBookOpen className="text-amber-500" /> Yüzüne Okuma Takibi
         </h4>
         <div className="space-y-2">
            {Object.entries(student.reading)
               .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
               .slice(0, 5)
               .map(([date, status]) => (
                  <div key={date} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                     <span className="text-xs font-bold text-gray-600">{new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                     <span className={`text-xs font-black uppercase px-2 py-1 rounded ${
                        status === 'passed' ? 'bg-green-200 text-green-800' : 
                        status === 'study' ? 'bg-amber-200 text-amber-800' : 
                        'bg-red-200 text-red-800'
                     }`}>
                        {status === 'passed' ? 'GEÇTİ' : status === 'study' ? 'ÇALIŞIYOR' : 'KALDI'}
                     </span>
                  </div>
               ))
            }
            {Object.keys(student.reading).length === 0 && <div className="text-gray-400 text-xs italic">Henüz okuma kaydı yok.</div>}
         </div>
      </div>

      {/* Memorization Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
         <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
            <FaMicrophone className="text-purple-500" /> Tamamlanan Ezberler
         </h4>
         <div className="flex flex-wrap gap-2">
            {Object.entries(student.memorization)
               .filter(([_, status]) => status === 'passed')
               .map(([surahId]) => (
                  <span key={surahId} className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                     <FaCheck className="text-[10px]" /> {SURAH_LIST.find(s => s.id === surahId)?.title || surahId}
                  </span>
               ))
            }
            {Object.values(student.memorization).filter(s => s === 'passed').length === 0 && <div className="text-gray-400 text-xs italic">Henüz tamamlanan ezber yok.</div>}
         </div>
      </div>
    </div>
  );
}

function StudentHome({ student, updateStudent, tasks, announcements }: any) {
  const dateKey = new Date().toISOString().split('T')[0];
  const prayers = student.prayers || {};

  const togglePrayer = (pid: string, type: 'tek' | 'cemaat') => {
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

  const completeTask = (taskId: number, reward: number, currency: 'GP' | 'NP') => {
    if(window.confirm("Bu görevi tamamladın mı?")) {
       updateStudent(student.id, (s: Student) => ({
         ...s,
         points: currency === 'GP' ? s.points + reward : s.points,
         namazPoints: currency === 'NP' ? s.namazPoints + reward : s.namazPoints,
         completedTasks: [...s.completedTasks, taskId]
       }));
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {announcements && announcements.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-rose-500">
           <h3 className="text-rose-600 font-bold text-sm flex items-center gap-2 mb-2"><FaBullhorn /> Duyurular</h3>
           <div className="space-y-2">
             {announcements.map((a: Announcement) => (
               <div key={a.id} className="pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                 <div className="font-bold text-gray-800 text-sm">{a.title}</div>
                 <p className="text-xs text-gray-500">{a.message}</p>
               </div>
             ))}
           </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-bold text-gray-700 flex items-center gap-2"><FaTasks className="text-indigo-500" /> Haftalık Görevler</h3>
        {tasks.map((task: WeeklyTask) => {
          const isCompleted = student.completedTasks?.includes(task.id);
          return (
            <div key={task.id} className={`p-4 rounded-2xl border transition flex justify-between items-center ${isCompleted ? 'bg-green-50 border-green-200 opacity-75' : 'bg-white border-gray-100'}`}>
              <div>
                <div className="font-bold text-sm text-gray-800">{task.title}</div>
                <div className="text-xs text-gray-500 mt-1">Ödül: <span className="font-bold text-amber-500">{task.reward} {task.currency}</span></div>
              </div>
              {isCompleted ? (
                <div className="text-green-600 text-xl"><FaCheck /></div>
              ) : (
                <button onClick={() => completeTask(task.id, task.reward, task.currency)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100">Tamamla</button>
              )}
            </div>
          )
        })}
        {tasks.length === 0 && <div className="text-center text-gray-400 text-sm py-4">Bu hafta görev yok.</div>}
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-gray-700 flex items-center gap-2"><FaMosque className="text-blue-600" /> Vakit Takip</h3>
        {PRAYER_TIMES.map(p => {
          const key = `${dateKey}-${p.id}`;
          const status = prayers[key];
          
          return (
            <div key={p.id} className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${status ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.icon}</span>
                <span className="font-bold text-gray-700">{p.label}</span>
              </div>
              
              {status ? (
                <div className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${status.type === 'cemaat' ? 'bg-indigo-100 text-indigo-700' : 'bg-sky-100 text-sky-700'}`}>
                  <FaCheck /> {status.type === 'cemaat' ? 'Cemaat' : 'Tek'}
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => togglePrayer(p.id, 'tek')} className="bg-gray-100 hover:bg-sky-100 text-gray-600 hover:text-sky-700 px-3 py-2 rounded-lg text-xs font-bold transition">Tek</button>
                  <button onClick={() => togglePrayer(p.id, 'cemaat')} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-2 rounded-lg text-xs font-bold transition">Cemaat</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
         <div className="absolute right-[-10px] bottom-[-10px] text-8xl opacity-10 rotate-12"><FaTrophy /></div>
         <h4 className="font-bold text-lg mb-1">Günün Hadisi</h4>
         <p className="text-indigo-100 text-sm italic">"Namaz dinin direğidir."</p>
         <div className="mt-4 bg-white/20 rounded-lg p-2 text-xs flex justify-between items-center">
            <span>Bugünkü Puanın:</span>
            <span className="font-bold text-lg">+{(Object.keys(prayers).filter(k => k.startsWith(dateKey)).length * 10)}</span>
         </div>
      </div>
    </div>
  );
}

function StudentEzber({ student, updateStudent }: any) {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const togglePlay = (id: string, url: string) => {
    if (playing === id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setPlaying(id);
      audioRef.current.onended = () => setPlaying(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-blue-800 text-sm">
        <FaBookOpen className="inline mr-2" /> Sureleri dinle ve ezberlediğinde öğretmenine bildir.
      </div>
      
      {SURAH_LIST.map(surah => {
        const status = student.memorization[surah.id] || 'none';
        return (
          <div key={surah.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-700">{surah.title}</h3>
              {status === 'passed' && <span className="text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded flex items-center gap-1"><FaCheck/> Ezberlendi</span>}
              {status === 'repeat' && <span className="text-amber-500 font-bold text-xs bg-amber-50 px-2 py-1 rounded flex items-center gap-1"><FaExclamation/> Tekrar</span>}
              {status === 'none' && <span className="text-gray-400 text-xs">Başlanmadı</span>}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => togglePlay(surah.id, surah.audioUrl)}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition ${playing === surah.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {playing === surah.id ? <><FaPause /> Durdur</> : <><FaPlay /> Dinle</>}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StudentMarket({ student, updateStudent, marketItems }: any) {
  const buyItem = (item: MarketItem) => {
    const userBalance = item.currency === 'GP' ? student.points : student.namazPoints;
    if (userBalance < item.price) {
      alert("Yetersiz Bakiye!");
      return;
    }

    if (window.confirm(`${item.title} almak istiyor musun?`)) {
      updateStudent(student.id, (s: Student) => ({
        ...s,
        points: item.currency === 'GP' ? s.points - item.price : s.points,
        namazPoints: item.currency === 'NP' ? s.namazPoints - item.price : s.namazPoints,
        inventory: [...s.inventory, item.id]
      }));
      alert("Satın alındı!");
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="grid grid-cols-2 gap-4">
        {marketItems.map((item: MarketItem) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-2 right-2 text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">
               {item.currency}
            </div>
            <div className="text-4xl mb-2 group-hover:scale-110 transition duration-300">{item.icon}</div>
            <h3 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-gray-400 mb-3 h-8 line-clamp-2">{item.description}</p>
            
            <button 
              onClick={() => buyItem(item)}
              className={`w-full py-2 rounded-xl text-xs font-bold text-white shadow-md transition transform active:scale-95 ${item.currency === 'GP' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {item.price} {item.currency} Al
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentGames({ student, updateStudent }: any) {
  const [activeGame, setActiveGame] = useState<'quiz' | null>(null);

  if (activeGame === 'quiz') return <QuizGame onClose={() => setActiveGame(null)} onComplete={(score) => {
    updateStudent(student.id, (s: Student) => ({ ...s, points: s.points + score }));
    setActiveGame(null);
  }} />;

  return (
    <div className="space-y-4 animate-fade-in-up">
       <div 
        onClick={() => setActiveGame('quiz')}
        className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:scale-[1.02]"
       >
         <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-20"><FaGamepad /></div>
         <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Bilgi Yarışması</h3>
            <p className="text-indigo-100 mb-4 text-sm">Dini bilgilerini test et ve GP kazan!</p>
            <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold text-sm shadow-sm">Oyna</button>
         </div>
       </div>

       <div className="bg-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden opacity-80">
         <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10"><FaUserTie /></div>
         <h3 className="text-xl font-bold mb-1">Uzay Macerası</h3>
         <p className="text-gray-300 text-xs mb-3">Yakında eklenecek...</p>
         <button disabled className="bg-gray-600 text-gray-300 px-4 py-2 rounded-full font-bold text-xs">Bakımda</button>
       </div>
    </div>
  );
}