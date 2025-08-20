import React from 'react';
import { kpiColorClasses } from '../utils/ui';

interface KPIProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'teal';
  progress?: number; // 0..1
  sublabel?: string;
}

const KPI: React.FC<KPIProps> = ({ title, value, icon, color, progress, sublabel }) => {
  const c = kpiColorClasses(color);
  return (
    <div className={`bg-gradient-to-br ${c.container} p-6 rounded-xl border`}> 
      <div className="flex items-center justify-between mb-4">
        <div className={`${c.icon} p-3 rounded-full text-white`}>{icon}</div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${c.value}`}>{value}</p>
          <p className={`text-sm ${c.label}`}>{title}</p>
        </div>
      </div>
      {typeof progress === 'number' && (
        <div className={`${c.bar} h-2 rounded-full`}>
          <div className={`${c.barFill} h-2 rounded-full transition-all`} style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }} />
        </div>
      )}
      {sublabel && (
        <p className={`text-sm mt-2 ${c.label}`}>{sublabel}</p>
      )}
    </div>
  );
};

export default KPI;


