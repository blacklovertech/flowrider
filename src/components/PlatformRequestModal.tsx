import React, { useState } from 'react';
import { X, Send, MapPin, Clock, DollarSign } from 'lucide-react';
import { useTaskContext } from '../contexts/TaskContext';
import { useRiderContext } from '../contexts/RiderContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  platform?: {
    id: string;
    name: string;
    category: string;
  };
}

const PlatformRequestModal = ({ isOpen, onClose, platform }: Props) => {
  const { addTask } = useTaskContext();
  const { riders, updateRider } = useRiderContext();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropLocation: '',
    estimatedTime: 30,
    earnings: 75,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableRiders = riders.filter(r => 
    r.status === 'active' && 
    r.categories.includes(platform?.category as any)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (availableRiders.length === 0) {
      alert('No available riders for this category');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API processing delay
    setTimeout(() => {
      // Select best available rider (highest rating)
      const selectedRider = availableRiders.reduce((best, current) => 
        current.rating > best.rating ? current : best
      );

      addTask({
        riderId: selectedRider.id,
        platform: platform?.name || 'Unknown',
        category: platform?.category as any,
        status: 'assigned',
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        earnings: formData.earnings,
        estimatedTime: formData.estimatedTime,
      });

      // Update rider status
      updateRider(selectedRider.id, { status: 'busy' });

      setFormData({
        pickupLocation: '',
        dropLocation: '',
        estimatedTime: 30,
        earnings: 75,
      });
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  if (!isOpen || !platform) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {platform.name} Request Simulation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Available Riders</h3>
            <p className="text-sm text-blue-700">
              {availableRiders.length} riders available for {platform.category} delivery
            </p>
            {availableRiders.length > 0 && (
              <div className="mt-2 text-sm text-blue-600">
                Best match: {availableRiders.reduce((best, current) => 
                  current.rating > best.rating ? current : best
                ).name} ({availableRiders.reduce((best, current) => 
                  current.rating > best.rating ? current : best
                ).rating}★)
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Pickup Location
            </label>
            <input
              type="text"
              required
              value={formData.pickupLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, pickupLocation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter pickup address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Drop Location
            </label>
            <input
              type="text"
              required
              value={formData.dropLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, dropLocation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter delivery address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Est. Time (min)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={formData.estimatedTime}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Earnings (₹)
              </label>
              <input
                type="number"
                min="20"
                max="500"
                value={formData.earnings}
                onChange={(e) => setFormData(prev => ({ ...prev, earnings: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableRiders.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlatformRequestModal;