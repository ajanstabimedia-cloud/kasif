
import React, { useState } from 'react';
import { FaMosque, FaUserTie, FaUserGraduate, FaLock, FaUser, FaKey, FaArrowLeft, FaCheckCircle, FaUserPlus } from 'react-icons/fa';
import { Student, Instructor } from '../types';

interface LoginScreenProps {
  onLogin: (role: 'instructor' | 'student', user: Student | Instructor) => void;
  onRegisterStudent: (data: any) => void;
  onRegisterInstructor: (data: any) => void;
  students: Student[];
  instructors: Instructor[];
}

export default function LoginScreen({ onLogin, onRegisterStudent, onRegisterInstructor, students, instructors }: LoginScreenProps) {
  const [view, setView] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [role, setRole] = useState<'instructor' | 'student'>('student');
  
  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'instructor') {
      // Simplified Instructor Login: Only check if password is 1234
      if (password === '1234') {
        // Log in as the first available instructor account
        const defaultInstructor = instructors[0];
        if (defaultInstructor) {
          onLogin('instructor', defaultInstructor);
        } else {
          setError('Sistemde kayıtlı eğitmen bulunamadı!');
        }
      } else {
        setError('Hatalı yönetim şifresi!');
      }
    } else {
      // Standard Student Login
      const student = students.find(s => s.username === username && s.password === password);
      if (student) {
        if (student.status === 'pending') {
          setError('Hesabınız henüz onaylanmadı. Lütfen eğitmeninizden onay isteyin.');
        } else {
          onLogin('student', student);
        }
      } else {
        setError('Hatalı kullanıcı adı veya şifre!');
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'student') {
      if (!username || !password || !fullName || !classCode) {
        setError('Lütfen tüm alanları doldurun.');
        return;
      }
      
      const codeExists = instructors.some(i => i.classCodes.includes(classCode));
      if (!codeExists) {
        setError('Girdiğiniz grup kodu geçersiz veya sistemde kayıtlı değil.');
        return;
      }

      if (students.find(s => s.username === username)) {
        setError('Bu kullanıcı adı zaten alınmış.');
        return;
      }
      onRegisterStudent({ fullName, username, password, classCode });
      alert('Kayıt başarılı! Hesabınız eğitmen onayından sonra açılacaktır.');
    } else {
      // Instructor registration still requires full info if used
      if (!username || !password || !fullName) {
        setError('Lütfen tüm alanları doldurun.');
        return;
      }
      if (instructors.find(i => i.username === username)) {
        setError('Bu kullanıcı adı zaten alınmış.');
        return;
      }
      onRegisterInstructor({ fullName, username, password });
      alert('Eğitmen kaydı başarılı!');
    }
    setView('login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 text-white p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="z-10 text-center mb-10 animate-fade-in-down">
        <div className="text-7xl mb-4 opacity-90 drop-shadow-2xl flex justify-center">
          <FaMosque className="text-blue-300" />
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-tight">Kaşif & Namaz</h1>
        <p className="text-blue-200 text-lg font-medium opacity-80">Genç Kaşifler Platformu</p>
      </div>

      <div className="w-full max-w-sm z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500">
        
        {view === 'welcome' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-8">Hoş Geldiniz</h2>
            <button 
              onClick={() => { setRole('student'); setView('login'); }}
              className="w-full bg-white text-blue-900 py-5 rounded-2xl font-black shadow-xl hover:scale-[1.03] transition-all flex items-center justify-center gap-3 text-lg"
            >
              <FaUserGraduate /> Öğrenci Girişi
            </button>
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-white/40 font-bold">Veya</span></div>
            </div>

            <button 
              onClick={() => { setRole('instructor'); setView('login'); }}
              className="w-full bg-blue-500/40 border border-white/20 text-white py-5 rounded-2xl font-black hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-lg"
            >
              <FaUserTie /> Eğitmen Girişi
            </button>

            <div className="pt-4 text-center border-t border-white/10">
               <button 
                onClick={() => { setRole('student'); setView('register'); }}
                className="text-white text-sm font-black flex items-center justify-center gap-2 mx-auto hover:text-blue-300 transition"
               >
                 <FaUserPlus /> Yeni Öğrenci Kaydı
               </button>
            </div>
          </div>
        )}

        {(view === 'login' || view === 'register') && (
          <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-5 animate-fade-in">
             <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={() => setView('welcome')} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition"><FaArrowLeft /></button>
                <div>
                   <h2 className="text-xl font-black">{role === 'student' ? 'Öğrenci' : 'Eğitmen'}</h2>
                   <p className="text-xs text-blue-200 opacity-60">{view === 'login' ? (role === 'instructor' ? 'Yönetici Girişi' : 'Giriş Paneli') : 'Kayıt Formu'}</p>
                </div>
             </div>

             {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl text-xs text-center font-bold animate-shake">{error}</div>}

             {(view === 'register' || (view === 'login' && role === 'student')) && (
               <>
                {view === 'register' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-blue-300 ml-1">Tam Ad Soyad</label>
                    <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-400 transition" placeholder="Ahmet Yılmaz" />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-blue-300 ml-1">Kullanıcı Adı</label>
                  <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-400 transition" placeholder="kullanici_adi" />
                  </div>
                </div>
               </>
             )}

             <div className="space-y-1">
               <label className="text-[10px] uppercase font-black text-blue-300 ml-1">
                 {role === 'instructor' && view === 'login' ? 'Yönetim Şifresi' : 'Şifre'}
               </label>
               <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-400 transition" placeholder={role === 'instructor' && view === 'login' ? "Yönetim şifresini girin" : "••••••••"} />
               </div>
             </div>

             {view === 'register' && role === 'student' && (
               <div className="space-y-1">
                 <label className="text-[10px] uppercase font-black text-blue-400 ml-1 flex justify-between">Grup Kodu <span className="opacity-50">(Eğitmenden Alın)</span></label>
                 <div className="relative">
                    <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="text" value={classCode} onChange={e => setClassCode(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-400 transition font-mono tracking-widest" placeholder="123456" />
                 </div>
               </div>
             )}

             <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 transition transform active:scale-95 mt-4 flex items-center justify-center gap-2">
               {view === 'login' ? 'Giriş Yap' : 'Kayıt Ol'} <FaCheckCircle />
             </button>

             {role === 'student' && (
                <div className="text-center mt-6">
                    {view === 'login' ? (
                    <p className="text-xs text-blue-200/60">Hesabınız yok mu? <button type="button" onClick={() => setView('register')} className="font-black underline text-white">Kayıt Olun</button></p>
                    ) : (
                    <p className="text-xs text-blue-200/60">Zaten üye misiniz? <button type="button" onClick={() => setView('login')} className="font-black underline text-white">Giriş Yapın</button></p>
                    )}
                </div>
             )}
          </form>
        )}
      </div>

      <div className="mt-12 flex items-center gap-2 text-white/20 text-[10px] font-black tracking-widest uppercase">
         <span className="w-8 h-[1px] bg-white/10"></span>
         Secure Administration Layer
         <span className="w-8 h-[1px] bg-white/10"></span>
      </div>
    </div>
  );
}
