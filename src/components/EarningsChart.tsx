import React from 'react';
import { TrendingUp } from 'lucide-react';

const EarningsChart = () => {
  const dailyEarnings = [
    { day: 'Mon', amount: 15200 },
    { day: 'Tue', amount: 18500 },
    { day: 'Wed', amount: 16800 },
    { day: 'Thu', amount: 21200 },
    { day: 'Fri', amount: 19800 },
    { day: 'Sat', amount: 24500 },
    { day: 'Sun', amount: 22100 },
  ];

  const maxAmount = Math.max(...dailyEarnings.map(d => d.amount));

  return (
    <div className="h-64">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="text-sm text-gray-600">Last 7 days</span>
        </div>
        <div className="text-sm text-green-600 font-medium">+18.2%</div>
      </div>
      
      <div className="h-48 flex items-end space-x-2">
        {dailyEarnings.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center">
              <div className="relative flex-1 flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{item.amount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 font-medium">{item.day}</div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Total: ₹{dailyEarnings.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default EarningsChart;