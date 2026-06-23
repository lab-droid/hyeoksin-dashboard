/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { 
  Play, Pause, RotateCcw, Clock, AlertTriangle, CheckCircle2, 
  ListTodo, Cpu, ChevronRight, ArrowUpRight, Sparkles, TrendingUp,
  LayoutDashboard, User, EyeOff
} from 'lucide-react';
import { Task, DemoUser, DashboardWidget } from '../types';
import { WEEKLY_SAVED_HOURS, TEAM_SAVED_HOURS } from '../data/mockData';

interface DashboardViewProps {
  tasks: Task[];
  user: DemoUser;
  widgets: DashboardWidget[];
  onTriggerToast: (text: string, type: 'success' | 'warning' | 'info') => void;
  onAddSavedHours: (hours: number) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardView({
  tasks,
  user,
  widgets,
  onTriggerToast,
  onAddSavedHours,
  onNavigateToTab
}: DashboardViewProps) {
  // Timer/Stopwatch State
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    onTriggerToast(
      isRunning ? '집중 세션이 일시 중지되었습니다.' : '생산성 향상 집중 정밀 타이머 가동!',
      'info'
    );
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    onTriggerToast('타이머가 초기화되었습니다.', 'info');
  };

  const handleSaveSession = () => {
    if (time < 5) {
      onTriggerToast('충분한 집중 데이터가 쌓이지 않았습니다. (최소 5초)', 'warning');
      return;
    }
    // Convert simulated time to saved hours. E.g. every 10 seconds is 0.2 hours saved in SaaS telemetry!
    const simulatedSavedHours = Math.round((time / 20) * 10) / 10 || 0.1;
    onAddSavedHours(simulatedSavedHours);
    onTriggerToast(
      `집중 세션 저장 완료! 약 ${simulatedSavedHours}시간의 업무 생산성을 단축시켰습니다.`,
      'success'
    );
    setTime(0);
    setIsRunning(false);
  };

  // Format stopwatch time (HH:MM:SS)
  const formatTime = (secs: number) => {
    const hh = Math.floor(secs / 3600).toString().padStart(2, '0');
    const mm = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const ss = (secs % 60).toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  // Stats Calculations
  const totalTasks = tasks.length;
  const inProgress = tasks.filter(t => t.status === '진행중').length;
  const urgent = tasks.filter(t => t.status === '긴급').length;
  const completed = tasks.filter(t => t.status === '완료').length;
  const avgProgress = totalTasks > 0 
    ? Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / totalTasks)
    : 0;

