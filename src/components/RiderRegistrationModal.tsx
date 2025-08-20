import React, { useState } from 'react';
import { X, User, Phone, MapPin, Star } from 'lucide-react';
import { useRiderContext } from '../contexts/RiderContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RiderRegistrationModal = ({ isOpen, onClose }: Props) => {
  const { addRider } = useRiderContext();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    categories: [] as ('food' | 'grocery' | 'courier' | 'taxi')[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categories.length === 0) {
      alert('Please select at least one category');
      return;
    }
    
    addRider({
      ...formData,
      status: 'active',
      rating: 5.0,
      coordinates: {
        lat: 12.9716 + (Math.random() - 0.5) * 0.1,
        lng: 77.5946 + (Math.random() - 0.5) * 0.1
      }
    });
    
    setFormData({
      name: '',
      phone: '',
      location: '',
      categories: [],
    });
    onClose();
  };

  const handleCategoryToggle = (category: 'food' | 'grocery' | 'courier' | 'taxi') => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Register New Rider</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter rider's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+91-9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Koramangala, Bangalore"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Star className="h-4 w-4 inline mr-1" />
              Service Categories (Select at least one)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'food', label: 'Food Delivery', color: 'orange' },
                { id: 'grocery', label: 'Grocery', color: 'green' },
                { id: 'courier', label: 'Courier', color: 'blue' },
                { id: 'taxi', label: 'Bike Taxi', color: 'purple' }
              ].map(category => (
                <label
                  key={category.id}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.categories.includes(category.id as any)
                      ? `border-${category.color}-500 bg-${category.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id as any)}
                    onChange={() => handleCategoryToggle(category.id as any)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                    formData.categories.includes(category.id as any)
                      ? `border-${category.color}-500 bg-${category.color}-500`
                      : 'border-gray-300'
                  }`}>
                    {formData.categories.includes(category.id as any) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register Rider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiderRegistrationModal;