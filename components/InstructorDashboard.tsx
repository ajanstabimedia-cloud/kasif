
import React, { useState } from 'react';
import { 
  FaUserCheck, FaBookOpen, FaMicrophone, FaChartPie, 
  FaTasks, FaBullhorn, FaSignOutAlt, FaChevronRight, FaArrowLeft, FaTimes, FaCheck, 
  FaShoppingBasket, FaTrash, FaPlus, FaUsers, FaUser, FaMedal, FaFilter, FaStar, FaCoins, FaPalette
} from 'react-icons/fa';
import { Student, MarketItem, WeeklyTask, Announcement, Badge, Instructor } from '../types';
import { SURAH_LIST } from '../constants';

interface InstructorDashboardProps {
  instructor: Instructor;
  students: Student[];
  updateStudent: (id: number, updater: (s: Student) => Student) => void;
  updateInstructor: (id: number, updater: (i: Instructor) => Instructor) => void;
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
  instructor, students, updateStudent, updateInstructor, setStudents, onLogout,
  marketItems, setMarketItems, tasks, setTasks, announcements, setAnnouncements,
  badges, setBadges
}: InstructorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'academic' | 'spiritual' | 'groups' | 'management'>('academic');
  const [academicView, setAcademicView] = useState<'attendance' | 'reading' | 'memorization'>('attendance');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedDate] = useState(new Date());
  
  const [academicDetailStudent, setAcademicDetailStudent] = useState<Student | null>(null);
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);
  const [memorizationCheckStudentId, setMemorizationCheckStudentId] = useState<number | null>(null);

  // Form States
  const [newItem, setNewItem] = useState({ title: '', price: 100, currency: 'GP' as 'GP' | 'NP', icon: '🎁', description: '' });
  const [newTask, setNewTask] = useState({ title: '', reward: 50, currency: 'GP' as 'GP' | 'NP', target: 1 });
  const [newBadge, setNewBadge] = useState({ title: '', icon: '🏅', value: 100, color: 'bg-blue-500', description: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', targetGroup: instructor.classCodes[0] || '' });

  const dateKey = selectedDate.toISOString().split('T')[0];
  const filteredStudents = selectedGroup === 'all' 
    ? students 
    : students.filter(s => s.classCode === selectedGroup);

  const pendingStudents = filteredStudents.filter(s => s.status === 'pending');
  const approvedStudents = filteredStudents.filter(s => s.status === 'approved');

  const generateNewCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    if (instructor.classCodes.includes(code)) return generateNewCode();
    updateInstructor(instructor.id, prev => ({
      ...prev,
      classCodes: [...prev.classCodes, code]
    }));
    alert(`Yeni Grup Kodu: ${code}`);
  };

  const handleStatusChange = (studentId: number, type: 'attendance' | 'reading', value: string) => {
    updateStudent(studentId, (s: Student) => ({
      ...s,
      [type]: { ...s[type], [dateKey]: value }
    }));
  };

  const approveStudent = (studentId: number) => {
    updateStudent(studentId, s => ({ ...s, status: 'approved' }));
  };

  const rejectStudent = (studentId: number) => {
    if (window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
    }
  };

  const addBadge = () => {
    if(!newBadge.title) return;
    const badge: Badge = { id: Date.now().toString(), ...newBadge };
    setBadges([...badges, badge]);
    setNewBadge({ title: '', icon: '🏅', value: 100, color: 'bg-blue-500', description: '' });
  };

  const deleteBadge = (id: string) => setBadges(badges.filter(b => b.id !== id));

  const addMarketItem = () => {
    if (!newItem.title) return;
    const item: MarketItem = { id: Date.now().toString(), ...newItem };
    setMarketItems([...marketItems, item]);
    setNewItem({ title: '', price: 100, currency: 'GP', icon: '🎁', description: '' });
  };

  const deleteMarketItem = (id: string) => setMarketItems(marketItems.filter(i => i.id !== id));

  const addWeeklyTask = () => {
    if (!newTask.title) return;
    const task: WeeklyTask = { id: Date.now(), ...newTask };
    setTasks([...tasks, task]);
    setNewTask({ title: '', reward: 50, currency: 'GP', target: 1 });
  };

  const deleteWeeklyTask = (id: number) => setTasks(tasks.filter(t => t.id !== id));

  const addAnnouncement = () => {
    if(!newAnnouncement.title || !newAnnouncement.message || !newAnnouncement.targetGroup) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    const ann: Announcement = { 
      id: Date.now(), 
      title: newAnnouncement.title, 
      message: newAnnouncement.message,
      date: new Date().toLocaleDateString('tr-TR'),
      classCode: newAnnouncement.targetGroup
    };
    setAnnouncements([ann, ...announcements]);
    setNewAnnouncement({ title: '', message: '', targetGroup: instructor.classCodes[0] || '' });
  };

  return (
    <div className="pb-32 bg-gray-50 min-h-screen font-sans">
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 rounded-b-[2.5rem] shadow-lg sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest opacity-70">Selamün Aleyküm,</p>
            <h2 className="text-2xl font-black">{instructor.name}</h2>
          </div>
          <button onClick={onLogout} className="bg-white/10 p-3 rounded-2xl backdrop-blur-md hover:bg-white/20 transition">
            <FaSignOutAlt />
          </button>
        </div>
        
        <div className="flex items-center gap-3 mt-4">
           <div className="flex-1 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex items-center gap-2">
              <div className="bg-blue-500 p-2 rounded-xl"><FaFilter className="text-xs" /></div>
              <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} className="bg-transparent text-white font-bold text-sm outline-none flex-1">
                <option value="all" className="text-gray-800">Tüm Gruplar</option>
                {instructor.classCodes.map(code => <option key={code} value={code} className="text-gray-800">Grup: {code}</option>)}
              </select>
           </div>
        </div>
      </header>

      <main className="p-5 max-w-4xl mx-auto">
        {activeTab === 'academic' && (
          <div className="animate-fade-in">
             <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex mb-6">
                {[{ id: 'attendance', label: 'Yoklama', icon: <FaUserCheck /> }, { id: 'reading', label: 'Yüzüne', icon: <FaBookOpen /> }, { id: 'memorization', label: 'Ezber', icon: <FaMicrophone /> }].map((tab) => (
                  <button key={tab.id} onClick={() => setAcademicView(tab.id as any)} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${academicView === tab.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400'}`}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
             </div>

             {(academicView === 'attendance' || academicView === 'reading') && (
                <div className="space-y-3">
                  {approvedStudents.map(s => {
                    const status = academicView === 'attendance' ? (s.attendance[dateKey] || 'none') : (s.reading[dateKey] || 'none');
                    return (
                      <div key={s.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-bold text-gray-400">{s.name.charAt(0)}</div>
                          <div className="font-bold text-gray-800 text-sm">{s.name}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleStatusChange(s.id, academicView as any, (status === 'present' || status === 'passed') ? 'none' : (academicView === 'attendance' ? 'present' : 'passed'))} className={`p-3 rounded-xl ${(status === 'present' || status === 'passed') ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-100 text-gray-300'}`}><FaCheck /></button>
                          <button onClick={() => handleStatusChange(s.id, academicView as any, (status === 'absent' || status === 'failed') ? 'none' : (academicView === 'attendance' ? 'absent' : 'failed'))} className={`p-3 rounded-xl ${(status === 'absent' || status === 'failed') ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 text-gray-300'}`}><FaTimes /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
             )}

             {academicView === 'memorization' && (
                <div className="grid gap-3">
                  {approvedStudents.map(s => (
                    <div key={s.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer" onClick={() => setMemorizationCheckStudentId(s.id)}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">{s.name.charAt(0)}</div>
                        <div className="font-bold text-gray-800">{s.name}</div>
                      </div>
                      <FaChevronRight className="text-gray-300" />
                    </div>
                  ))}
                </div>
             )}
          </div>
        )}

        {activeTab === 'spiritual' && (
           <div className="space-y-3">
              {approvedStudents.map(s => (
                <div key={s.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-500 group-hover:text-white transition">{s.name.charAt(0)}</div>
                     <div>
                       <h3 className="font-bold text-gray-800">{s.name}</h3>
                       <p className="text-[10px] font-black text-emerald-600 uppercase">Puan: {s.points} GP / {s.namazPoints} NP</p>
                     </div>
                   </div>
                   <FaChevronRight className="text-gray-300" />
                </div>
              ))}
           </div>
        )}

        {activeTab === 'groups' && (
          <div className="animate-fade-in space-y-8">
            {pendingStudents.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest px-2">Onay Bekleyenler ({pendingStudents.length})</h3>
                {pendingStudents.map(s => (
                  <div key={s.id} className="bg-white p-5 rounded-3xl shadow-md border-2 border-emerald-100 flex items-center justify-between animate-pulse">
                     <div>
                       <div className="font-black text-gray-800">{s.name}</div>
                       <div className="text-[10px] font-black text-blue-500 uppercase">Grup: {s.classCode}</div>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={() => rejectStudent(s.id)} className="bg-red-50 text-red-600 p-3 rounded-xl"><FaTimes /></button>
                       <button onClick={() => approveStudent(s.id)} className="bg-emerald-500 text-white px-5 py-3 rounded-xl font-black text-xs shadow-lg">ONAYLA</button>
                     </div>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 text-center">
               <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6"><FaPlus /></div>
               <h3 className="text-2xl font-black text-gray-800 mb-2">Yeni Grup Kodu</h3>
               <button onClick={generateNewCode} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-2xl active:scale-95 text-lg">Oluştur</button>
            </div>
          </div>
        )}

        {activeTab === 'management' && (
          <div className="animate-fade-in space-y-12 pb-10">
            {/* ROZET TANIMLAMA */}
            <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-purple-600 text-xs uppercase mb-6 tracking-widest flex items-center gap-2"><FaMedal /> Rozet Tanımla</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <input type="text" placeholder="Rozet Adı" value={newBadge.title} onChange={e => setNewBadge({...newBadge, title: e.target.value})} className="col-span-2 bg-gray-50 p-4 rounded-2xl font-bold text-sm outline-none" />
                <input type="text" placeholder="Emoji" value={newBadge.icon} onChange={e => setNewBadge({...newBadge, icon: e.target.value})} className="bg-gray-50 p-4 rounded-2xl text-center outline-none" />
                <input type="number" placeholder="Puan Değeri" value={newBadge.value} onChange={e => setNewBadge({...newBadge, value: Number(e.target.value)})} className="bg-gray-50 p-4 rounded-2xl outline-none" />
                <select value={newBadge.color} onChange={e => setNewBadge({...newBadge, color: e.target.value})} className="col-span-2 bg-gray-50 p-4 rounded-2xl outline-none font-bold">
                  <option value="bg-blue-500">Mavi</option>
                  <option value="bg-emerald-500">Yeşil</option>
                  <option value="bg-rose-500">Kırmızı</option>
                  <option value="bg-amber-500">Turuncu</option>
                  <option value="bg-purple-500">Mor</option>
                </select>
                <button onClick={addBadge} className="col-span-2 bg-purple-600 text-white py-4 rounded-2xl font-black shadow-lg">Rozet Ekle</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {badges.map(b => (
                  <div key={b.id} className={`${b.color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2`}>
                    {b.icon} {b.title} ({b.value}P)
                    <button onClick={() => deleteBadge(b.id)}><FaTimes /></button>
                  </div>
                ))}
              </div>
            </section>

            {/* GÖREV EKLEME */}
            <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h3 className="font-black text-blue-600 text-xs uppercase mb-6 tracking-widest flex items-center gap-2"><FaTasks /> Haftalık Görev</h3>
               <div className="space-y-3 mb-6">
                  <input type="text" placeholder="Görev Başlığı" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-sm outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Ödül" value={newTask.reward} onChange={e => setNewTask({...newTask, reward: Number(e.target.value)})} className="bg-gray-50 p-4 rounded-2xl outline-none" />
                    <select value={newTask.currency} onChange={e => setNewTask({...newTask, currency: e.target.value as any})} className="bg-gray-50 p-4 rounded-2xl outline-none">
                      <option value="GP">GP</option>
                      <option value="NP">NP</option>
                    </select>
                  </div>
                  <button onClick={addWeeklyTask} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">Görev Tanımla</button>
               </div>
               <div className="space-y-2">
                  {tasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-xs font-bold">{t.title} - {t.reward} {t.currency}</span>
                      <button onClick={() => deleteWeeklyTask(t.id)} className="text-red-500"><FaTrash /></button>
                    </div>
                  ))}
               </div>
            </section>

            {/* MARKET YÖNETİMİ */}
            <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h3 className="font-black text-amber-600 text-xs uppercase mb-6 tracking-widest flex items-center gap-2"><FaShoppingBasket /> Market Ürünleri</h3>
               <div className="grid grid-cols-2 gap-3 mb-6">
                  <input type="text" placeholder="Ürün Adı" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="col-span-2 bg-gray-50 p-4 rounded-2xl font-bold text-sm outline-none" />
                  <input type="number" placeholder="Fiyat" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="bg-gray-50 p-4 rounded-2xl outline-none" />
                  <select value={newItem.currency} onChange={e => setNewItem({...newItem, currency: e.target.value as any})} className="bg-gray-50 p-4 rounded-2xl outline-none font-bold">
                    <option value="GP">GP</option>
                    <option value="NP">NP</option>
                  </select>
                  <button onClick={addMarketItem} className="col-span-2 bg-amber-500 text-white py-4 rounded-2xl font-black shadow-lg">Ürün Ekle</button>
               </div>
               <div className="space-y-2">
                 {marketItems.map(item => (
                   <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                     <span className="text-xs font-bold">{item.icon} {item.title} - {item.price} {item.currency}</span>
                     <button onClick={() => deleteMarketItem(item.id)} className="text-red-500"><FaTrash /></button>
                   </div>
                 ))}
               </div>
            </section>

            {/* DUYURU YAYINLAMA */}
            <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h3 className="font-black text-rose-600 text-xs uppercase mb-6 tracking-widest flex items-center gap-2"><FaBullhorn /> Duyuru Panosu</h3>
               <div className="space-y-4">
                  <select value={newAnnouncement.targetGroup} onChange={e => setNewAnnouncement({...newAnnouncement, targetGroup: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-sm">
                    {instructor.classCodes.map(code => <option key={code} value={code}>Grup: {code}</option>)}
                  </select>
                  <input type="text" placeholder="Başlık" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold" />
                  <textarea placeholder="Mesaj..." value={newAnnouncement.message} onChange={e => setNewAnnouncement({...newAnnouncement, message: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none h-24" />
                  <button onClick={addAnnouncement} className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black shadow-lg">Duyuruyu Yayınla</button>
               </div>
            </section>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 p-3 flex justify-around items-center z-50">
         {[ 
           { id: 'academic', icon: <FaBookOpen /> }, 
           { id: 'spiritual', icon: <FaUser /> }, 
           { id: 'groups', icon: <FaUsers />, badge: pendingStudents.length > 0 },
           { id: 'management', icon: <FaChartPie /> } 
         ].map(tab => (
           <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex flex-col items-center justify-center p-4 rounded-[2rem] transition-all relative ${activeTab === tab.id ? 'text-blue-600 bg-blue-50 shadow-inner scale-110' : 'text-gray-400'}`}>
              <span className="text-2xl">{tab.icon}</span>
              {tab.badge && <span className="absolute top-3 right-5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
           </button>
         ))}
      </div>
    </div>
  );
}
