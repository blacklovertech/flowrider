import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Rider {
  id: string;
  name: string;
  phone: string;
  location: string;
  categories: ('food' | 'grocery' | 'courier' | 'taxi')[];
  status: 'active' | 'busy' | 'offline';
  rating: number;
  totalRides: number;
  totalEarnings: number;
  coordinates: { lat: number; lng: number };
}

interface RiderContextType {
  riders: Rider[];
  addRider: (rider: Omit<Rider, 'id' | 'totalRides' | 'totalEarnings'>) => void;
  updateRider: (id: string, updates: Partial<Rider>) => void;
}

const RiderContext = createContext<RiderContextType | undefined>(undefined);

export const useRiderContext = () => {
  const context = useContext(RiderContext);
  if (!context) {
    throw new Error('useRiderContext must be used within a RiderProvider');
  }
  return context;
};

export const RiderProvider = ({ children }: { children: ReactNode }) => {
  const [riders, setRiders] = useState<Rider[]>([
    {
      id: '1',
      name: 'Arjun Kumar',
      phone: '+91-9876543210',
      location: 'Koramangala, Bangalore',
      categories: ['food', 'grocery'],
      status: 'active',
      rating: 4.8,
      totalRides: 247,
      totalEarnings: 18500,
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    {
      id: '2',
      name: 'Priya Sharma',
      phone: '+91-9876543211',
      location: 'Indiranagar, Bangalore',
      categories: ['courier', 'taxi'],
      status: 'busy',
      rating: 4.9,
      totalRides: 189,
      totalEarnings: 15200,
      coordinates: { lat: 12.9716, lng: 77.6412 }
    },
    {
      id: '3',
      name: 'Rajesh Patel',
      phone: '+91-9876543212',
      location: 'Whitefield, Bangalore',
      categories: ['food'],
      status: 'active',
      rating: 4.6,
      totalRides: 312,
      totalEarnings: 22100,
      coordinates: { lat: 12.9698, lng: 77.7500 }
    },
    {
      id: '4',
      name: 'Anita Singh',
      phone: '+91-9876543213',
      location: 'HSR Layout, Bangalore',
      categories: ['grocery', 'courier'],
      status: 'active',
      rating: 4.7,
      totalRides: 156,
      totalEarnings: 12800,
      coordinates: { lat: 12.9082, lng: 77.6476 }
    },
    {
      id: '5',
      name: 'Mohammed Ali',
      phone: '+91-9876543214',
      location: 'JP Nagar, Bangalore',
      categories: ['taxi'],
      status: 'offline',
      rating: 4.5,
      totalRides: 203,
      totalEarnings: 16900,
      coordinates: { lat: 12.9089, lng: 77.5831 }
    },
    {
      id: '6',
      name: 'Sneha Reddy',
      phone: '+91-9876543215',
      location: 'Electronic City, Bangalore',
      categories: ['food', 'grocery', 'courier'],
      status: 'active',
      rating: 4.9,
      totalRides: 278,
      totalEarnings: 21300,
      coordinates: { lat: 12.8456, lng: 77.6603 }
    }
  ]);

  const addRider = (riderData: Omit<Rider, 'id' | 'totalRides' | 'totalEarnings'>) => {
    const newRider: Rider = {
      ...riderData,
      id: Date.now().toString(),
      totalRides: 0,
      totalEarnings: 0,
    };
    setRiders(prev => [...prev, newRider]);
  };

  const updateRider = (id: string, updates: Partial<Rider>) => {
    setRiders(prev => 
      prev.map(rider => 
        rider.id === id ? { ...rider, ...updates } : rider
      )
    );
  };

  return (
    <RiderContext.Provider value={{ riders, addRider, updateRider }}>
      {children}
    </RiderContext.Provider>
  );
};