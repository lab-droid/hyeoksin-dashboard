/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export default function Toast({ toasts, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }: { key?: string; toast: ToastMessage; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const config = {
    success: {
      bg: 'bg-white dark:bg-zinc-950 border-emerald-200 dark:border-emerald-800/50',
      iconColor: 'text-emerald-500',
      icon: CheckCircle2,
      progress: 'bg-emerald-500',
    },
    warning: {
      bg: 'bg-white dark:bg-zinc-950 border-amber-200 dark:border-amber-800/50',
      iconColor: 'text-amber-500',
      icon: AlertTriangle,
      progress: 'bg-amber-500',
    },
    info: {
      bg: 'bg-white dark:bg-zinc-950 border-blue-200 dark:border-blue-800/50',
      iconColor: 'text-blue-500',
      icon: Info,
      progress: 'bg-blue-500',
    },
  }[toast.type];

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
      layout
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${config.bg} relative overflow-hidden`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
      <div className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200 pr-4">
        {toast.text}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-100 dark:bg-zinc-900">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 4, ease: 'linear' }}
          className={`h-full ${config.progress}`}
        />
      </div>
    </motion.div>
  );
}
