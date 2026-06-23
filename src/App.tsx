/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Sun, Moon, Clock, LogOut, Menu, X, Landmark, 
  Sparkles, ShieldCheck, User, LayoutDashboard, ChevronRight
} from 'lucide-react';

// Types and Mock Data
import { Task, DemoUser, DashboardWidget, TaskStatus, SubscriptionPlan } from './types';
import { INITIAL_DEMO_USER, INITIAL_TASKS, DEFAULT_WIDGETS } from './data/mockData';

// Custom Subcomponents
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import KanbanView from './components/KanbanView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import LoginModal from './components/LoginModal';
import Toast, { ToastMessage, ToastType } from './components/Toast';

export default function App() {
  // State 1: Active Page View Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // State 2: Login Session
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('NEXTIN_IS_LOGGED_IN');
      return saved ? JSON.parse(saved) : true; // Default logged in for premium trial flow
    } catch {
      return true;
    }
  });

  // State 3: User Profile Info
  const [user, setUser] = useState<DemoUser>(() => {
    try {
      const saved = localStorage.getItem('NEXTIN_USER');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_USER;
    } catch {
      return INITIAL_DEMO_USER;
    }
  });

  // State 4: Kanban Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('NEXTIN_TASKS');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // State 5: Customizable Widgets
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    try {
      const saved = localStorage.getItem('NEXTIN_WIDGETS');
      return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
    } catch {
      return DEFAULT_WIDGETS;
    }
  });

  // State 6: Dark Mode Toggle
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('NEXTIN_DARK_MODE');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // State 7: Active SaaS Plan
  const [currentPlan, setCurrentPlan] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('NEXTIN_CURRENT_PLAN');
      return saved ? JSON.parse(saved) : 'pro'; // Default to Pro as the hero billing model
    } catch {
      return 'pro';
    }
  });

  // State 8: Weekly Accumulated Saved Hours (Stopwatch records flow here!)
  const [savedHoursThisWeek, setSavedHoursThisWeek] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('NEXTIN_SAVED_HOURS');
      return saved ? JSON.parse(saved) : 7.2; // Defaults to a positive simulated starting metric
    } catch {
      return 7.2;
    }
  });

  // State 9: Custom Toast Notification logs
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // State 10: Clock state
  const [currentTime, setCurrentTime] = useState<string>('');

  // Mobile navigation drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state modifications to LocalStorage to respect persistence
  useEffect(() => {
    localStorage.setItem('NEXTIN_IS_LOGGED_IN', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('NEXTIN_USER', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('NEXTIN_TASKS', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('NEXTIN_WIDGETS', JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    localStorage.setItem('NEXTIN_DARK_MODE', JSON.stringify(darkMode));
    // Apply body dark class for Tailwind CSS
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('NEXTIN_CURRENT_PLAN', JSON.stringify(currentPlan));
  }, [currentPlan]);

  useEffect(() => {
    localStorage.setItem('NEXTIN_SAVED_HOURS', JSON.stringify(savedHoursThisWeek));
  }, [savedHoursThisWeek]);

  // Track simple UTC and local Korean time safely
  useEffect(() => {
    const updateTime = () => {
      const origin = new Date();
      const stringified = origin.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setCurrentTime(stringified);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper: Trigger custom toast banner
  const triggerToast = (text: string, type: ToastType = 'success') => {
    const freshId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id: freshId, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Callback handlers for Tasks (CRUD)
  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const completedProgress = newStatus === '완료' ? 100 : task.progress;
          return { ...task, status: newStatus, progress: completedProgress };
        }
        return task;
      })
    );
  };

  const handleUpdateProgress = (id: string, newProgress: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const statusVal: TaskStatus = newProgress === 100 ? '완료' : task.status;
          return { ...task, progress: newProgress, status: statusVal };
        }
        return task;
      })
    );
    triggerToast('업무 진척도가 정밀 조정되었습니다.', 'info');
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    triggerToast(`기안문 ${id} 번이 폐기 처리되었습니다.`, 'warning');
  };

  // Callback handlers for widget ordering customization
  const handleToggleWidgetVisibility = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  const handleMoveWidget = (id: string, direction: 'up' | 'down') => {
    setWidgets((prev) => {
      const idx = prev.findIndex((w) => w.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const freshList = [...prev];
      // Swap order attributes and indexes
      const tempOrder = freshList[idx].order;
      freshList[idx].order = freshList[targetIdx].order;
      freshList[targetIdx].order = tempOrder;

      const tempObj = freshList[idx];
      freshList[idx] = freshList[targetIdx];
      freshList[targetIdx] = tempObj;

      return freshList;
    });
  };

  // Login handler
  const handleLoginSuccess = (loggedInUser: DemoUser) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    triggerToast(`반갑습니다, ${loggedInUser.name} 수석님! 넥스트인 포털 연동 완료.`, 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    triggerToast('안전하게 로그아웃 세션 처리가 완료되었습니다.', 'info');
  };

  // Add recorded hours from Stopwatch
  const handleAddSavedHours = (hours: number) => {
    setSavedHoursThisWeek((prev) => Math.round((prev + hours) * 10) / 10);
  };

  // If session is logged out, block with custom Login Screen
  if (!isLoggedIn) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <LoginModal demoUser={INITIAL_DEMO_USER} onLoginSuccess={handleLoginSuccess} />
        <Toast toasts={toasts} onClose={removeToast} />
      </div>
    );
  }

  // Animation layout transitions configs
  const pageTransition = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.35, ease: 'easeOut' }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="bg-[#F8F9FA] dark:bg-[#121212] min-h-screen text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300 antialiased selection:bg-[#0066FF] selection:text-white">
        
        {/* Upper Fixed Glassmorphism Header */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/50 dark:border-zinc-800/80 transition-colors duration-300">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 md:hidden text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>
              
              <div className="w-8 h-8 rounded-lg bg-[#0066FF] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#0066FF]/20 select-none">
                N
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                  넥스트인 업무 대시보드
                  <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] font-bold px-1.5 py-0.5 rounded font-mono">B2B Core</span>
                </span>
                <p className="text-[10px] text-zinc-400 font-mono tracking-tighter leading-none">(주)넥스트인 플랫폼 기획 포털</p>
              </div>
            </div>

            {/* Quick Stats Ticker & Clock */}
            <div className="flex items-center gap-4.5">
              {/* Dynamic Ticking Clock */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200/30 dark:border-zinc-850 text-xs text-zinc-600 dark:text-zinc-300 font-mono">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>KST {currentTime || '00:00:00'}</span>
              </div>

              {/* Saved hours summary tag */}
              <div className="hidden sm:flex items-center gap-1 bg-[#0066FF]/5 text-[#0066FF] dark:text-[#3B82F6] font-semibold text-xs px-3 py-1.5 rounded-xl border border-[#0066FF]/10 font-sans">
                <Sparkles className="w-3.5 h-3.5 fill-[#0066FF] dark:fill-[#3B82F6] animate-pulse" />
                <span>주간 단축: <strong className="font-mono">{savedHoursThisWeek.toFixed(1)}h</strong></span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-sans hidden sm:inline-block">{user.name} 수석 PM</span>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-8 h-8 rounded-full overflow-hidden border border-zinc-100 hover:border-[#0066FF] transition-all cursor-pointer"
                  title="내 프로필 / 설정"
                >
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-16 z-30 bg-white dark:bg-zinc-950 w-64 border-r border-zinc-200 dark:border-zinc-900 md:hidden flex flex-col p-4 shadow-2xl"
            >
              <Sidebar 
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                user={user}
                onLogout={handleLogout}
                savedHoursThisWeek={savedHoursThisWeek}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer Container Limit constraints */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col pt-6 pb-12 relative">
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Sidebar Left Navigation Panel (shown on wide screens) */}
            <div className="hidden md:block">
              <Sidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                onLogout={handleLogout}
                savedHoursThisWeek={savedHoursThisWeek}
              />
            </div>

            {/* Main Interactive Workspaces */}
            <main className="flex-1 w-full min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageTransition}
                >
                  {activeTab === 'dashboard' && (
                    <DashboardView 
                      tasks={tasks}
                      user={user}
                      widgets={widgets}
                      onTriggerToast={triggerToast}
                      onAddSavedHours={handleAddSavedHours}
                      onNavigateToTab={setActiveTab}
                    />
                  )}

                  {activeTab === 'kanban' && (
                    <KanbanView 
                      tasks={tasks}
                      onAddTask={handleAddTask}
                      onUpdateTaskStatus={handleUpdateTaskStatus}
                      onDeleteTask={handleDeleteTask}
                      onUpdateProgress={handleUpdateProgress}
                      onTriggerToast={triggerToast}
                    />
                  )}

                  {activeTab === 'analytics' && (
                    <AnalyticsView />
                  )}

                  {activeTab === 'settings' && (
                    <SettingsView 
                      user={user}
                      onUpdateUser={setUser}
                      widgets={widgets}
                      onToggleWidget={handleToggleWidgetVisibility}
                      onMoveWidget={handleMoveWidget}
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                      currentPlan={currentPlan}
                      onSelectPlan={setCurrentPlan}
                      onTriggerToast={triggerToast}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

          </div>

          {/* Precise, stylized enterprise credit footer */}
          <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 mt-12">
            <div className="flex flex-col md:flex-row items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 font-mono">
              <p>© 2024 (주)넥스트인. All rights reserved.</p>
              <p>Architected & Developed by 정혁신 (Lead PM / Engineer)</p>
            </div>
          </footer>

        </div>

        {/* Global Floating Toast Notifiers */}
        <Toast toasts={toasts} onClose={removeToast} />

      </div>
    </div>
  );
}
