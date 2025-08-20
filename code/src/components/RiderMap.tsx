import React from 'react';
import { MapPin, Navigation, Users } from 'lucide-react';
import { useRiderContext } from '../contexts/RiderContext';

const RiderMap = () => {
  const { riders } = useRiderContext();
  
  const activeRiders = riders.filter(r => r.status === 'active');
  const busyRiders = riders.filter(r => r.status === 'busy');

  return (
    <div className="h-80 bg-gray-100 rounded-lg relative overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        {/* Mock street lines */}
        <div className="absolute top-16 left-0 w-full h-px bg-gray-300"></div>
        <div className="absolute top-32 left-0 w-full h-px bg-gray-300"></div>
        <div className="absolute top-48 left-0 w-full h-px bg-gray-300"></div>
        <div className="absolute top-64 left-0 w-full h-px bg-gray-300"></div>
        
        <div className="absolute left-16 top-0 h-full w-px bg-gray-300"></div>
        <div className="absolute left-32 top-0 h-full w-px bg-gray-300"></div>
        <div className="absolute left-48 top-0 h-full w-px bg-gray-300"></div>
        <div className="absolute left-64 top-0 h-full w-px bg-gray-300"></div>
      </div>

      {/* Rider markers */}
      {activeRiders.map((rider, index) => (
        <div
          key={rider.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{
            left: `${20 + (index * 15) % 60}%`,
            top: `${25 + (index * 20) % 50}%`,
          }}
        >
          <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Navigation className="h-4 w-4" />
          </div>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {rider.name}
          </div>
        </div>
      ))}

      {busyRiders.map((rider, index) => (
        <div
          key={rider.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{
            left: `${30 + (index * 18) % 50}%`,
            top: `${35 + (index * 25) % 40}%`,
          }}
        >
          <div className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Navigation className="h-4 w-4" />
          </div>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {rider.name} (Busy)
          </div>
        </div>
      ))}

      {/* Map controls */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Active ({activeRiders.length})</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Busy ({busyRiders.length})</span>
          </div>
        </div>
      </div>

      {/* Location info */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Bangalore Central Area</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-600">{riders.length} total riders</span>
        </div>
      </div>
    </div>
  );
};

export default RiderMap;