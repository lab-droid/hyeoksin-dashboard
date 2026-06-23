/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Mail, Lock, User, LayoutDashboard, ArrowRight } from 'lucide-react';
import { DemoUser } from '../types';

interface LoginModalProps {
  onLoginSuccess: (user: DemoUser) => void;
  demoUser: DemoUser;
}

export default function LoginModal({ onLoginSuccess, demoUser }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(demoUser.email);
  const [password, setPassword] = useState('nextin1234!');
  const [fullName, setFullName] = useState(demoUser.name);
  const [role, setRole] = useState(demoUser.role);
  const [dept, setDept] = useState(demoUser.department);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: isSignUp ? fullName : demoUser.name,
      role: isSignUp ? role : demoUser.role,
      department: isSignUp ? dept : demoUser.department,
      company: demoUser.company,
      avatarUrl: demoUser.avatarUrl,
      email: email,
    });
  };

  const handleDemoInstant = () => {
    onLoginSuccess(demoUser);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] dark:bg-[#121212] p-4 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Decorative Radial Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0066FF]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#10B981]/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden p-8 sm:p-10 relative"
      >
        {/* Header Indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#0066FF] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#0066FF]/20">
            N
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-1.5">
              넥스트인 업무 대시보드
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] font-medium">SaaS Platform</span>
            </h1>
            <p className="text-xs text-zinc-400 font-mono">넥스트인 플랫폼 기획실 주도 업무 효율 솔루션</p>
          </div>
        </div>

        {/* Dynamic Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {isSignUp ? '신규 파트너 회원가입' : '일 평균 1시간 단축 솔루션'}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isSignUp 
              ? '생산성을 실시간으로 확인하는 맞춤 대시보드 계정을 등록하십시오.' 
              : '업무 집중도와 생산성을 한곳에서 시큐어하게 가동하십시오.'}
          </p>
        </div>

        {/* Enterprise Welcome Card */}
        <div className="mb-6 p-4 rounded-xl bg-[#0066FF]/5 border border-[#0066FF]/10 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            <span className="font-semibold text-zinc-800 dark:text-zinc-100">B2B SaaS 마스터 추천:</span> 본 플랫폼은 업무 지연을 0으로 유도하는 맞춤 텔레메트리 대시보드입니다. 무료 데모 모드를 바로 활용할 수 있습니다.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">이름 (FULL NAME)</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] text-zinc-800 dark:text-zinc-100 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">직책 (ROLE)</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="수석 개발자"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] text-zinc-800 dark:text-zinc-100 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">소속 부서 (DEPT)</label>
                  <input
                    type="text"
                    required
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="플랫폼 개발본부"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] text-zinc-800 dark:text-zinc-100 transition-all font-sans"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5 font-mono">업무 이메일 (EMAIL ADDR)</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@nextin.ai.kr"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] text-zinc-800 dark:text-zinc-100 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-mono">암호 비밀번호 (PASSWORD)</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => alert('임시 패스워드는 nextin1234! 입니다.')}
                  className="text-xs text-[#0066FF] font-medium hover:underline"
                >
                  분실하셨나요?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] text-zinc-800 dark:text-zinc-100 transition-all font-mono"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full min-h-[44px] bg-[#0066FF] text-white hover:bg-[#0054D6] rounded-xl font-semibold text-sm transition-colors shadow-md shadow-[#0066FF]/15 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isSignUp ? '가입 완료 및 로그인' : '포털 암호 입력 로그인'}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>

        {/* High-Fidelity Demo Quick Entry Button */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800/80"></div>
          </div>
          <span className="relative px-3 bg-white dark:bg-zinc-900 text-xs text-zinc-400 font-mono">OR DIRECT MOCK TRIAL</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleDemoInstant}
          type="button"
          className="w-full min-h-[44px] bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-zinc-200/50 dark:border-zinc-700/30 cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4 text-[#0066FF]" />
          <span>{demoUser.name} 수석 계정으로 즉시 체험</span>
        </motion.button>

        {/* Footer info inside Card */}
        <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>본 데모는 Local-first 영속성 데이터를 준수합니다.</span>
        </div>

        {/* Toggle sign up / sign in */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
          >
            {isSignUp ? '대시보드 로그인으로 돌아가기' : '플랫폼 파트너 신규 가입'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