  // Sorting Widgets by Order
  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Upper Welcoming Banner */}
      <div className="bg-gradient-to-r from-[#0066FF] to-[#004ECC] rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-[-30%] right-[-10%] w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[40%] w-48 h-48 rounded-full bg-[#10B981]/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 bg-white/10 text-white text-xs px-3 py-1 rounded-full w-max mb-3 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>실시간 B2B 엔터프라이즈 모니터링 활성</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              반갑습니다, {user.name} 수석님
            </h2>
            <p className="text-sm text-white/80 mt-1 max-w-xl">
              {user.company} {user.department}은 현재 <strong>일 평균 1시간 단축 목표</strong>를 안정적으로 지속하고 있습니다. 칸반 보드와 핵심 지표를 통합 관리하십시오.
            </p>
          </div>
          <button 
            onClick={() => onNavigateToTab('kanban')}
            className="px-4.5 py-2.5 bg-white text-[#0066FF] hover:bg-zinc-100 rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 shrink-0 grow-0 min-h-[44px] cursor-pointer"
          >
            <span>업무 칸반 보드로 이동</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Render Widgets Loop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {sortedWidgets.map((widget) => {
          if (!widget.visible) return null;

          switch (widget.id) {
            case 'summary':
              return (
                <div key={widget.id} className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* KPI Card 1 */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 font-mono">전체 등록 업무</p>
                      <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">{totalTasks}</h4>
                      <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        <span>전주 대비 +2건</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-[#0066FF] shrink-0">
                      <ListTodo className="w-5 h-5" />
                    </div>
                  </div>

                  {/* KPI Card 2 */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 font-mono">진행중인 업무</p>
                      <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">{inProgress}</h4>
                      <p className="text-[10px] text-[#0066FF] font-semibold">
                        <span>전체 목록의 {totalTasks ? Math.round((inProgress / totalTasks) * 100) : 0}%</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center text-orange-500 shrink-0">
                      <Cpu className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                  {/* KPI Card 3 */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 font-mono">지연/긴급 업무</p>
                      <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">{urgent}</h4>
                      <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                        <span>신속 조치 필요</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center text-rose-500 shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>

                  {/* KPI Card 4 */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 font-mono">종합 평균 진척도</p>
                      <h4 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">{avgProgress}%</h4>
                      <div className="w-18 bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div className="bg-[#10B981] h-full" style={{ width: `${avgProgress}%` }} />
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );

            case 'timer':
              return (
                <div key={widget.id} className="col-span-12 lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#0066FF]" />
                        집중도 생산성 스톱워치
                      </h3>
                      <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-bold font-mono">ONLINE</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                      실제 업무에 돌입하기 전, 타이머를 켜고 몰입하십시오. 집중 시간이 기록되면 마스터 텔레메트리 데이터에 즉시 누적 결산됩니다. (20초=1시간 실증)
                    </p>
                  </div>

                  <div className="py-6 flex flex-col items-center justify-center">
                    <div className="text-4xl font-extrabold font-mono text-zinc-900 dark:text-zinc-50 tracking-widest bg-zinc-50 dark:bg-zinc-800/30 px-6 py-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-inner mb-4">
                      {formatTime(time)}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleStartPause}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[40px] cursor-pointer ${
                          isRunning 
                            ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                            : 'bg-[#0066FF] hover:bg-[#0054D6] text-white'
                        }`}
                      >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isRunning ? '일시 정지' : '기록 가동'}</span>
                      </button>

                      <button
                        onClick={handleReset}
                        disabled={time === 0}
                        className="p-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 rounded-xl transition-colors disabled:opacity-40 min-h-[40px] cursor-pointer"
                        title="초기화"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleSaveSession}
                        disabled={time === 0}
                        className="px-3.5 py-2 bg-[#10B981] hover:bg-[#0E9F6E] disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors min-h-[40px] cursor-pointer"
                      >
                        집중 시간 영속 저장
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3.5 mt-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span>Target Speed: x240 (Demo mode)</span>
                    <span>1h saved target metric</span>
                  </div>
                </div>
              );

            case 'graph':
              return (
                <div key={widget.id} className="col-span-12 lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#0066FF]" />
                        일간 생산성 및 단축 시간 추이 텔레메트리
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">매일 1.5시간 이상의 집중 몰입으로 생산성을 실증하는 라이브 차트 (Recharts 연동)</p>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">단위: 시간(h)</span>
                  </div>

                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={WEEKLY_SAVED_HOURS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            color: '#f9fafb', 
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '12px'
                          }} 
                        />
                        <Area type="monotone" dataKey="savedHours" name="누적 절약 시간(h)" stroke="#0066FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSaved)" />
                        <Area type="monotone" dataKey="completedTasks" name="완료 업무수" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorEfficiency)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" /> 절약 시간</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> 완료 타스크 건수</span>
                    <span className="font-mono text-[10px]">목표치 '1일 1시간 단축' 연속 12일 달성중</span>
                  </div>
                </div>
              );

            case 'recent_tasks':
              return (
                <div key={widget.id} className="col-span-12 lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      최근 핵심 업무 가용 목록
                    </h3>
                    <button 
                      onClick={() => onNavigateToTab('kanban')}
                      className="text-xs text-[#0066FF] font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>전체 보기</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-68 overflow-y-auto pr-1">
                    {tasks.slice(0, 4).map((task) => {
                      const priorityColor = {
                        '상': 'bg-rose-500/10 text-rose-500 text-[10px]',
                        '중': 'bg-amber-500/10 text-amber-500 text-[10px]',
                        '하': 'bg-zinc-500/10 text-zinc-500 text-[10px]'
                      }[task.priority];

                      const statusColor = {
                        '진행중': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
                        '보류': 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
                        '긴급': 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
                        '완료': 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                      }[task.status];

                      return (
                        <div 
                          key={task.id} 
                          className="p-3 bg-zinc-50 dark:bg-zinc-800/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 rounded-xl transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 font-bold shrink-0">{task.id}</span>
                              <span className={`px-2 py-0.5 rounded-full font-bold ${priorityColor} shrink-0`}>우선순위: {task.priority}</span>
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${statusColor} shrink-0`}>{task.status}</span>
                            </div>
                            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{task.title}</h4>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">{task.assignee}</span>
                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">D-Day {task.deadline}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );

            case 'efficiency_meter':
              return (
                <div key={widget.id} className="col-span-12 lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      부서 인원별 실제 단축 텔레메트리
                    </h3>
                    <span className="text-xs font-mono text-[#0066FF] font-bold">주간 통계</span>
                  </div>

                  <div className="space-y-4">
                    {TEAM_SAVED_HOURS.map((item) => (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-zinc-700 dark:text-zinc-300">{item.name}</span>
                          <span className="text-zinc-500 dark:text-zinc-400 font-mono">
                            주당 <strong className="text-[#0066FF]">{item.saved}h</strong> 절감 ({item.tasks}건 완료)
                          </span>
                        </div>
                        <div className="relative w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#0066FF] to-[#10B981] transition-all duration-500"
                            style={{ width: `${item.rate}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-zinc-400 font-mono">
                          <span>업무 몰입 지수: {item.rate}%</span>
                          <span>목표치 6.0h 대비 초과 달성</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </motion.div>
  );
}
