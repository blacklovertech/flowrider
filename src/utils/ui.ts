export type CategoryKey = 'food' | 'grocery' | 'courier' | 'taxi' | 'errands';

export function getStatusPillClass(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'busy':
      return 'bg-yellow-100 text-yellow-800';
    case 'offline':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getCategoryPillClass(category: string): string {
  switch (category) {
    case 'food':
      return 'bg-orange-100 text-orange-800';
    case 'grocery':
      return 'bg-green-100 text-green-800';
    case 'courier':
      return 'bg-blue-100 text-blue-800';
    case 'taxi':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function kpiColorClasses(color: 'blue' | 'green' | 'purple' | 'teal') {
  const map = {
    blue: {
      container: 'from-blue-50 to-blue-100 border-blue-200',
      icon: 'bg-blue-600',
      value: 'text-blue-700',
      label: 'text-blue-600',
      bar: 'bg-blue-600',
      barFill: 'bg-blue-400'
    },
    green: {
      container: 'from-green-50 to-green-100 border-green-200',
      icon: 'bg-green-600',
      value: 'text-green-700',
      label: 'text-green-600',
      bar: 'bg-green-600',
      barFill: 'bg-green-400'
    },
    purple: {
      container: 'from-purple-50 to-purple-100 border-purple-200',
      icon: 'bg-purple-600',
      value: 'text-purple-700',
      label: 'text-purple-600',
      bar: 'bg-purple-600',
      barFill: 'bg-purple-400'
    },
    teal: {
      container: 'from-teal-50 to-teal-100 border-teal-200',
      icon: 'bg-teal-600',
      value: 'text-teal-700',
      label: 'text-teal-600',
      bar: 'bg-teal-600',
      barFill: 'bg-teal-400'
    }
  } as const;
  return map[color];
}


