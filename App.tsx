
import React, { useState, useEffect } from 'react';
import { UserRole, Student, MarketItem, WeeklyTask, Announcement, Badge, Instructor } from './types';
import { INITIAL_STUDENTS, INITIAL_MARKET_ITEMS, INITIAL_TASKS, INITIAL_ANNOUNCEMENTS, AVAILABLE_BADGES, INITIAL_INSTRUCTORS } from './constants';
import LoginScreen from './components/LoginScreen';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';

export default function App() {
  const [role, setRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<Student | Instructor | null>(null);
  
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('kasif_students_v3.1');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  
  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    const saved = localStorage.getItem('kasif_instructors_v3.1');
    return saved ? JSON.parse(saved) : INITIAL_INSTRUCTORS;
  });

  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => {
    const saved = localStorage.getItem('kasif_market_v3.1');
    return saved ? JSON.parse(saved) : INITIAL_MARKET_ITEMS;
  });

  const [tasks, setTasks] = useState<WeeklyTask[]>(() => {
    const saved = localStorage.getItem('kasif_tasks_v3.1');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('kasif_announcements_v3.1');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('kasif_badges_v3.1');
    return saved ? JSON.parse(saved) : AVAILABLE_BADGES;
  });

  useEffect(() => { localStorage.setItem('kasif_students_v3.1', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('kasif_instructors_v3.1', JSON.stringify(instructors)); }, [instructors]);
  useEffect(() => { localStorage.setItem('kasif_market_v3.1', JSON.stringify(marketItems)); }, [marketItems]);
  useEffect(() => { localStorage.setItem('kasif_tasks_v3.1', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('kasif_announcements_v3.1', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('kasif_badges_v3.1', JSON.stringify(badges)); }, [badges]);

  const handleLogin = (selectedRole: UserRole, user: Student | Instructor) => {
    setRole(selectedRole);
    setCurrentUser(user);
  };

  const registerStudent = (data: any) => {
    const newStudent: Student = {
      id: Date.now(),
      name: data.fullName,
      username: data.username,
      password: data.password,
      group: 'Kaşif Grubu',
      status: 'pending',
      classCode: data.classCode,
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
    setStudents(prev => [...prev, newStudent]);
  };

  const registerInstructor = (data: any) => {
    const newInstructor: Instructor = {
      id: Date.now(),
      name: data.fullName,
      username: data.username,
      password: data.password,
      classCodes: [] // Starts with no groups, must generate one
    };
    setInstructors(prev => [...prev, newInstructor]);
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
  };

  const updateStudent = (id: number, updater: (s: Student) => Student) => {
    setStudents(prev => prev.map(s => s.id === id ? updater(s) : s));
    if (role === 'student' && currentUser && (currentUser as Student).id === id) {
      setCurrentUser(prev => prev ? updater(prev as Student) : null);
    }
  };

  const updateInstructor = (id: number, updater: (i: Instructor) => Instructor) => {
    setInstructors(prev => prev.map(i => i.id === id ? updater(i) : i));
    if (role === 'instructor' && currentUser && (currentUser as Instructor).id === id) {
      setCurrentUser(prev => prev ? updater(prev as Instructor) : null);
    }
  };

  if (!role) return (
    <LoginScreen 
      onLogin={handleLogin} 
      onRegisterStudent={registerStudent} 
      onRegisterInstructor={registerInstructor}
      students={students} 
      instructors={instructors}
    />
  );
  
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {role === 'instructor' ? (
        <InstructorDashboard 
          instructor={currentUser as Instructor}
          students={students.filter(s => (currentUser as Instructor).classCodes.includes(s.classCode))} 
          updateStudent={updateStudent} 
          updateInstructor={updateInstructor}
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
          student={currentUser as Student} 
          updateStudent={updateStudent} 
          marketItems={marketItems}
          tasks={tasks}
          announcements={announcements.filter(a => a.classCode === (currentUser as Student).classCode)}
          badges={badges}
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}
