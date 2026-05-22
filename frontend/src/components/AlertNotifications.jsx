'use client';
import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

export default function AlertNotifications() {
  const { alerts } = useApp();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {alerts.map((alert) => {
        let bg = 'bg-white border-gold';
        let icon = <Info className="text-gold h-5 w-5 shrink-0" />;

        if (alert.type === 'success') {
          bg = 'bg-green-50 border-green-300 text-green-800';
          icon = <CheckCircle className="text-green-500 h-5 w-5 shrink-0" />;
        } else if (alert.type === 'error') {
          bg = 'bg-red-50 border-red-300 text-red-800';
          icon = <XCircle className="text-red-500 h-5 w-5 shrink-0" />;
        } else if (alert.type === 'info') {
          bg = 'bg-blue-50 border-blue-300 text-blue-800';
          icon = <Info className="text-blue-500 h-5 w-5 shrink-0" />;
        }

        return (
          <div
            key={alert.id}
            className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 ${bg}`}
          >
            {icon}
            <p className="text-sm font-medium">{alert.message}</p>
          </div>
        );
      })}
    </div>
  );
}
