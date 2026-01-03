import React, { useState } from 'react';
import { 
  FaUserCheck, FaBookOpen, FaMicrophone, FaMosque, FaChartPie, 
  FaTasks, FaBullhorn, FaUserPlus, FaSignOutAlt, FaChevronLeft, 
  FaCalendarAlt, FaChevronRight, FaArrowLeft, FaTimes, FaCheck, 
  FaExclamation, FaUserTie, FaMinusCircle, FaPlusCircle, FaKey, 
  FaShoppingBasket, FaTrash, FaGraduationCap, FaMedal, FaHistory, FaList, FaStar
} from 'react-icons/fa';
import { Student, MarketItem, WeeklyTask, Announcement, Badge } from '../types';
import { INSTRUCTOR_CODE, SURAH_LIST, PRAYER_TIMES } from '../constants';

interface InstructorDashboardProps {
  students: Student[];
  updateStudent: (id: number, updater: (s: Student) => Student) => void;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  onLogout: () => void;
  marketItems: MarketItem[];
  setMarketItems: (items: MarketItem[]) => void;
  tasks: WeeklyTask[];
  setTasks: (tasks: WeeklyTask[]) => void;
  announcements: Announcement[];
  setAnnouncements: (announcements: Announcement[]) => void;
  badges: Badge[];
  setBadges: (badges: Badge[]) => void;
}

