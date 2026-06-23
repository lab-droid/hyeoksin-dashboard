/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Clock, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { DemoUser } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: DemoUser;
  onLogout: () => void;
  savedHoursThisWeek: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  savedHoursThisWeek
}: SidebarProps) {
  // Navigation tabs
  const navItems = [
    { id: 'dashboard', label: '종합 대시보드', icon: LayoutDashboard },
    { id: 'kanban', label: '칸반 & 보드', icon: KanbanSquare },
    { id: 'analytics', label: '생산성 리포트', icon: BarChart3 },
    { id: 'settings', label: '설정 및 구독', icon: Settings },
  ];

  return (
    <aside className="w-68 shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200/50 dark:border-zinc-800/80 flex flex-col h-[calc(100vh-64px)] fixed md:sticky top-16 left-0 z-30 transition-all duration-300">
      {/* User Section */}
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3.5">
        <div className="relative">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-11 h-11 rounded-xl object-cover border-2 border-[#0066FF]/20"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-[-1px] right-[-1px] w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 tracking-tight truncate">{user.name}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">{user.role}</p>
          <p className="text-[10px] text-zinc-400 font-mono tracking-tighter truncate">{user.department}</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group min-h-[44px] cursor-pointer ${
                isActive 
                  ? 'bg-[#0066FF]/10 text-[#0066FF] font-semibold' 
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-[#0066FF]' : 'text-zinc-400'
                }`} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="w-1.5 h-1.5 rounded-full bg-[#0066FF]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Value statement card - Real interactive design metric */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[#0066FF]/5 to-[#10B981]/5 border border-zinc-100 dark:border-zinc-800/80 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-16 h-16 rounded-full bg-[#0066FF]/5 blur-lg" />
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-[#0066FF] shrink-0" />
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">생산성 향상 실증</span>
        </div>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
          이번주 정혁신 님이 절약한 집중 시간은 총 <span className="font-bold text-[#0066FF] font-mono text-sm">{savedHoursThisWeek.toFixed(1)}시간</span> 입니다.
        </p>
        <div className="mt-3 flex items-center gap-1 text-[10px] text-[#10B981] font-semibold">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>목표 대비 117% 달성 완료</span>
        </div>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all min-h-[44px] cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>시스템 세션 로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
