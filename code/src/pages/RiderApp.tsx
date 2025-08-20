import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, CheckCircle, Clock, ToggleLeft, ToggleRight, Navigation } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';

type Category = 'food' | 'grocery' | 'courier' | 'taxi' | 'errands';

interface RiderProfile {
  id: string;
  name: string;
  preferences: Category[];
  status: 'available' | 'busy' | 'offline';
}

interface TaskItem {
  id: string;
  platform: string;
  category: Category;
  pickup_location: [number, number];
  dropoff_location: [number, number];
  status: string;
  estimated_value: number;
  distance_km?: number;
}

const ALL_CATEGORIES: Category[] = ['food', 'grocery', 'courier', 'taxi', 'errands'];

const RiderApp: React.FC = () => {
  const [rider, setRider] = useState<RiderProfile>({ id: 'R100', name: 'Rahul', preferences: ['grocery', 'courier'], status: 'available' });
  const [loc, setLoc] = useState<{ lat: number; lng: number }>({ lat: 12.9716, lng: 77.5946 });
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      navigator.geolocation?.getCurrentPosition((pos) => {
        setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const url = `/api/riders/${rider.id}/tasks?lat=${loc.lat}&lng=${loc.lng}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rider.preferences.join(','), rider.status, loc.lat, loc.lng]);

  const toggleAvailability = async () => {
    const next = rider.status === 'available' ? 'offline' : 'available';
    setRider((r) => ({ ...r, status: next }));
    try {
      await fetch(`/api/riders/${rider.id}/availability`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
    } catch {}
  };

  const toggleCategory = async (cat: Category) => {
    const prefs = rider.preferences.includes(cat) ? rider.preferences.filter((c) => c !== cat) : [...rider.preferences, cat];
    setRider((r) => ({ ...r, preferences: prefs }));
    try {
      await fetch(`/api/riders/${rider.id}/preferences`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ preferences: prefs }) });
    } catch {}
  };

  const acceptTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/assign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ riderId: rider.id }) });
      const data = await res.json();
      if (data.success) {
        setActiveTask(data.task);
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setRider((r) => ({ ...r, status: 'busy' }));
      }
    } catch {}
  };

  const updateTaskStatus = async (status: 'picked_up' | 'en_route' | 'delivered') => {
    if (!activeTask) return;
    const res = await fetch(`/api/tasks/${activeTask.id}/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const data = await res.json();
    if (data.success) {
      setActiveTask(data.task);
      if (status === 'delivered') {
        setActiveTask(null);
        setRider((r) => ({ ...r, status: 'available' }));
        fetchTasks();
      }
    }
  };

  const navLink = useMemo(() => {
    if (!activeTask) return null;
    const [plat, plong] = activeTask.pickup_location;
    const [dlat, dlong] = activeTask.dropoff_location;
    return `https://www.google.com/maps/dir/${plat},${plong}/${dlat},${dlong}`;
  }, [activeTask]);

  return (
    <PageContainer>
      <PageHeader
        title="Rider App"
        subtitle={`Logged in as ${rider.name}`}
        actions={(
          <button onClick={toggleAvailability} className={`px-4 py-2 rounded-lg text-white flex items-center ${rider.status === 'available' ? 'bg-green-600' : 'bg-gray-600'}`}>
            {rider.status === 'available' ? <ToggleRight className="h-4 w-4 mr-2" /> : <ToggleLeft className="h-4 w-4 mr-2" />}
            {rider.status === 'available' ? 'Online' : 'Offline'}
          </button>
        )}
      />

      {/* Category Selection */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">My Categories</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-2 rounded-lg text-sm capitalize ${rider.preferences.includes(cat) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Task */}
      {activeTask && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Active Task #{activeTask.id}</div>
            <a className="text-blue-600 underline inline-flex items-center" href={navLink || '#'} target="_blank" rel="noreferrer">
              <Navigation className="h-4 w-4 mr-1" /> Navigate
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-gray-600" />Pickup: {activeTask.pickup_location.join(', ')}</div>
            <div className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-gray-600" />Drop: {activeTask.dropoff_location.join(', ')}</div>
            <div className="flex items-center"><Clock className="h-4 w-4 mr-1 text-gray-600" />₹{activeTask.estimated_value}</div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => updateTaskStatus('picked_up')} className="px-3 py-2 rounded bg-yellow-600 text-white text-sm">Picked Up</button>
            <button onClick={() => updateTaskStatus('en_route')} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">En Route</button>
            <button onClick={() => updateTaskStatus('delivered')} className="px-3 py-2 rounded bg-green-600 text-white text-sm">Delivered</button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Available Tasks</h2>
          <button onClick={fetchTasks} className="text-sm text-blue-600">Refresh</button>
        </div>
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="text-sm text-gray-500">No tasks right now. Try expanding categories or check back soon.</div>
        ) : (
          <div className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} className="border rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{t.platform} • <span className="capitalize">{t.category}</span></div>
                  <div className="text-xs text-gray-600 flex items-center"><MapPin className="h-3 w-3 mr-1" /> {t.pickup_location.join(', ')} → {t.dropoff_location.join(', ')}</div>
                  <div className="text-xs text-gray-600">Distance: {t.distance_km?.toFixed(2)} km</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">₹{t.estimated_value}</div>
                  <button onClick={() => acceptTask(t.id)} className="px-3 py-1 rounded bg-green-600 text-white text-sm inline-flex items-center"><CheckCircle className="h-4 w-4 mr-1" />Accept</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RiderApp;


