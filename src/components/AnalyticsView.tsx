/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Clock, Target, Calendar, Sparkles, AlertCircle, 
  Zap, Award, CheckCircle
} from 'lucide-react';
import { WEEKLY_SAVED_HOURS, TEAM_SAVED_HOURS, ZERO_LAG_TREND } from '../data/mockData';

export default function AnalyticsView() {
  // Aggregate stats
  const totalSavedHoursObj = WEEKLY_SAVED_HOURS.reduce((acc, curr) => acc + curr.savedHours, 0);
  const avgEfficiency = Math.round(
    WEEKLY_SAVED_HOURS.reduce((acc, curr) => acc + curr.efficiency, 0) / WEEKLY_SAVED_HOURS.length
  );
  const lowestLagSecsObj = ZERO_LAG_TREND[ZERO_LAG_TREND.length - 1].lagMinutes; // should be 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Top Telemetry Metric Ribbons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold font-mono tracking-wider block">WEEKLY TIME SHAVED</span>
            <span className="text-2xl font-extrabold text-[#0066FF] font-mono tracking-tight mt-1 inline-block">
              {totalSavedHoursObj.toFixed(1)} h
            </span>
            <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
              <Sparkles className="w-3 h-3 text-emerald-500 fill-emerald-500" />
              <span>일 평균 1.72시간 누적 단축</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[#0066FF]/10 text-[#0066FF] flex items-center justify-center">
            <Clock className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold font-mono tracking-wider block">AVG DEPT EFFICIENCY</span>
            <span className="text-2xl font-extrabold text-emerald-500 font-mono tracking-tight mt-1 inline-block">
              {avgEfficiency}%
            </span>
            <div className="text-[10px] text-zinc-400 font-medium mt-1">
              기준 생산성 지표(100%) 대비 초과 가동
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Zap className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold font-mono tracking-wider block">CURRENT DELAY MIN</span>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight mt-1 inline-block">
              {lowestLagSecsObj} min
            </span>
            <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>완전한 업무 지연 제로화 완성</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Target className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main telemetry analysis: 요일별 절약/완료량 */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                요일별 완료 업무 및 누적 시간 세부 트래킹
              </h3>
              <p className="text-xs text-zinc-400 mt-1">금요일 성과로 치닫을수록 시각적 단축 가용 시간이 현격히 증폭됨을 증명합니다.</p>
            </div>
            <span className="text-xs text-[#0066FF] font-mono font-bold bg-[#0066FF]/10 px-2.5 py-1 rounded">NextIn Standard</span>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_SAVED_HOURS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    color: '#f9fafb', 
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px'
                  }} 
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="savedHours" name="절약한 업무 집중 시간(h)" fill="#0066FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completedTasks" name="실제로 완료 완료 건수" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic efficiency card block */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">금주 최우수 효율 부서 리포트</h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <strong>플랫폼 기획실(정혁신 Lead PM 소속)</strong>이 전주 대비 평균 지연율을 94% 개선하여 금주 넥스트인 효율 영예 부서로 지정되었습니다.
            </p>

            {/* Micro badges listing */}
            <div className="mt-5 space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-between">
                <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">1일 1시간 단축률</span>
                <span className="text-xs font-bold text-amber-600 font-mono">112% 초과 만족</span>
              </div>

              <div className="p-3 rounded-xl bg-[#0066FF]/5 border border-[#0066FF]/10 flex items-center justify-between">
                <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">칸반 보드 병목 제거</span>
                <span className="text-xs font-bold text-[#0066FF] font-mono">98.2% 완충</span>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4">
            <span className="text-[10px] text-zinc-400 font-mono tracking-tighter">NEXTIN EFFICIENCY ALIGNMENT LOG</span>
            <p className="text-[11px] text-[#10B981] font-semibold mt-1">시스템 권고안: 현재 흐름을 3주째 유지하십시오.</p>
          </div>
        </div>

        {/* 4-week Zero Delay progress trend chart */}
        <div className="col-span-12 lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                최근 4주간 업무 지연 제로화(Zero-Lag) 전개 추이
              </h3>
              <p className="text-xs text-zinc-400 mt-1">도입 첫 주의 지연시간(120분)을 거쳐 최종 4주차에 지연 0분을 실증 달성하였습니다.</p>
            </div>
            <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-mono font-bold">ZERO LAG</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ZERO_LAG_TREND} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    color: '#f9fafb', 
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="lagMinutes" name="업무 지연 이탈 시간(분)" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLag)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team productivity track table */}
        <div className="col-span-12 lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4">
            개인별 1시간 단축 검증 텔레메트리 상세 대장
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 font-bold font-mono">
                  <th className="pb-3 font-semibold">담당자 (PARTNER)</th>
                  <th className="pb-3 text-right font-semibold">누적 절감(h)</th>
                  <th className="pb-3 text-right font-semibold">완료율(%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                {TEAM_SAVED_HOURS.map((member) => (
                  <tr key={member.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                    <td className="py-3 font-semibold text-zinc-800 dark:text-zinc-200">{member.name}</td>
                    <td className="py-3 text-right font-mono font-bold text-[#0066FF]">{member.saved} h</td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-500">{member.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/20 mt-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              본 정밀 데이터는 넥스트인 인트라넷 보안 프레임워크를 기반으로 임대 가동되는 실시간 분석 보고입니다. 외부로 유출될 수 없습니다.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
