import React, { useState } from 'react';
import { FaMosque, FaUserTie, FaBookOpen, FaTimes, FaChevronRight } from 'react-icons/fa';
import { UserRole, Student } from '../types';
import { INSTRUCTOR_CODE } from '../constants';

interface LoginScreenProps {
  onLogin: (role: UserRole, user?: Student) => void;
  onRegister: (name: string, code: string) => void;
  students: Student[];
}

export default function LoginScreen({ onLogin, onRegister, students }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [registerName, setRegisterName] = useState('');
  const [registerCode, setRegisterCode] = useState('');
  const [showStudentList, setShowStudentList] = useState(false);
  const [message, setMessage] = useState('');

  const submitRegister = () => {
    if (!registerName || !registerCode) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }
    if (registerCode !== INSTRUCTOR_CODE) {
      setMessage("Geçersiz Sınıf Kodu!");
      return;
    }
    onRegister(registerName, registerCode);
    setMessage("Kayıt isteği gönderildi! Öğretmeniniz onayladığında giriş yapabilirsiniz.");
    setRegisterName('');
    setRegisterCode('');
    setTimeout(() => { setActiveTab('login'); setMessage(''); }, 3000);
  };

  const approvedStudents = students.filter(s => s.status === 'approved');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-6 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-80 h-80 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>

      <div className="z-10 text-center mb-8 animate-fade-in-down">
        <div className="text-6xl mb-4 opacity-90"><FaMosque className="mx-auto text-blue-200" /></div>
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Kaşif & Namaz</h1>
        <p className="text-blue-200 text-lg">Eğitim & Takip Sistemi Pro</p>
      </div>

      <div className="w-full max-w-sm z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
        {/* Tabs */}
        <div className="flex mb-6 bg-black/20 rounded-xl p-1">
          <button 
            onClick={() => { setActiveTab('login'); setShowStudentList(false); }}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'login' ? 'bg-white text-primary shadow-md' : 'text-blue-100 hover:bg-white/5'}`}
          >
            Giriş Yap
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'register' ? 'bg-white text-primary shadow-md' : 'text-blue-100 hover:bg-white/5'}`}
          >
            Kayıt Ol
          </button>
        </div>

        {activeTab === 'login' ? (
          <div className="space-y-4 animate-fade-in">
             {!showStudentList ? (
                <>
                  <button 
                    onClick={() => onLogin('instructor')}
                    className="w-full bg-white text-blue-900 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
                  >
                    <FaUserTie /> Eğitmen Girişi
                  </button>
                  <button 
                    onClick={() => setShowStudentList(true)}
                    className="w-full bg-blue-500/30 border border-white/30 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
                  >
                    <FaBookOpen /> Öğrenci Girişi
                  </button>
                </>
             ) : (
                <div className="bg-white text-gray-800 rounded-2xl overflow-hidden shadow-xl max-h-[50vh] flex flex-col">
                   <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                     <h3 className="font-bold">Öğrenci Seç</h3>
                     <button onClick={() => setShowStudentList(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                   </div>
                   <div className="overflow-y-auto p-2 space-y-1">
                     {approvedStudents.length === 0 && <p className="text-center text-gray-400 p-4 text-sm">Kayıtlı öğrenci yok.</p>}
                     {approvedStudents.map(s => (
                       <button 
                        key={s.id} 
                        onClick={() => onLogin('student', s)}
                        className="w-full p-3 text-left hover:bg-blue-50 rounded-xl transition flex justify-between items-center group"
                       >
                         <span className="font-semibold text-sm">{s.name}</span>
                         <FaChevronRight className="text-gray-300 group-hover:text-blue-500" />
                       </button>
                     ))}
                   </div>
                </div>
             )}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
             {message && <div className="bg-blue-500/20 text-blue-100 p-3 rounded-xl text-xs text-center border border-blue-500/30">{message}</div>}
             <div>
               <label className="text-xs text-blue-200 ml-1">Ad Soyad</label>
               <input 
                 type="text" 
                 value={registerName}
                 onChange={e => setRegisterName(e.target.value)}
                 className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 outline-none focus:border-white/50 transition"
                 placeholder="Örn: Ali Veli"
               />
             </div>
             <div>
               <label className="text-xs text-blue-200 ml-1">Sınıf Kodu</label>
               <input 
                 type="text" 
                 value={registerCode}
                 onChange={e => setRegisterCode(e.target.value)}
                 className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 outline-none focus:border-white/50 transition"
                 placeholder="Öğretmeninden al"
               />
             </div>
             <button 
               onClick={submitRegister}
               className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3 rounded-2xl font-bold shadow-lg transition transform hover:scale-105 mt-2"
             >
               Kaydı Tamamla
             </button>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 text-blue-200/40 text-xs">v2.2.0 Blue Edition</div>
    </div>
  );
}