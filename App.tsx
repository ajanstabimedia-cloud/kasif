import React, { useState, useEffect } from 'react';
import { UserRole, Student, MarketItem, WeeklyTask, Announcement, Badge } from './types';
import { INITIAL_STUDENTS, INITIAL_MARKET_ITEMS, INITIAL_TASKS, INITIAL_ANNOUNCEMENTS, AVAILABLE_BADGES } from './constants';
import LoginScreen from './components/LoginScreen';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';

export default function App() {
  const [role, setRole] = useState<UserRole>(null);
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('kasif_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => {
    const saved = localStorage.getItem('kasif_market');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_ITEMS;
  });
  const [tasks, setTasks] = useState<WeeklyTask[]>(() => {
    const saved = localStorage.getItem('kasif_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('kasif_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });
  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('kasif_badges');
    return saved ? JSON.parse(saved) : AVAILABLE_BADGES;
  });

  const [currentUser, setCurrentUser] = useState<Student | null>(null);

  useEffect(() => {
    localStorage.setItem('kasif_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('kasif_market', JSON.stringify(marketItems));
  }, [marketItems]);

  useEffect(() => {
    localStorage.setItem('kasif_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kasif_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('kasif_badges', JSON.stringify(badges));
  }, [badges]);

  const handleLogin = (selectedRole: UserRole, user?: Student) => {
    setRole(selectedRole);
    if (user) setCurrentUser(user);
  };

  const handleRegister = (name: string, classCode: string) => {
    const newStudent: Student = {
      id: Date.now(),
      name,
      group: 'Yeni Kayıt',
      status: 'pending',
      classCode,
      points: 0,
      namazPoints: 0,
      inventory: [],
      badges: [],
      completedTasks: [],
      attendance: {},
      reading: {},
      memorization: {},
      prayers: {}
    };
    setStudents([...students, newStudent]);
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
  };

  const updateStudent = (id: number, updater: (s: Student) => Student) => {
    setStudents(prev => prev.map(s => s.id === id ? updater(s) : s));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? updater(prev) : null);
    }
  };

  if (!role) return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} students={students} />;
  
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {role === 'instructor' ? (
        <InstructorDashboard 
          students={students} 
          updateStudent={updateStudent} 
          setStudents={setStudents}
          marketItems={marketItems}
          setMarketItems={setMarketItems}
          tasks={tasks}
          setTasks={setTasks}
          announcements={announcements}
          setAnnouncements={setAnnouncements}
          badges={badges}
          setBadges={setBadges}
          onLogout={handleLogout} 
        />
      ) : (
        <StudentDashboard 
          student={currentUser!} 
          updateStudent={updateStudent} 
          marketItems={marketItems}
          tasks={tasks}
          announcements={announcements}
          badges={badges}
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}