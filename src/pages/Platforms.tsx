import React, { useState } from 'react';
import { Send, Zap, Package, Car, ShoppingBag } from 'lucide-react';
// import { useTaskContext } from '../contexts/TaskContext';
import { useRiderContext } from '../contexts/RiderContext';
import PlatformRequestModal from '../components/PlatformRequestModal';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';

const Platforms = () => {
  // const { addTask } = useTaskContext();
  const { riders } = useRiderContext();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const platforms = [
    {
      id: 'zomato',
      name: 'Zomato',
      category: 'food',
      icon: Package,
      color: 'bg-red-500',
      description: 'Food delivery platform',
      activeOrders: 145,
      avgDeliveryTime: '28 min'
    },
    {
      id: 'swiggy',
      name: 'Swiggy',
      category: 'food',
      icon: Package,
      color: 'bg-orange-500',
      description: 'Food delivery platform',
      activeOrders: 132,
      avgDeliveryTime: '25 min'
    },
    {
      id: 'blinkit',
      name: 'Blinkit',
      category: 'grocery',
      icon: ShoppingBag,
      color: 'bg-yellow-500',
      description: 'Instant grocery delivery',
      activeOrders: 89,
      avgDeliveryTime: '15 min'
    },
    {
      id: 'instamart',
      name: 'Instamart',
      category: 'grocery',
      icon: ShoppingBag,
      color: 'bg-green-500',
      description: 'Quick grocery delivery',
      activeOrders: 76,
      avgDeliveryTime: '18 min'
    },
    {
      id: 'dunzo',
      name: 'Dunzo',
      category: 'courier',
      icon: Package,
      color: 'bg-blue-500',
      description: 'Courier & delivery',
      activeOrders: 54,
      avgDeliveryTime: '35 min'
    },
    {
      id: 'rapido',
      name: 'Rapido',
      category: 'taxi',
      icon: Car,
      color: 'bg-purple-500',
      description: 'Bike taxi service',
      activeOrders: 98,
      avgDeliveryTime: '12 min'
    }
  ];

  const handlePlatformRequest = (platformId: string) => {
    setSelectedPlatform(platformId);
    setShowRequestModal(true);
  };

  const getAvailableRiders = React.useCallback((category: string) => (
    riders.filter(r => r.status === 'active' && r.categories.includes(category as any)).length
  ), [riders]);

  return (
    <PageContainer>
      <PageHeader title="Platform Integration" subtitle="Manage API connections and simulate platform requests" />

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const availableRiders = getAvailableRiders(platform.category);
          
          return (
            <div key={platform.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`${platform.color} text-white w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{platform.name}</h3>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{platform.activeOrders}</p>
                  <p className="text-xs text-gray-600">Active Orders</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{availableRiders}</p>
                  <p className="text-xs text-gray-600">Available Riders</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Avg Delivery Time</p>
                  <p className="font-bold text-gray-900">{platform.avgDeliveryTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="font-bold text-green-600">96.2%</p>
                </div>
              </div>

              <button
                onClick={() => handlePlatformRequest(platform.id)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Simulate Request</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* API Integration Stats */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">API Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600 mb-1">99.8%</p>
            <p className="text-sm text-gray-600">API Uptime</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600 mb-1">2.3s</p>
            <p className="text-sm text-gray-600">Avg Response Time</p>
          </div>
          
          <div className="text-center">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send className="h-8 w-8 text-teal-600" />
            </div>
            <p className="text-2xl font-bold text-teal-600 mb-1">1,247</p>
            <p className="text-sm text-gray-600">Requests Today</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Car className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600 mb-1">94.5%</p>
            <p className="text-sm text-gray-600">Assignment Success</p>
          </div>
        </div>
      </div>

      <PlatformRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        platform={platforms.find(p => p.id === selectedPlatform)}
      />
    </PageContainer>
  );
};

export default Platforms;