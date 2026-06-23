/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Settings, ToggleLeft, ToggleRight, Sparkles, Check, 
  HelpCircle, Eye, EyeOff, Building, Award, Landmark, 
  CreditCard, ArrowUpRight, Sun, Moon, ArrowUp, ArrowDown
} from 'lucide-react';
import { DemoUser, DashboardWidget } from '../types';
import { SUBSCRIPTION_PLANS, DEFAULT_WIDGETS } from '../data/mockData';

interface SettingsViewProps {
  user: DemoUser;
  onUpdateUser: (updatedUser: DemoUser) => void;
  widgets: DashboardWidget[];
  onToggleWidget: (id: string) => void;
  onMoveWidget: (id: string, direction: 'up' | 'down') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentPlan: string;
  onSelectPlan: (planId: string) => void;
  onTriggerToast: (text: string, type: 'success' | 'warning' | 'info') => void;
}

export default function SettingsView({
  user,
  onUpdateUser,
  widgets,
  onToggleWidget,
  onMoveWidget,
  darkMode,
  setDarkMode,
  currentPlan,
  onSelectPlan,
  onTriggerToast
}: SettingsViewProps) {
  // Local Profile State
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [dept, setDept] = useState(user.department);
  const [email, setEmail] = useState(user.email);

  // Billing interval selection
  const [isAnnual, setIsAnnual] = useState(true);

  // Payment mock loading states
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      role,
      department: dept,
      email
    });
    onTriggerToast('수석 파트너 정보가 프로덕션에 실시간 적용되었습니다.', 'success');
  };

  const handlePlanCheckoutSim = (planId: string, planName: string) => {
    if (planId === currentPlan) {
      onTriggerToast(`이미 현재 활성화되어 작동하고 있는 플랜입니다: [${planName}]`, 'info');
      return;
    }

    setProcessingPlanId(planId);
    onTriggerToast(`[${planName}] 결제 정보 보안 체크 진행 중...`, 'info');

    // Simulate PG payment gateway delays
    setTimeout(() => {
      onSelectPlan(planId);
      setProcessingPlanId(null);
      onTriggerToast(
        `신용카드 자동 청구 승인 완료! [${planName}] 라이선스가 계정에 완전히 통합되었습니다.`,
        'success'
      );
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: General Profile Setup, Theme, Widget Layout */}
        <div className="lg:col-span-6 space-y-6">
          {/* Profile form */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 mb-4">
              <User className="w-4.5 h-4.5 text-[#0066FF]" />
              수석 파트너 프로필 마스터 관리
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 font-mono">이름(NAME)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-850 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/25 focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 font-mono">업무 직책(ROLE)</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-850 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/25 focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 font-mono">소속 부서(DEPT)</label>
                  <input
                    type="text"
                    required
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-850 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/25 focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 font-mono">기획실 승인 이메일(EMAIL)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs text-zinc-850 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/25 focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[40px] bg-[#0066FF] hover:bg-[#0054D6] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  기획실 프로필 업데이트 저장
                </button>
              </div>
            </form>
          </div>

          {/* Theme Setup */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 mb-2">
              <Sun className="w-4.5 h-4.5 text-[#0066FF]" />
              전처리 테마 스위치 (다크 & 라이트)
            </h3>
            <p className="text-xs text-zinc-400 mb-4">화면 눈부심을 예방하여 업무 극대화를 돕습니다. 로컬 캐시 엔진에 자동 저장됩니다.</p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5">
                {darkMode ? <Moon className="w-4 h-4 text-[#0066FF]" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>{darkMode ? '다크 모드(Space Zinc) 활성' : '라이트 모드(Minimal Light) 활성'}</span>
              </span>

              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  onTriggerToast(`테마가 ${!darkMode ? 'Space Zinc' : 'Minimal Light'} 테마로 토글되었습니다.`, 'info');
                }}
                className="cursor-pointer"
                aria-label="Toggle Theme"
              >
                {darkMode ? (
                  <ToggleRight className="w-10 h-10 text-[#0066FF]" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-zinc-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Layout Customizer and positioning priority orders */}
        <div className="lg:col-span-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 mb-2">
                <Settings className="w-4.5 h-4.5 text-[#0066FF]" />
                메인 대시보드 위젯 순서 및 가용성 타일 조정
              </h3>
              <p className="text-xs text-zinc-400 mb-5">종합 대시보드 화면에 가동할 위젯의 숨김 상태를 토글하고, 화살표를 눌러 우선적 위아래 배치를 바꿉니다.</p>

              <div className="space-y-3">
                {widgets.map((widget, index) => {
                  return (
                    <div 
                      key={widget.id} 
                      className="p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-55 dark:bg-zinc-800/20 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">W-{widget.order}</span>
                        <span className={`font-semibold ${widget.visible ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-400 line-through'}`}>
                          {widget.title}
                        </span>
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center gap-2">
                        {/* Up button */}
                        <button
                          disabled={index === 0}
                          onClick={() => onMoveWidget(widget.id, 'up')}
                          className="p-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                        </button>
                        {/* Down button */}
                        <button
                          disabled={index === widgets.length - 1}
                          onClick={() => onMoveWidget(widget.id, 'down')}
                          className="p-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                        </button>

                        {/* Visibility check toggler */}
                        <button
                          onClick={() => {
                            onToggleWidget(widget.id);
                            onTriggerToast(`[${widget.title}] 위젯 표시 상태가 조정되었습니다.`, 'info');
                          }}
                          className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold ${
                            widget.visible 
                              ? 'bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF]/20' 
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                          } cursor-pointer`}
                        >
                          {widget.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span className="text-[10px]">{widget.visible ? '보기' : '숨김'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6 flex items-center justify-between text-xs text-zinc-400">
              <span>수선 수치 결합 모듈 V1.2</span>
              <span>배치 즉시 적용</span>
            </div>
          </div>
        </div>
      </div>

      {/* SaaS Pricing Plans Grid panel */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5" />
            <span>엔터프라이즈 B2B 임대 구독 보정형</span>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            넥스트인 스마트 인프라 SaaS 라이선스 플랜
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            한 달에 커피값 한 잔으로 업무 피로도를 완전히 해소하고 소중한 저녁 1시간 일찍 퇴근하십시오. 연 구독 시 <strong className="text-[#0066FF]">추가 20% 특별 우대 혜택</strong>을 자동 차등 적용합니다.
          </p>

          {/* Toggle month vs annual discount */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-xs ${!isAnnual ? 'font-bold text-[#0066FF]' : 'text-zinc-400'}`}>월 정기 구독</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-11 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 transition-colors relative focus:outline-none cursor-pointer"
            >
              <div 
                className={`w-4 h-4 rounded-full bg-[#0066FF] shadow-md transition-transform duration-300 transform ${isAnnual ? 'translate-x-5' : 'translate-x-0'}`} 
              />
            </button>
            <span className={`text-xs flex items-center gap-1 ${isAnnual ? 'font-bold text-[#0066FF]' : 'text-zinc-400'}`}>
              <span>연간 특별 우대</span>
              <span className="bg-emerald-500/15 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded font-extrabold">20% DC</span>
            </span>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const price = isAnnual ? plan.priceAnnually / 12 : plan.priceMonthly;
            const totalAnnually = plan.priceAnnually;

            return (
              <div 
                key={plan.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                  isCurrent 
                    ? 'border-2 border-[#0066FF] bg-[#0066FF]/5 shadow-md shadow-[#0066FF]/5' 
                    : 'border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-[#0066FF] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl tracking-tight flex items-center gap-1 font-mono uppercase shadow-xs">
                    <Sparkles className="w-3 h-3 fill-white" />
                    <span>POPULAR</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{plan.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-1">SaaS LICENSE CODE: {plan.id.toUpperCase()}</p>
                  </div>

                  {/* Pricing segment */}
                  <div className="py-2 border-y border-zinc-100 dark:border-zinc-800 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
                      ₩ {price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">/ 인당, 월</span>
                  </div>

                  {isAnnual && plan.priceAnnually > 0 && (
                    <div className="text-[10px] text-emerald-500 font-mono">
                      * 연간 총액 ₩ {totalAnnually.toLocaleString()} 청구 (20% 할인 반영됨)
                    </div>
                  )}

                  {/* Feature lists */}
                  <ul className="space-y-2.5 pt-2">
                    {plan.features.map((feat) => (
                      <li key={feat} className="text-xs text-zinc-800 dark:text-zinc-200 flex items-start gap-2.5 leading-relaxed">
                        <Check className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Submit button */}
                <div className="pt-6 mt-4.5">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handlePlanCheckoutSim(plan.id, plan.name)}
                    disabled={processingPlanId !== null}
                    className={`w-full min-h-[44px] rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                      isCurrent 
                        ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed' 
                        : 'bg-[#0066FF] text-white hover:bg-[#0054D6]'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>현재 플랜 활성화 작동중</span>
                      </>
                    ) : processingPlanId === plan.id ? (
                      <span>PG 금융망 암호화 지불 중...</span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>{plan.priceMonthly === 0 ? '무료 바로 체험' : '신용카드 결제 기용'}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
