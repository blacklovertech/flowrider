import { useMemo } from 'react';
import { TrendingUp, Users, DollarSign } from 'lucide-react';
import KPI from '../components/KPI';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import { useRiderContext } from '../contexts/RiderContext';
import { useTaskContext } from '../contexts/TaskContext';
import EarningsChart from '../components/EarningsChart';
import CategoryDistribution from '../components/CategoryDistribution';

const Analytics = () => {
  const { riders } = useRiderContext();
  const { tasks } = useTaskContext();

  const totalRiders = riders.length;
  const activeRiders = useMemo(() => riders.filter(r => r.status === 'active').length, [riders]);
  const totalTasks = tasks.length;
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed').length, [tasks]);
  const totalEarnings = useMemo(() => riders.reduce((sum, r) => sum + r.totalEarnings, 0), [riders]);
  // const avgRating = useMemo(() => riders.reduce((sum, r) => sum + r.rating, 0) / Math.max(riders.length, 1), [riders]);

  const categoryStats = useMemo(() => (
    ['food', 'grocery', 'courier', 'taxi'].map(category => ({
      name: category,
      count: tasks.filter(t => t.category === category).length,
      riders: riders.filter(r => r.categories.includes(category as any)).length
    }))
  ), [tasks, riders]);

  const platformStats = useMemo(() => ([
    { name: 'Zomato', tasks: tasks.filter(t => t.platform === 'Zomato').length, revenue: 12500 },
    { name: 'Swiggy', tasks: tasks.filter(t => t.platform === 'Swiggy').length, revenue: 11800 },
    { name: 'Blinkit', tasks: tasks.filter(t => t.platform === 'Blinkit').length, revenue: 8600 },
    { name: 'Rapido', tasks: tasks.filter(t => t.platform === 'Rapido').length, revenue: 7200 }
  ]), [tasks]);

  return (
    <PageContainer>
      <PageHeader title="Analytics & Insights" subtitle="Comprehensive analytics for data-driven decisions" />
<div className="bg-white rounded-lg shadow p-5 mb-4">
  <h3 className="font-bold mb-2">Primary Market Validation</h3>
  <div className="grid grid-cols-2 gap-4">
    <div><span className="font-semibold">Riders preferring salary:</span> 78%</div>
    <div><span className="font-semibold">Ops willing to pay premium:</span> 15-20%</div>
    <div><span className="font-semibold">Avg. deliveries/elite rider:</span> 38/shift</div>
    <div><span className="font-semibold">Attrition cost/gig:</span> ₹4,000</div>
  </div>
</div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KPI title="Active Riders" value={`${activeRiders}/${totalRiders}`} icon={<Users className="h-6 w-6" />} color="blue" progress={totalRiders ? activeRiders / totalRiders : 0} />
        <KPI title="Completion Rate" value={`${((completedTasks / totalTasks) * 100).toFixed(1)}%`} icon={<TrendingUp className="h-6 w-6" />} color="green" sublabel={`${completedTasks} of ${totalTasks} tasks completed`} />
        <KPI title="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} icon={<DollarSign className="h-6 w-6" />} color="purple" sublabel={`₹${Math.round(totalEarnings / Math.max(totalRiders, 1))} avg per rider`} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Earnings Trend</h2>
          <EarningsChart />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Category Distribution</h2>
          <CategoryDistribution />
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Category Performance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryStats.map((category, index) => {
            const colors = [
              { bg: 'bg-orange-50', text: 'text-orange-600', accent: 'bg-orange-500' },
              { bg: 'bg-green-50', text: 'text-green-600', accent: 'bg-green-500' },
              { bg: 'bg-blue-50', text: 'text-blue-600', accent: 'bg-blue-500' },
              { bg: 'bg-purple-50', text: 'text-purple-600', accent: 'bg-purple-500' }
            ];
            const color = colors[index];
            
            return (
              <div key={category.name} className={`${color.bg} p-6 rounded-xl border border-gray-200`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`${color.accent} w-3 h-3 rounded-full`}></div>
                  <span className="text-sm font-medium text-gray-600 capitalize">{category.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tasks</span>
                    <span className={`font-bold ${color.text}`}>{category.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Riders</span>
                    <span className={`font-bold ${color.text}`}>{category.riders}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Revenue */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Revenue Analysis</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg per Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {platformStats.map((platform, index) => (
                <tr key={platform.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{platform.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {platform.tasks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{platform.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{Math.round(platform.revenue / Math.max(platform.tasks, 1))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">
                      +{(8 + index * 2).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default Analytics;