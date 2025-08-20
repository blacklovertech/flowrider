import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Riders = lazy(() => import('./pages/Riders'));
const Platforms = lazy(() => import('./pages/Platforms'));
const Analytics = lazy(() => import('./pages/Analytics'));
const RiderApp = lazy(() => import('./pages/RiderApp'));
import { RiderProvider } from './contexts/RiderContext';
import { TaskProvider } from './contexts/TaskContext';

function App() {
  return (
    <RiderProvider>
      <TaskProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Suspense fallback={<div className="p-6 text-gray-600">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/riders" element={<Riders />} />
                <Route path="/rider-app" element={<RiderApp />} />
                <Route path="/platforms" element={<Platforms />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </TaskProvider>
    </RiderProvider>
  );
}

export default App;