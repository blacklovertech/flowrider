import React from 'react';
import { Package, ShoppingBag, Send, Car } from 'lucide-react';

const CategoryDistribution = () => {
  const categories = [
    { name: 'Food', count: 485, color: 'bg-orange-500', icon: Package },
    { name: 'Grocery', count: 324, color: 'bg-green-500', icon: ShoppingBag },
    { name: 'Courier', count: 198, color: 'bg-blue-500', icon: Send },
    { name: 'Taxi', count: 267, color: 'bg-purple-500', icon: Car },
  ];

  const total = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="h-64 flex flex-col">
      <div className="flex-1 space-y-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const percentage = (category.count / total) * 100;
          
          return (
            <div key={category.name} className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 w-24">
                <div className={`${category.color} p-2 rounded-lg text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </div>
              
              <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                <div
                  className={`h-full ${category.color} transition-all duration-1000 rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="text-right w-16">
                <div className="text-sm font-bold text-gray-900">{category.count}</div>
                <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Deliveries</span>
          <span className="font-bold text-gray-900">{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryDistribution;