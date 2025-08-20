import React from 'react';
import { getCategoryPillClass, getStatusPillClass } from '../utils/ui';

export const StatusPill: React.FC<{ value: string; className?: string }> = ({ value, className }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusPillClass(value)} ${className || ''}`}>{value}</span>
);

export const CategoryPill: React.FC<{ value: string; className?: string }> = ({ value, className }) => (
  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryPillClass(value)} ${className || ''}`}>{value}</span>
);


