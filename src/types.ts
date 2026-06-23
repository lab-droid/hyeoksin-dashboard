/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskPriority = '상' | '중' | '하';

export type TaskStatus = '진행중' | '보류' | '긴급' | '완료';

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  progress: number; // 0 to 100
  tags: string[];
  description?: string;
  createdAt: string;
}

export interface DemoUser {
  name: string;
  role: string;
  department: string;
  company: string;
  avatarUrl: string;
  email: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  features: string[];
  isPopular?: boolean;
}

export interface ProductivityRecord {
  name: string; // 요일 or 주 구분
  completedTasks: number;
  savedHours: number;
  efficiency: number; // %
  lagTime: number; // 지연 시간(분)
}
