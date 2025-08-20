import React, { useState } from 'react';
import { Plus, Filter, Search, MapPin, Phone, Star } from 'lucide-react';
import { useRiderContext } from '../contexts/RiderContext';
import RiderRegistrationModal from '../components/RiderRegistrationModal';
import { CategoryPill } from '../components/Pills';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';

const Riders = () => {
  const { riders } = useRiderContext();
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRiders = React.useMemo(() => (
    riders.filter(rider => {
      const matchesSearch = rider.name.toLowerCase().includes(searchTerm.toLowerCase()) || rider.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || rider.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
  ), [riders, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // category pill class handled by CategoryPill

  return (
    <PageContainer>
      <PageHeader
        title="Rider Management"
        subtitle="Manage and monitor your delivery fleet"
        actions={(
          <button
            onClick={() => setShowRegistration(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Rider</span>
          </button>
        )}
      />

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search riders by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRiders.map((rider) => (
          <div key={rider.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                  {rider.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{rider.name}</h3>
                  <p className="text-sm text-gray-600">ID: {rider.id.slice(0, 8)}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rider.status)}`}>
                {rider.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {rider.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {rider.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                {rider.rating.toFixed(1)} ({rider.totalRides} rides)
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">SPECIALIZATIONS</p>
              <div className="flex flex-wrap gap-1">
                {rider.categories.map((category) => (
                  <CategoryPill key={category} value={category} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center py-3 border-t border-gray-100">
              <div>
                <p className="text-lg font-bold text-green-600">₹{rider.totalEarnings}</p>
                <p className="text-xs text-gray-500">Total Earnings</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">{rider.totalRides}</p>
                <p className="text-xs text-gray-500">Completed Rides</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRiders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No riders found matching your criteria</p>
        </div>
      )}

      <RiderRegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
      />
    </PageContainer>
  );
};

export default Riders;