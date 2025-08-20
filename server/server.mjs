import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data', 'riders.json');
const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

function loadRiders() {
  try {
    const json = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(json);
  } catch (err) {
    console.error('Failed to load riders.json', err);
    return [];
  }
}

function loadTasks() {
  try {
    const json = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(json);
  } catch (err) {
    console.error('Failed to load tasks.json', err);
    return [];
  }
}

function saveTasks(tasks) {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Failed to save tasks.json', err);
  }
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function haversineDistanceKm(coordA, coordB) {
  const [lat1, lon1] = coordA;
  const [lat2, lon2] = coordB;
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function normalizeCategory(category) {
  if (!category) return null;
  const mapping = {
    food_delivery: 'food',
    grocery_delivery: 'grocery',
    courier_services: 'courier',
    bike_taxi: 'taxi',
    food: 'food',
    grocery: 'grocery',
    courier: 'courier',
    taxi: 'taxi',
  };
  return mapping[category] || category;
}

function assignRider(order, riders) {
  const pickup = order.pickup_location;
  const category = normalizeCategory(order.category);
  const availableRiders = riders.filter((rider) => rider.status === 'available');

  const candidates = availableRiders
    .map((rider) => {
      const distanceKm = haversineDistanceKm(pickup, rider.location);
      const preferenceScore = rider.preferences.includes(category) ? 0 : 1; // 0 is better
      return { rider, distanceKm, preferenceScore };
    })
    .sort((a, b) => {
      if (a.preferenceScore !== b.preferenceScore) return a.preferenceScore - b.preferenceScore;
      return a.distanceKm - b.distanceKm;
    });

  return candidates.length > 0 ? candidates[0] : null;
}

app.get('/api/riders', (req, res) => {
  const riders = loadRiders();
  res.json({ riders });
});

// Update rider availability
app.post('/api/riders/:id/availability', (req, res) => {
  const riders = loadRiders();
  const { id } = req.params;
  const { status } = req.body || {};
  const idx = riders.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Rider not found' });
  if (!['available', 'busy', 'offline'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  riders[idx].status = status;
  try { fs.writeFileSync(dataFilePath, JSON.stringify(riders, null, 2)); } catch {}
  res.json({ success: true, rider: riders[idx] });
});

// Update rider preferences
app.post('/api/riders/:id/preferences', (req, res) => {
  const riders = loadRiders();
  const { id } = req.params;
  const { preferences } = req.body || {};
  const idx = riders.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Rider not found' });
  if (!Array.isArray(preferences)) {
    return res.status(400).json({ success: false, message: 'preferences must be an array' });
  }
  riders[idx].preferences = preferences.map(normalizeCategory);
  try { fs.writeFileSync(dataFilePath, JSON.stringify(riders, null, 2)); } catch {}
  res.json({ success: true, rider: riders[idx] });
});

// Get tasks available for a rider
app.get('/api/riders/:id/tasks', (req, res) => {
  const riders = loadRiders();
  const tasks = loadTasks();
  const { id } = req.params;
  const rider = riders.find((r) => r.id === id);
  if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const riderLoc = Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : rider.location;
  const available = tasks
    .filter((t) => t.status === 'pending')
    .filter((t) => rider.preferences.includes(normalizeCategory(t.category)))
    .map((t) => ({
      ...t,
      distance_km: haversineDistanceKm(riderLoc, t.pickup_location),
    }))
    .sort((a, b) => a.distance_km - b.distance_km);
  res.json({ success: true, tasks: available });
});

app.post('/api/order', (req, res) => {
  const {
    platform,
    order_id,
    category,
    pickup_location,
    dropoff_location,
  } = req.body || {};

  if (!platform || !category || !pickup_location || !dropoff_location) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: platform, category, pickup_location, dropoff_location',
    });
  }

  const riders = loadRiders();
  const best = assignRider(
    { platform, order_id: order_id || `ord_${Date.now()}`, category, pickup_location },
    riders
  );

  if (!best) {
    return res.status(200).json({
      success: false,
      message: 'No riders available',
    });
  }

  const allocationId = `alloc_${Math.random().toString(36).slice(2, 10)}`;
  const response = {
    success: true,
    allocation_id: allocationId,
    rider: {
      id: best.rider.id,
      name: best.rider.name,
      rating: best.rider.rating || (4.5 + Math.random() * 0.5).toFixed(1),
      location: { lat: best.rider.location[0], lng: best.rider.location[1] },
      estimated_arrival: `${Math.max(3, Math.round(best.distanceKm * 3))} minutes`,
      preferences: best.rider.preferences,
    },
    distance_km: Number(best.distanceKm.toFixed(2)),
    normalized_category: normalizeCategory(category),
  };

  res.json(response);
});

// Partner creates a task
app.post('/api/partner/task', (req, res) => {
  const {
    platform,
    category,
    pickup_location,
    dropoff_location,
    estimated_value,
  } = req.body || {};

  if (!platform || !category || !pickup_location || !dropoff_location) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const tasks = loadTasks();
  const newTask = {
    id: `task_${Math.random().toString(36).slice(2, 10)}`,
    platform,
    category: normalizeCategory(category),
    pickup_location,
    dropoff_location,
    status: 'pending',
    estimated_value: Number(estimated_value || 0),
    created_at: Date.now(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.json({ success: true, task: newTask });
});

// List tasks with optional filters
app.get('/api/tasks', (req, res) => {
  const tasks = loadTasks();
  const { status, category, riderId } = req.query;
  let results = tasks;
  if (status) results = results.filter((t) => t.status === status);
  if (category) results = results.filter((t) => t.category === normalizeCategory(category));
  if (riderId) results = results.filter((t) => t.riderId === riderId);
  res.json({ success: true, tasks: results });
});

// Assign a task to a rider
app.post('/api/tasks/:id/assign', (req, res) => {
  const tasks = loadTasks();
  const riders = loadRiders();
  const { id } = req.params;
  const { riderId } = req.body || {};
  const taskIdx = tasks.findIndex((t) => t.id === id);
  if (taskIdx === -1) return res.status(404).json({ success: false, message: 'Task not found' });
  const rider = riders.find((r) => r.id === riderId);
  if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });
  tasks[taskIdx].riderId = riderId;
  tasks[taskIdx].status = 'assigned';
  saveTasks(tasks);
  res.json({ success: true, task: tasks[taskIdx] });
});

// Update task status lifecycle
app.post('/api/tasks/:id/status', (req, res) => {
  const tasks = loadTasks();
  const { id } = req.params;
  const { status } = req.body || {};
  const valid = ['pending', 'assigned', 'picked_up', 'en_route', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  const taskIdx = tasks.findIndex((t) => t.id === id);
  if (taskIdx === -1) return res.status(404).json({ success: false, message: 'Task not found' });
  tasks[taskIdx].status = status;
  if (status === 'delivered') {
    tasks[taskIdx].delivered_at = Date.now();
  }
  saveTasks(tasks);
  res.json({ success: true, task: tasks[taskIdx] });
});

app.listen(PORT, () => {
  console.log(`Allocation API server running on http://localhost:${PORT}`);
});


