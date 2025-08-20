import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, DollarSign, Activity } from 'lucide-react';

const RealtimeMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeRequests: 47,
    avgResponseTime: 2.3,
    hourlyEarnings: 1847,
    allocationSuccess: 94.5,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeRequests: Math.max(20, prev.activeRequests + Math.floor((Math.random() - 0.5) * 10)),
        avgResponseTime: Math.max(1.0, Math.min(5.0, prev.avgResponseTime + (Math.random() - 0.5) * 0.5)),
        hourlyEarnings: Math.max(1000, prev.hourlyEarnings + Math.floor((Math.random() - 0.3) * 100)),
        allocationSuccess: Math.max(85, Math.min(98, prev.allocationSuccess + (Math.random() - 0.5) * 2)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metricsData = [
    {
      label: 'Active Requests',
      value: metrics.activeRequests,
      icon: Activity,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      change: '+12%'
    },
    {
      label: 'Response Time',
      value: `${metrics.avgResponseTime.toFixed(1)}s`,
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-100',
      change: '-8%'
    },
    {
      label: 'Hourly Earnings',
      value: `₹${metrics.hourlyEarnings}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      change: '+15%'
    },
    {
      label: 'Success Rate',
      value: `${metrics.allocationSuccess.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-100',
      change: '+2%'
    },
  ];

  return (
    <div className="space-y-4">
      {metricsData.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className={`${metric.bg} p-2 rounded-lg`}>
                <Icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="text-xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-green-600">{metric.change}</span>
            </div>
          </div>
        );
      })}

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">System Status</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">API Health</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Allocation Engine</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-600 font-medium">Running</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Map Services</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeMetrics;