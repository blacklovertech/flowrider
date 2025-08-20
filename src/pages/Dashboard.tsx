//
import { Users, TrendingUp, Bike, Package } from 'lucide-react';
import { useRiderContext } from '../contexts/RiderContext';
import { useTaskContext } from '../contexts/TaskContext';
import RiderMap from '../components/RiderMap';
import RealtimeMetrics from '../components/RealtimeMetrics';
import KPI from '../components/KPI';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';

const Dashboard = () => {
  const { riders } = useRiderContext();
  const { tasks } = useTaskContext();
  
  const activeRiders = riders.filter(r => r.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const avgEarnings = riders.reduce((sum, r) => sum + r.totalEarnings, 0) / Math.max(riders.length, 1);

  return (
    <PageContainer>
      <PageHeader title="Fleet Operations Dashboard" subtitle="Real-time monitoring of rider allocation and performance metrics" />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPI title="Active Riders" value={activeRiders} icon={<Users className="h-6 w-6" />} color="blue" sublabel="+12% from yesterday" />
        <KPI title="Total Tasks" value={totalTasks} icon={<Package className="h-6 w-6" />} color="teal" sublabel="+8% completion rate" />
        <KPI title="Completed Today" value={completedTasks} icon={<TrendingUp className="h-6 w-6" />} color="green" sublabel="95% success rate" />
        <KPI title="Avg Earnings" value={`₹${Math.round(avgEarnings)}`} icon={<Bike className="h-6 w-6" />} color="purple" sublabel="+15% from last week" />
      </div>

      {/* Real-time Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rider Locations</h2>
          <RiderMap />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Real-time Metrics</h2>
          <RealtimeMetrics />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Task Assignments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.slice(0, 8).map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{task.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {riders.find(r => r.id === task.riderId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.platform}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.category === 'food' ? 'bg-orange-100 text-orange-800' :
                      task.category === 'grocery' ? 'bg-green-100 text-green-800' :
                      task.category === 'courier' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {task.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{task.earnings}
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

export default Dashboard;