/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DemoUser, Task, SubscriptionPlan, ProductivityRecord, DashboardWidget } from '../types';

export const INITIAL_DEMO_USER: DemoUser = {
  name: '정혁신',
  role: 'Lead Project Manager',
  department: '플랫폼 기획실',
  company: '(주)넥스트인',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'info@nextin.ai.kr'
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'TSK-101',
    title: '차세대 업무 몰입도 향상 ERP 플랫폼 고도화 기획',
    assignee: '정혁신',
    priority: '상',
    status: '진행중',
    deadline: '2026-07-15',
    progress: 75,
    tags: ['기획', 'ERP', 'UI/UX'],
    description: '전사적 자원 관리를 넘어 업무 집중도를 획기적으로 상승시키는 차세대 ERP 레이아웃 기획 및 와이어프레임 설계.',
    createdAt: '2026-06-10'
  },
  {
    id: 'TSK-102',
    title: 'Core 데이터 파이프라인 모니터링 텔레메트리 모듈 이식',
    assignee: '김다운',
    priority: '상',
    status: '긴급',
    deadline: '2026-06-28',
    progress: 90,
    tags: ['백엔드', '모니터링', 'Core'],
    description: '대용량 트래픽 처리를 위한 핵심 버스 로직의 병목 현상을 실시간 모니터링하고 시각적 경보를 발동하는 시스템.',
    createdAt: '2026-06-12'
  },
  {
    id: 'TSK-103',
    title: 'Framer Motion 활용 인터랙티브 메인 대시보드 모션 검증',
    assignee: '정혁신',
    priority: '중',
    status: '진행중',
    deadline: '2026-07-01',
    progress: 45,
    tags: ['프론트엔드', '애니메이션', 'UX'],
    description: '사용자 인터랙션 시 부드럽고 품격 있는 응답성을 제공하는 최적의 가혹 마운트 애니메이션 프레이밍 설계 및 성능 정밀 튜닝.',
    createdAt: '2026-06-18'
  },
  {
    id: 'TSK-104',
    title: '글로벌 비즈니스용 B2B SaaS 결제 게이트웨이 연동',
    assignee: '박진선',
    priority: '상',
    status: '보류',
    deadline: '2026-08-10',
    progress: 20,
    tags: ['결제', 'SaaS', '글로벌'],
    description: 'Stripe 및 국내 유수 한화 결제 대행사와 연동하는 다중 통화 지원 인앱 결제 프로토타입 설계 및 승인 프로세스 준비.',
    createdAt: '2026-06-15'
  },
  {
    id: 'TSK-105',
    title: '넥스트인 인트라넷 모바일 하이브리드 최적화 검토',
    assignee: '이민수',
    priority: '하',
    status: '완료',
    deadline: '2026-06-20',
    progress: 100,
    tags: ['모바일', '하이브리드', '웹뷰'],
    description: '모바일 웹 브라우저 및 안드로이드 웹뷰 상에서 네이티브 수준의 제스처 감도를 구현하기 위한 터치 이벤트 최적화 완료.',
    createdAt: '2026-06-05'
  },
  {
    id: 'TSK-106',
    title: '인공지능 기반 업무 자동 분류 엔진 스키마 검토 및 파일럿 빌드',
    assignee: '김다운',
    priority: '중',
    status: '진행중',
    deadline: '2026-07-20',
    progress: 60,
    tags: ['AI', '자동화', '스키마'],
    description: '텍스트 마이닝 기법을 활용하여 일일 업무 내역을 분석해 카테고리를 자동 분배해주는 지능형 라벨러 파일럿 개발.',
    createdAt: '2026-06-14'
  }
];

// Recharts 요일별/주간 생산성 데이터 (일 평균 1시간 이상 단축 달성 입증)
export const WEEKLY_SAVED_HOURS: ProductivityRecord[] = [
  { name: '월요일', completedTasks: 4, savedHours: 1.1, efficiency: 110, lagTime: 45 },
  { name: '화요일', completedTasks: 6, savedHours: 1.4, efficiency: 125, lagTime: 20 },
  { name: '수요일', completedTasks: 5, savedHours: 1.6, efficiency: 135, lagTime: 10 },
  { name: '목요일', completedTasks: 8, savedHours: 2.1, efficiency: 150, lagTime: 5 },
  { name: '금요일', completedTasks: 7, savedHours: 2.4, efficiency: 165, lagTime: 0 } // 지연 Zero
];

export const TEAM_SAVED_HOURS = [
  { name: '정혁신 (PM)', saved: 8.5, rate: 98, tasks: 18 },
  { name: '김다운 (Engine)', saved: 7.2, rate: 94, tasks: 14 },
  { name: '박진선 (UX/PG)', saved: 5.8, rate: 88, tasks: 11 },
  { name: '이민수 (Mobile)', saved: 6.1, rate: 91, tasks: 15 }
];

export const ZERO_LAG_TREND = [
  { name: '1주차', lagMinutes: 120, satisfaction: 80 },
  { name: '2주차', lagMinutes: 80, satisfaction: 87 },
  { name: '3주차', lagMinutes: 30, satisfaction: 94 },
  { name: '4주차', lagMinutes: 0, satisfaction: 99 } // 업무 지연 제로화 달성
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'NextIn Starter',
    priceMonthly: 0,
    priceAnnually: 0,
    features: [
      '기본 업무 대시보드 조회',
      '칸반 보드 업무 관리 (최대 10개 카드)',
      '실시간 일간 타스크 통계 정보',
      '기본 단 패널 스터디 타이머 보드'
    ]
  },
  {
    id: 'pro',
    name: 'NextIn Smart Pro',
    priceMonthly: 12000,
    priceAnnually: 115200, // 20% 할인 (12000 * 12 * 0.8)
    isPopular: true,
    features: [
      '무제한 칸반 보드 및 타스크 관리',
      '생산성 분석 텔레메트리 리포트 (Recharts 연동)',
      '일 평균 1시간 단축 AI 트래킹 어드바이저',
      '커스터마이징 가능한 대시보드 위젯 배치 구성',
      '24/7 PM 전문 채널 지원 및 텔레메트리 통합',
      '전체 테마 (다크 & 라이트) 자동 저장 영속화'
    ]
  },
  {
    id: 'enterprise',
    name: 'NextIn Client Enterprise',
    priceMonthly: 49000,
    priceAnnually: 470400, // 20% 할인
    features: [
      'Pro 패키지의 모든 서비스 포함',
      '독립 클라우드 테넌트 인스턴스 배정',
      '전사적 가동 현황 실시간 감시 포털 지원',
      'SAML/SSO Single Sign-On 보안 로그인 결합',
      '전담 솔루션 아키텍트(정혁신 Lead PM) direct 지원',
      'B2B 결제 전용 커스텀 세금계산서 정산 게이트웨이'
    ]
  }
];

export const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'summary', title: '실시간 퀵 요약 리포트', visible: true, order: 1 },
  { id: 'timer', title: '집중도 생산성 스톱워치', visible: true, order: 2 },
  { id: 'graph', title: '일 평균 단축시간 시각 지표 (Recharts)', visible: true, order: 3 },
  { id: 'recent_tasks', title: '최근 등록 고해상도 타스크', visible: true, order: 4 },
  { id: 'efficiency_meter', title: '부서별 업무 지연 극복 텔레메트리', visible: true, order: 5 }
];
