/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Calendar, User, ArrowRight, ArrowLeft,
  CheckCircle2, AlertTriangle, Play, HelpCircle, Filter, 
  X, Tag, Check, Sparkles, ChevronDown
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';

interface KanbanViewProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTaskStatus: (id: string, newStatus: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onTriggerToast: (text: string, type: 'success' | 'warning' | 'info') => void;
}

export default function KanbanView({
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onUpdateProgress,
  onTriggerToast
}: KanbanViewProps) {
  // Modal State for adding task
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('정혁신');
  const [newPriority, setNewPriority] = useState<TaskPriority>('중');
  const [newStatus, setNewStatus] = useState<TaskStatus>('진행중');
  const [newDeadline, setNewDeadline] = useState('2026-07-05');
  const [newTags, setNewTags] = useState('기획, UI/UX');
  const [newDesc, setNewDesc] = useState('');

  // Filtering State
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Column Statuses
  const columns: { label: string; status: TaskStatus; color: string; border: string; bg: string }[] = [
    { label: '진행중 (In Progress)', status: '진행중', color: 'text-emerald-500', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
    { label: '보류 (On Hold)', status: '보류', color: 'text-amber-500', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
    { label: '지연/긴급 (Urgent)', status: '긴급', color: 'text-rose-500', border: 'border-rose-500/20', bg: 'bg-rose-500/5' },
    { label: '완료 (Completed)', status: '완료', color: 'text-zinc-500', border: 'border-zinc-500/20', bg: 'bg-zinc-100/5' }
  ];

  // Drag and Drop simulation handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    const id = e.dataTransfer.getData('taskId');
    if (id) {
      onUpdateTaskStatus(id, status);
      onTriggerToast(`업무 카드가 [${status}] 상태로 변경되었습니다.`, 'success');
    }
  };

  // Submit new task
  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onTriggerToast('업무 제목을 명확히 입력해 주십시오.', 'warning');
      return;
    }

    const taskTags = newTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const generatedId = `TSK-${Math.floor(100 + Math.random() * 900)}`;

    const freshTask: Task = {
      id: generatedId,
      title: newTitle,
      assignee: newAssignee,
      priority: newPriority,
      status: newStatus,
      deadline: newDeadline,
      progress: newStatus === '완료' ? 100 : 0,
      tags: taskTags.length ? taskTags : ['일반'],
      description: newDesc,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddTask(freshTask);
    setIsAddOpen(false);

    // Clear fields
    setNewTitle('');
    setNewDesc('');
    setNewTags('기획, UI/UX');
    onTriggerToast(`신규 업무 ${generatedId} 번 기안이 완료 데이터에 등록되었습니다.`, 'success');
  };

  // Unique assignees in existing list for filtering dropdown
  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignee)));

  // Filter and Search Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || task.assignee === filterAssignee;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPriority && matchesAssignee && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Strip */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4.5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="업무명, 태그 또는 ID 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
          />
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        </div>

        {/* Filter selection boxes */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400 font-bold font-mono">PRIORITY:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 focus:ring-2 focus:ring-[#0066FF]/10 focus:outline-none cursor-pointer"
            >
              <option value="all">전체 우선순위</option>
              <option value="상">상급 (Urgent)</option>
              <option value="중">중급 (Medium)</option>
              <option value="하">하급 (Low)</option>
            </select>
          </div>

          {/* Assignee filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400 font-bold font-mono">ASSIGNEE:</span>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 focus:ring-2 focus:ring-[#0066FF]/10 focus:outline-none cursor-pointer"
            >
              <option value="all">전체 담당자</option>
              {uniqueAssignees.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Add task trigger */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-[#0066FF] hover:bg-[#0054D6] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 ml-auto min-h-[40px] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>기안문 등재</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const columnTasks = filteredTasks.filter(t => t.status === col.status);

          return (
            <div
              key={col.status}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.status)}
              className={`rounded-2xl border ${col.border} ${col.bg} p-4.5 flex flex-col min-h-120 transition-all`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    col.status === '진행중' ? 'bg-[#10B981]' :
                    col.status === '보류' ? 'bg-[#F59E0B]' :
                    col.status === '긴급' ? 'bg-[#EF4444]' : 'bg-zinc-400'
                  }`} />
                  <h3 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{col.label}</h3>
                </div>
                <span className="text-xs bg-zinc-200/50 dark:bg-zinc-800/60 px-2.5 py-0.5 rounded-full font-bold font-mono text-zinc-600 dark:text-zinc-400">
                  {columnTasks.length}
                </span>
              </div>

              {/* Tasks List Container */}
              <div className="flex-1 space-y-4 overflow-y-auto max-h-144 pr-1">
                {columnTasks.length === 0 ? (
                  <div className="h-28 border-2 border-dashed border-zinc-200/40 dark:border-zinc-800/40 rounded-xl flex flex-col items-center justify-center text-center p-3">
                    <p className="text-xs text-zinc-400 font-medium">검검 결과 없음</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">이곳으로 카드를 마우스로 드래그 하십시오.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {columnTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 rounded-xl shadow-xs cursor-grab active:cursor-grabbing relative group transition-all"
                      >
                        {/* Task Priority & ID header */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-zinc-400 font-mono font-bold tracking-tight">{task.id}</span>
                          <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                            task.priority === '상' ? 'bg-rose-500/10 text-rose-500' :
                            task.priority === '중' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            우선순위: {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-snug line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Description */}
                        {task.description && (
                          <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {task.tags.map(tag => (
                              <span key={tag} className="text-[9px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-sans font-medium">
                                <Tag className="w-2.5 h-2.5" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Progress slider bar */}
                        {task.status !== '완료' && (
                          <div className="mt-3.5 space-y-1">
                            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                              <span>진척도 (PROGRESS)</span>
                              <span>{task.progress}%</span>
                            </div>
                            <div className="relative w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full bg-[#0066FF]" 
                                style={{ width: `${task.progress}%` }} 
                              />
                            </div>
                            {/* Slide-friendly buttons to adjust progress inside card */}
                            <div className="flex items-center justify-end gap-1.5 mt-1">
                              <button 
                                onClick={() => onUpdateProgress(task.id, Math.max(0, task.progress - 20))}
                                className="text-[9px] text-zinc-500 dark:text-zinc-400 px-1 bg-zinc-50 dark:bg-zinc-800 rounded hover:bg-zinc-100 transition-colors"
                              >
                                -20%
                              </button>
                              <button 
                                onClick={() => onUpdateProgress(task.id, Math.min(100, task.progress + 20))}
                                className="text-[9px] text-[#0066FF] px-1 bg-[#0066FF]/5 rounded hover:bg-[#0066FF]/10 transition-colors font-bold"
                              >
                                +20%
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Footer card info */}
                        <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-300">
                            <div className="w-5.5 h-5.5 rounded-full bg-[#0066FF]/10 flex items-center justify-center text-[10px] font-bold text-[#0066FF]">
                              {task.assignee.charAt(0)}
                            </div>
                            <span className="font-semibold text-[11px] font-sans text-zinc-600 dark:text-zinc-300">{task.assignee}</span>
                          </div>
                          <span className="text-[9px] text-zinc-400 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-400" />
                            {task.deadline}
                          </span>
                        </div>

                        {/* Action Control: move options for absolute reliability */}
                        <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="text-zinc-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                            title="타스크 폐기"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick movement selectors */}
                          <div className="flex items-center gap-1 font-mono">
                            {col.status !== '진행중' && (
                              <button 
                                onClick={() => {
                                  const prevStatuses: Record<TaskStatus, TaskStatus> = { '보류': '진행중', '긴급': '보류', '완료': '긴급', '진행중': '진행중' };
                                  onUpdateTaskStatus(task.id, prevStatuses[col.status]);
                                }}
                                className="p-0.5 bg-zinc-50 dark:bg-zinc-800 rounded text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                                title="이전 단계로 이동"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <span className="text-[10px] px-1 text-zinc-300 dark:text-zinc-500">이동</span>
                            {col.status !== '완료' && (
                              <button 
                                onClick={() => {
                                  const nextStatuses: Record<TaskStatus, TaskStatus> = { '진행중': '보류', '보류': '긴급', '긴급': '완료', '완료': '완료' };
                                  onUpdateTaskStatus(task.id, nextStatuses[col.status]);
                                }}
                                className="p-0.5 bg-zinc-50 dark:bg-zinc-800 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#0066FF] hover:text-white transition-colors cursor-pointer animate-pulse"
                                title="다음 단계로 이동"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide / Pop up Add Task Modal Dialog */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs" 
            />

            {/* Panel */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 shadow-2xl rounded-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">신규 사업 기안(Task) 등재</h3>
                    <p className="text-[10px] text-zinc-400 font-mono">NEXTIN Task Enterprise Schema</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitTask} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1 font-mono">기안 제목 (JOB TITLE)</label>
                  <input
                    type="text"
                    required
                    placeholder="업무 제목을 간결하고 명확히 적어주십시오..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm text-zinc-850 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                {/* Desc */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1 font-mono">상세 경위 (DESCRIPTION)</label>
                  <textarea
                    placeholder="해당 업무의 개요 및 목표 성과 지표(KPI)를 기재하십시오..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-850 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                {/* Grid fields */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Assignee */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1 font-mono">담당 수석 실무자 (ASSIGNEE)</label>
                    <select
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-850 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 text-zinc-800 dark:bg-zinc-950"
                    >
                      <option value="정혁신">정혁신 (Lead PM)</option>
                      <option value="김다운">김다운 (Server Engine)</option>
                      <option value="박진선">박진선 (UX Designer)</option>
                      <option value="이민수">이민수 (Mobile Hybrid)</option>
                    </select>
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1 font-mono">납기 마감일 (DEAD_LINE)</label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-850 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 text-zinc-800 dark:bg-zinc-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1 font-mono">긴급도 (PRIORITY)</label>
                    <div className="flex gap-2">
                      {(['상', '중', '하'] as TaskPriority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPriority(p)}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold select-none cursor-pointer ${
                            newPriority === p 
                              ? 'bg-[#0066FF] text-white border-[#0066FF]' 
                              : 'border-zinc-250 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Initial Status */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1 font-mono">가동 초기 상태 (INITIAL_STATUS)</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-850 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 text-zinc-800 dark:bg-zinc-950"
                    >
                      <option value="진행중">진행중 (In Progress)</option>
                      <option value="보류">보류 (On Hold)</option>
                      <option value="긴급">지연/긴급 (Urgent)</option>
                      <option value="완료">완료 (Completed)</option>
                    </select>
                  </div>
                </div>

                {/* Tags input */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1 font-mono">동적 태그 목록 (TAG_CSV)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="기획, UI/UX, 백엔드"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-850 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1 font-mono">쉼표(,)로 구분하여 입력하시면 개별 칩으로 디자인 분석됩니다.</p>
                </div>

                {/* Submits */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold cursor-pointer"
                  >
                    등재 철회
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0054D6] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>정식 기안 등재</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