export default function InstructorDashboard({ 
  students, updateStudent, setStudents, onLogout,
  marketItems, setMarketItems, tasks, setTasks, announcements, setAnnouncements,
  badges, setBadges
}: InstructorDashboardProps) {
  // Main Navigation State
  const [activeTab, setActiveTab] = useState<'academic' | 'spiritual' | 'management'>('academic');
  
  // Sub-Navigation States
  const [academicView, setAcademicView] = useState<'attendance' | 'reading' | 'memorization'>('attendance');
  const [managementView, setManagementView] = useState<'menu' | 'reports' | 'market' | 'announcements' | 'approval'>('menu');

  // Data States
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Modal States
  const [academicDetailStudent, setAcademicDetailStudent] = useState<Student | null>(null);
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);
  const [memorizationCheckStudentId, setMemorizationCheckStudentId] = useState<number | null>(null); // For inline check

  // Computed Lists
  const pendingStudents = students.filter(s => s.status === 'pending');
  const approvedStudents = students.filter(s => s.status === 'approved');

  // Form States
  const [newItem, setNewItem] = useState({ title: '', price: 100, currency: 'GP', icon: '🎁', description: '' });
  const [newTask, setNewTask] = useState({ title: '', reward: 50, currency: 'GP', target: 1 });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });
  const [newBadge, setNewBadge] = useState({ title: '', value: 50, icon: '🏅' });

  // Helpers
  const dateKey = selectedDate.toISOString().split('T')[0];
  
  // Static Date Logic (Last 7 days for Report Card)
  const getLast7Days = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i)); 
      return d;
    });
  };

  // --- HANDLERS ---

  const handleStatusChange = (studentId: number, type: 'attendance' | 'reading', value: string) => {
    updateStudent(studentId, (s: Student) => ({
      ...s,
      [type]: { ...s[type], [dateKey]: value }
    }));
  };

  const handleMemorizationUpdate = (studentId: number, surahId: string, status: 'passed' | 'repeat' | 'none') => {
     updateStudent(studentId, (s: Student) => {
       const isPassing = status === 'passed';
       const wasPassing = s.memorization[surahId] === 'passed';
       let pointsAdd = 0;
       if (isPassing && !wasPassing) pointsAdd = 50; 
       return {
         ...s,
         points: s.points + pointsAdd,
         memorization: { ...s.memorization, [surahId]: status }
       };
     });
  };

  const createBadge = () => {
    if (!newBadge.title) return;
    const badge: Badge = {
      id: Date.now().toString(),
      title: newBadge.title,
      value: newBadge.value,
      icon: newBadge.icon,
      description: 'Eğitmen Rozeti',
      color: 'bg-indigo-500'
    };
    setBadges([...badges, badge]);
    setNewBadge({ title: '', value: 50, icon: '🏅' });
  };

  const giveBadge = (studentId: number, badge: Badge) => {
    updateStudent(studentId, (s: Student) => {
       if (s.badges.includes(badge.id)) return s; 
       return {
         ...s,
         points: s.points + badge.value,
         badges: [...s.badges, badge.id]
       };
    });
    alert(`${badge.title} verildi! Öğrenci ${badge.value} GP kazandı.`);
  };

  const approveStudent = (id: number) => {
    updateStudent(id, (s: Student) => ({ ...s, status: 'approved' }));
  };

  const rejectStudent = (id: number) => {
    setStudents((prev: Student[]) => prev.filter(s => s.id !== id));
  };

  const addAnnouncement = () => {
    if(!newAnnouncement.title || !newAnnouncement.message) return;
    const ann: Announcement = { 
      id: Date.now(), 
      title: newAnnouncement.title, 
      message: newAnnouncement.message,
      date: new Date().toLocaleDateString('tr-TR')
    };
    setAnnouncements([ann, ...announcements]);
    setNewAnnouncement({ title: '', message: '' });
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const addMarketItem = () => {
    if(!newItem.title) return;
    const item: MarketItem = { ...newItem, id: Date.now().toString(), currency: newItem.currency as 'GP'|'NP' };
    setMarketItems([...marketItems, item]);
    setNewItem({ title: '', price: 100, currency: 'GP', icon: '🎁', description: '' });
  };

  const deleteMarketItem = (id: string) => {
    setMarketItems(marketItems.filter(i => i.id !== id));
  };

  const addTask = () => {
    if(!newTask.title) return;
    const task: WeeklyTask = { ...newTask, id: Date.now(), currency: newTask.currency as 'GP'|'NP' };
    setTasks([...tasks, task]);
    setNewTask({ title: '', reward: 50, currency: 'GP', target: 1 });
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const switchAcademicView = (view: typeof academicView) => {
    setAcademicView(view);
    setMemorizationCheckStudentId(null);
  }

  // Soft/Clean Design Configs
  const managementMenuItems = [
    { id: 'reports', label: 'Karne & Rozet', icon: <FaChartPie />, color: 'bg-purple-100 text-purple-700' },
    { id: 'market', label: 'Mağaza & Görev', icon: <FaShoppingBasket />, color: 'bg-amber-100 text-amber-700' },
    { id: 'announcements', label: 'Duyurular', icon: <FaBullhorn />, color: 'bg-rose-100 text-rose-700' },
    { 
       id: 'approval', 
       label: 'Sınıf & Onay', 
       icon: <FaUserPlus />, 
       color: 'bg-slate-200 text-slate-700',
       badge: pendingStudents.length > 0 ? pendingStudents.length : undefined 
    },
  ];

  return (
    <div className="pb-32 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Eğitmen Paneli</p>
            <h2 className="text-2xl font-bold">Kaşif Yönetim</h2>
          </div>
          <button onClick={onLogout} className="bg-white/10 p-2 rounded-xl backdrop-blur-sm hover:bg-white/20 transition border border-white/20">
            <FaSignOutAlt />
          </button>
        </div>
        
        {/* Date Display - Static (No navigation) */}
        {activeTab === 'academic' && !memorizationCheckStudentId && (
          <div className="flex justify-center animate-fade-in">
             <div className="bg-white/10 backdrop-blur-md text-white px-6 py-2 rounded-xl border border-white/20 font-bold font-mono text-lg flex items-center gap-2 shadow-sm">
                <FaCalendarAlt className="text-blue-300"/>
                {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
             </div>
          </div>
        )}
      </header>

      <main className="p-5 max-w-4xl mx-auto">
        
        {/* --- AKADEMİK TAB --- */}
        {activeTab === 'academic' && (
          <div className="animate-fade-in">
             {/* Academic Sub-Nav */}
             <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex mb-6">
                {[
                  { id: 'attendance', label: 'Yoklama', icon: <FaUserCheck /> },
                  { id: 'reading', label: 'Yüzüne', icon: <FaBookOpen /> },
                  { id: 'memorization', label: 'Ezber', icon: <FaMicrophone /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => switchAcademicView(tab.id as any)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${academicView === tab.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
             </div>

             {/* Content: Attendance & Reading */}
             {(academicView === 'attendance' || academicView === 'reading') && (
                <div className="space-y-3 animate-fade-in-up">
                {approvedStudents.map(s => {
                  const status = academicView === 'attendance' 
                      ? (s.attendance[dateKey] || 'none')
                      : (s.reading[dateKey] || 'none');
                  
                  return (
                    <div key={s.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer group"
                        onClick={() => setAcademicDetailStudent(s)} // Open History Modal
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-lg relative group-hover:bg-blue-50 group-hover:text-blue-500 transition">
                          {s.name.charAt(0)}
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-50">
                            <FaHistory className="text-[10px] text-blue-500" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{s.name}</div>
                          <div className="text-xs text-blue-500 font-medium opacity-80 group-hover:opacity-100 transition">Geçmişi Gör</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {academicView === 'attendance' ? (
                          <>
                            <button onClick={() => handleStatusChange(s.id, 'attendance', 'absent')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-sm ${status === 'absent' ? 'bg-red-500 text-white shadow-red-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}><FaTimes /></button>
                            <button onClick={() => handleStatusChange(s.id, 'attendance', 'present')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-sm ${status === 'present' ? 'bg-teal-500 text-white shadow-teal-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}><FaCheck /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleStatusChange(s.id, 'reading', 'failed')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${status === 'failed' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}><FaTimes /></button>
                            <button onClick={() => handleStatusChange(s.id, 'reading', 'study')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${status === 'study' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}><FaExclamation /></button>
                            <button onClick={() => handleStatusChange(s.id, 'reading', 'passed')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${status === 'passed' ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}><FaCheck /></button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                </div>
             )}

             {/* Content: Memorization */}
             {academicView === 'memorization' && (
                <div className="animate-fade-in-up">
                  {memorizationCheckStudentId === null ? (
                    <div className="grid gap-3">
                      {approvedStudents.map(s => {
                        const passedCount = Object.values(s.memorization).filter(v => v === 'passed').length;
                        const totalSurah = SURAH_LIST.length;
                        const progress = (passedCount / totalSurah) * 100;
                        return (
                          <div key={s.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-indigo-300 transition group">
                            {/* Click Name Area to See History */}
                            <div 
                              className="flex items-center gap-4 flex-1" 
                              onClick={() => setAcademicDetailStudent(s)}
                            >
                              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg relative group-hover:bg-indigo-600 group-hover:text-white transition">
                                {s.name.charAt(0)}
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-50">
                                  <FaHistory className="text-[10px] text-blue-500" />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-gray-800">{s.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full" style={{width: `${progress}%`}}></div>
                                  </div>
                                  <span className="mt-1 block">{passedCount} / {totalSurah} Sure</span>
                                </div>
                              </div>
                            </div>
                            {/* Click Button to Enter Data */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); setMemorizationCheckStudentId(s.id); }}
                              className="bg-indigo-50 px-3 py-2 rounded-lg text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition"
                            >
                              Giriş Yap
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <button onClick={() => setMemorizationCheckStudentId(null)} className="mb-4 text-gray-500 flex items-center gap-2 font-medium hover:text-blue-600"><FaArrowLeft /> Listeye Dön</button>
                      
                      <div className="bg-indigo-600 text-white p-4 rounded-2xl mb-4 flex justify-between items-center shadow-lg shadow-indigo-200">
                        <h3 className="font-bold text-lg">{students.find(s => s.id === memorizationCheckStudentId)?.name}</h3>
                        <div className="bg-white/20 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">Ezber Kontrol</div>
                      </div>
                      <div className="space-y-3">
                        {SURAH_LIST.map(surah => {
                          const student = students.find(s => s.id === memorizationCheckStudentId)!;
                          const status = student.memorization[surah.id] || 'none';
                          return (
                            <div key={surah.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-gray-800">{surah.title}</h4>
                                {status === 'passed' && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><FaCheck/> Tamam</span>}
                                {status === 'repeat' && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><FaExclamation/> Tekrar</span>}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleMemorizationUpdate(student.id, surah.id, 'repeat')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${status === 'repeat' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>Tekrar</button>
                                <button onClick={() => handleMemorizationUpdate(student.id, surah.id, 'passed')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${status === 'passed' ? 'bg-green-500 text-white shadow-md shadow-green-200' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'}`}>Verdi</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
             )}
          </div>
        )}

        {/* --- MANEVİ TAB (REPORT CARD LIST) --- */}
        {activeTab === 'spiritual' && (
          <div className="animate-fade-in-up space-y-4">
             <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-blue-800 text-sm flex items-center gap-3">
               <FaMosque className="text-xl" /> 
               <span>Karne, ezber ve yüzüne detayları için öğrenciye tıkla.</span>
             </div>
             
             {/* Simple Student List */}
             <div className="space-y-3">
               {approvedStudents.map(s => (
                 <div 
                  key={s.id} 
                  onClick={() => setReportCardStudent(s)}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer flex items-center justify-between transition"
                 >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{s.name}</h3>
                        <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-block">{s.group}</p>
                      </div>
                    </div>
                    <div className="text-gray-300">
                      <FaChevronRight />
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* --- YÖNETİM TAB (Soft Grid) --- */}
        {activeTab === 'management' && (
          <div className="animate-fade-in">
            {/* Management Menu Grid */}
            {managementView === 'menu' && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                {managementMenuItems.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setManagementView(item.id as any)}
                    className={`
                       bg-white p-5 rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.02]
                       transition-all cursor-pointer flex flex-col items-center justify-center text-center relative h-40 border border-gray-100
                    `}
                  >
                    {item.badge && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-pulse shadow-md">
                        {item.badge}
                      </div>
                    )}
                    <div className={`text-3xl p-4 rounded-2xl mb-3 ${item.color} bg-opacity-20`}>{item.icon}</div>
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{item.label}</h3>
                  </div>
                ))}
              </div>
            )}

            {/* Sub Views Wrapper */}
            {managementView !== 'menu' && (
               <div className="animate-fade-in">
                 <button onClick={() => setManagementView('menu')} className="mb-6 text-gray-500 font-bold flex items-center gap-2 hover:text-blue-600 transition-colors"><FaArrowLeft /> Menüye Dön</button>
               </div>
            )}

            {/* Reports & Badges */}
            {managementView === 'reports' && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Create Badge Section */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-600"><FaMedal /> Yeni Rozet Oluştur</h3>
                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <input type="text" placeholder="Rozet Adı" value={newBadge.title} onChange={e => setNewBadge({...newBadge, title: e.target.value})} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                    <input type="number" placeholder="Puan" value={newBadge.value} onChange={e => setNewBadge({...newBadge, value: parseInt(e.target.value)})} className="w-full md:w-24 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                    <input type="text" placeholder="İkon" value={newBadge.icon} onChange={e => setNewBadge({...newBadge, icon: e.target.value})} className="w-full md:w-20 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                  <button onClick={createBadge} className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold hover:bg-purple-600 shadow-lg shadow-purple-200 transition-all">Rozet Oluştur</button>
                </div>

                {/* Student List & Awarding */}
                <div className="grid gap-4">
                  {approvedStudents.map(s => (
                    <div key={s.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">{s.name}</h3>
                            <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-lg">{s.group}</span>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-xs font-bold border border-amber-100">
                              {s.points} GP
                            </div>
                            <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-xs font-bold border border-purple-100">
                              {s.namazPoints} NP
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Rozet Ver:</p>
                          <div className="flex flex-wrap gap-2">
                            {badges.map(badge => {
                              const hasBadge = s.badges.includes(badge.id);
                              return (
                                <button 
                                  key={badge.id} 
                                  onClick={() => giveBadge(s.id, badge)}
                                  disabled={hasBadge}
                                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all border
                                    ${hasBadge ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-60' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600 hover:shadow-sm'}`}
                                >
                                  <span>{badge.icon}</span> {badge.title}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button onClick={() => updateStudent(s.id, prev => ({...prev, points: prev.points + 10}))} className="flex-1 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition flex justify-center items-center gap-1"><FaPlusCircle /> 10 GP</button>
                          <button onClick={() => updateStudent(s.id, prev => ({...prev, namazPoints: prev.namazPoints + 10}))} className="flex-1 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-100 transition flex justify-center items-center gap-1"><FaPlusCircle /> 10 NP</button>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval */}
            {managementView === 'approval' && (
               <div className="animate-fade-in-up space-y-6">
                 <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl p-6 shadow-lg shadow-blue-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white">
                    <div className="text-center md:text-left">
                       <h3 className="font-bold text-xl mb-1 opacity-90">Sınıf Kodu</h3>
                       <p className="text-blue-100 text-sm">Öğrencilerinle paylaş:</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl font-mono text-3xl font-bold tracking-widest border border-white/30">
                       {INSTRUCTOR_CODE}
                    </div>
                 </div>

                 <h3 className="font-bold text-lg text-gray-700 mb-4 border-b pb-2">Bekleyen İstekler ({pendingStudents.length})</h3>
                 
                 {pendingStudents.length === 0 ? (
                   <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
                      <FaCheck className="text-5xl mx-auto mb-4 text-green-200" />
                      <p className="text-gray-400">Bekleyen öğrenci isteği yok.</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     {pendingStudents.map(s => (
                       <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-2xl">?</div>
                            <div>
                               <div className="font-bold text-lg text-gray-800">{s.name}</div>
                               <div className="text-xs font-bold bg-amber-100 text-amber-600 inline-block px-2 py-0.5 rounded">Kayıt İsteği</div>
                            </div>
                          </div>
                          <div className="flex gap-3 w-full md:w-auto">
                            <button onClick={() => rejectStudent(s.id)} className="flex-1 md:flex-none bg-red-50 text-red-600 rounded-xl px-4 py-2 font-bold hover:bg-red-100 transition">Reddet</button>
                            <button onClick={() => approveStudent(s.id)} className="flex-1 md:flex-none bg-green-500 text-white rounded-xl px-6 py-2 font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition">Onayla</button>
                          </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            )}

            {/* Market & Tasks */}
            {managementView === 'market' && (
              <div className="animate-fade-in-up space-y-8">
                {/* Market Management */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-600"><FaShoppingBasket /> Market Ürünleri</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                     <input type="text" placeholder="Ürün Adı" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
                     <input type="text" placeholder="İkon (Emoji)" value={newItem.icon} onChange={e => setNewItem({...newItem, icon: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
                     <div className="flex gap-2">
                       <input type="number" placeholder="Fiyat" value={newItem.price} onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
                       <select value={newItem.currency} onChange={e => setNewItem({...newItem, currency: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200">
                         <option value="GP">GP</option>
                         <option value="NP">NP</option>
                       </select>
                     </div>
                     <input type="text" placeholder="Açıklama" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
                  </div>
                  <button onClick={addMarketItem} className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 shadow-lg shadow-amber-200 transition-all">Ürün Ekle</button>

                  <div className="space-y-3 mt-6">
                    {marketItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                         <div className="flex items-center gap-3">
                           <span className="text-3xl">{item.icon}</span>
                           <div>
                             <div className="font-bold text-gray-800">{item.title}</div>
                             <div className="text-xs font-bold text-gray-500">{item.price} {item.currency}</div>
                           </div>
                         </div>
                         <button onClick={() => deleteMarketItem(item.id)} className="text-red-400 hover:text-red-600 p-2"><FaTrash /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks Management */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-600"><FaTasks /> Haftalık Görevler</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                     <input type="text" placeholder="Görev Başlığı" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 md:col-span-2" />
                     <div className="flex gap-2">
                       <input type="number" placeholder="Ödül" value={newTask.reward} onChange={e => setNewTask({...newTask, reward: parseInt(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                       <select value={newTask.currency} onChange={e => setNewTask({...newTask, currency: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
                         <option value="GP">GP</option>
                         <option value="NP">NP</option>
                       </select>
                     </div>
                  </div>
                  <button onClick={addTask} className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 shadow-lg shadow-indigo-200 transition-all">Görev Ekle</button>

                  <div className="space-y-3 mt-6">
                    {tasks.map(task => (
                      <div key={task.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                         <div>
                           <div className="font-bold text-gray-800">{task.title}</div>
                           <div className="text-xs font-bold text-indigo-600">Ödül: {task.reward} {task.currency}</div>
                         </div>
                         <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-600 p-2"><FaTrash /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Announcements */}
            {managementView === 'announcements' && (
              <div className="animate-fade-in-up space-y-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-rose-600"><FaBullhorn /> Duyuru Yönetimi</h3>
                  
                  <div className="space-y-4 mb-6">
                     <input 
                        type="text" 
                        placeholder="Duyuru Başlığı" 
                        value={newAnnouncement.title} 
                        onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200" 
                     />
                     <textarea 
                        placeholder="Duyuru Mesajı" 
                        value={newAnnouncement.message} 
                        onChange={e => setNewAnnouncement({...newAnnouncement, message: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 h-24 resize-none" 
                     />
                  </div>
                  <button onClick={addAnnouncement} className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all">Duyuru Yayınla</button>

                  <div className="space-y-4 mt-6">
                    {announcements.map(a => (
                      <div key={a.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
                         <div className="font-bold text-gray-800 text-lg">{a.title}</div>
                         <p className="text-sm text-gray-600 mt-1">{a.message}</p>
                         <div className="text-xs text-gray-400 mt-2 text-right">{a.date}</div>
                         <button onClick={() => deleteAnnouncement(a.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-2"><FaTrash /></button>
                      </div>
                    ))}
                    {announcements.length === 0 && <p className="text-center text-gray-400 font-bold p-4">Henüz duyuru yok.</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* --- MODAL: ACADEMIC DETAILS HISTORY (Stylized) --- */}
      {academicDetailStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center shrink-0">
                 <h3 className="font-bold text-lg text-gray-800">{academicDetailStudent.name} - Detaylar</h3>
                 <button onClick={() => setAcademicDetailStudent(null)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><FaTimes /></button>
              </div>
              <div className="p-4 overflow-y-auto space-y-4">
                 
                 {/* Attendance History */}
                 <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide"><FaUserCheck /> Yoklama Geçmişi</h4>
                    <div className="flex flex-wrap gap-2">
                       {Object.entries(academicDetailStudent.attendance)
                          .sort((a,b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                          .slice(0, 10)
                          .map(([date, status]) => (
                            <div key={date} className={`px-2 py-1 text-xs font-bold rounded-lg border ${status === 'present' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                               {new Date(date).toLocaleDateString('tr-TR', {day:'numeric', month:'numeric'})}: {status === 'present' ? 'Var' : 'Yok'}
                            </div>
                          ))
                       }
                       {Object.keys(academicDetailStudent.attendance).length === 0 && <span className="text-xs font-bold text-gray-400">Veri yok.</span>}
                    </div>
                 </div>

                 {/* Reading History */}
                 <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                    <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide"><FaBookOpen /> Yüzüne Okuma</h4>
                    <div className="space-y-2">
                      {Object.entries(academicDetailStudent.reading)
                          .sort((a,b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                          .slice(0, 5)
                          .map(([date, status]) => (
                            <div key={date} className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-amber-100">
                               <span className="font-bold text-gray-600">{new Date(date).toLocaleDateString('tr-TR')}</span>
                               <span className={`font-bold ${status==='passed'?'text-green-600':status==='study'?'text-amber-600':'text-red-600'}`}>
                                 {status === 'passed' ? 'GEÇTİ' : status === 'study' ? 'ÇALIŞIYOR' : 'KALDI'}
                               </span>
                            </div>
                          ))
                       }
                       {Object.keys(academicDetailStudent.reading).length === 0 && <span className="text-xs font-bold text-gray-400">Veri yok.</span>}
                    </div>
                 </div>

                 {/* Memorization List */}
                 <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                    <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide"><FaMicrophone /> Ezberler</h4>
                    <div className="flex flex-wrap gap-2">
                       {Object.entries(academicDetailStudent.memorization)
                          .filter(([_, status]) => status === 'passed')
                          .map(([surahId]) => {
                             const surahName = SURAH_LIST.find(s => s.id === surahId)?.title || surahId;
                             return (
                               <span key={surahId} className="bg-white text-purple-600 px-2 py-1 text-xs font-bold rounded-lg border border-purple-200 flex items-center gap-1">
                                 <FaCheck className="text-[10px]" /> {surahName}
                               </span>
                             )
                          })
                       }
                       {Object.values(academicDetailStudent.memorization).filter(s => s === 'passed').length === 0 && <span className="text-xs font-bold text-gray-400">Henüz ezber yok.</span>}
                    </div>
                 </div>

              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: REPORT CARD (SPIRITUAL + SUMMARY) (Stylized) --- */}
      {reportCardStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full md:max-w-lg h-full md:h-auto md:max-h-[90vh] flex flex-col shadow-2xl relative md:rounded-3xl overflow-hidden">
              
              {/* Close Button */}
              <button onClick={() => setReportCardStudent(null)} className="absolute top-4 right-4 z-20 bg-black/20 text-white p-2 rounded-full hover:bg-white hover:text-red-500 transition-all backdrop-blur-sm">
                 <FaTimes />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-6 pt-12 md:pt-6 shrink-0 relative overflow-hidden text-white">
                 <div className="relative z-10 flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                       {reportCardStudent.name.charAt(0)}
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold leading-none">{reportCardStudent.name}</h2>
                       <p className="text-teal-100 text-sm mt-1 opacity-80">{reportCardStudent.group}</p>
                    </div>
                 </div>
                 <div className="relative z-10 grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 flex items-center justify-between border border-white/20">
                       <span className="text-xs font-bold uppercase opacity-75">Toplam</span>
                       <span className="font-bold text-xl">{reportCardStudent.points} GP</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 flex items-center justify-between border border-white/20">
                       <span className="text-xs font-bold uppercase opacity-75">Namaz</span>
                       <span className="font-bold text-xl">{reportCardStudent.namazPoints} NP</span>
                    </div>
                 </div>
                 {/* Decorative Background Pattern */}
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
              </div>

              {/* Content Scrollable */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50">
                 
                 {/* Section 1: Prayer Grid */}
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide"><FaCalendarAlt className="text-teal-500" /> Haftalık Namaz Karnesi</h4>
                    <div className="overflow-x-auto">
                        <div className="min-w-[400px]">
                           {/* Grid Header */}
                           <div className="grid grid-cols-6 mb-2">
                             <div className="text-[10px] font-bold text-gray-400 uppercase">Tarih</div>
                             {PRAYER_TIMES.map(p => <div key={p.id} className="text-center text-[10px] font-bold text-gray-400 uppercase">{p.label}</div>)}
                           </div>
                           {/* Grid Body */}
                           {getLast7Days().map(d => {
                              const dKey = d.toISOString().split('T')[0];
                              const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
                              const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric' });
                              return (
                                <div key={dKey} className="grid grid-cols-6 py-2 border-t border-gray-100 items-center">
                                   <div className="text-[10px] font-bold text-gray-700 leading-tight">
                                     {dateStr}<br/><span className="text-gray-400">{dayName}</span>
                                   </div>
                                   {PRAYER_TIMES.map(p => {
                                      const status = reportCardStudent.prayers[`${dKey}-${p.id}`]?.type || 'none';
                                      return (
                                        <div key={p.id} className="flex justify-center">
                                           {status === 'tek' && <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs"><FaCheck /></div>}
                                           {status === 'cemaat' && <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs"><FaMosque /></div>}
                                           {status === 'none' && <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>}
                                        </div>
                                      );
                                   })}
                                </div>
                              )
                           })}
                        </div>
                    </div>
                 </div>

                 {/* Section 2: Memorization Summary */}
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide"><FaList className="text-purple-500" /> Ezber Durumu</h4>
                    <div className="flex flex-wrap gap-2">
                       {Object.entries(reportCardStudent.memorization)
                          .filter(([_, status]) => status === 'passed')
                          .map(([surahId]) => (
                             <span key={surahId} className="bg-purple-50 text-purple-700 px-3 py-1 text-xs font-bold rounded-full border border-purple-100">
                                {SURAH_LIST.find(s => s.id === surahId)?.title || surahId}
                             </span>
                          ))
                       }
                       {Object.values(reportCardStudent.memorization).filter(s => s === 'passed').length === 0 && <span className="text-xs font-bold text-gray-400 italic">Henüz ezber yok.</span>}
                    </div>
                 </div>

                 {/* Section 3: Reading Summary */}
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide"><FaBookOpen className="text-amber-500" /> Son Yüzüne Çalışmaları</h4>
                    <div className="space-y-2">
                      {Object.entries(reportCardStudent.reading)
                          .sort((a,b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                          .slice(0, 3)
                          .map(([date, status]) => (
                            <div key={date} className="flex justify-between items-center text-xs border border-gray-100 p-2 rounded-lg bg-gray-50">
                               <span className="font-bold text-gray-600">{new Date(date).toLocaleDateString('tr-TR')}</span>
                               <span className={`font-bold uppercase ${status==='passed'?'text-green-600':status==='study'?'text-amber-600':'text-red-600'}`}>
                                 {status === 'passed' ? 'Geçti' : status === 'study' ? 'Çalışıyor' : 'Kaldı'}
                               </span>
                            </div>
                          ))
                       }
                       {Object.keys(reportCardStudent.reading).length === 0 && <span className="text-xs font-bold text-gray-400 italic">Kayıt yok.</span>}
                    </div>
                 </div>

              </div>
           </div>
        </div>
      )}

      {/* Floating Bottom Navigation (Soft/Clean) */}
      <div className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-2 flex justify-around items-center z-50">
         <button 
           onClick={() => setActiveTab('academic')} 
           className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'academic' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
         >
           <FaGraduationCap className="text-xl" />
           <span className="text-[10px] font-bold">Akademik</span>
         </button>
         <button 
           onClick={() => setActiveTab('spiritual')} 
           className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'spiritual' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
         >
           <FaMosque className="text-xl" />
           <span className="text-[10px] font-bold">Manevi</span>
         </button>
         <button 
           onClick={() => setActiveTab('management')} 
           className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative ${activeTab === 'management' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
         >
           {pendingStudents.length > 0 && (
             <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
           )}
           <FaChartPie className="text-xl" />
           <span className="text-[10px] font-bold">Yönetim</span>
         </button>
      </div>
    </div>
  );
}