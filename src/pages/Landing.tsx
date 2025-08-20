import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Users, MapPin, TrendingUp, Shield, Bike, Clock,
  Zap, Target, Brain, CheckCircle, Code, Globe, Lock,
  Copy, ExternalLink, DollarSign, Briefcase, Award,
  Send, Loader2, Play, Pause, RotateCcw, Star,
  Coffee, ShoppingBag, Truck, Car, ArrowUpRight
} from 'lucide-react';

// Types for demo and API objects
type PriorityLevel = 'high' | 'medium' | 'low';

interface DemoRequest {
  id: string;
  platform: string;
  type: string;
  from: string;
  to: string;
  priority: PriorityLevel;
  value: number;
}

interface DemoRider {
  id: string;
  name: string;
  location: string;
  rating: number;
  preferences: string[];
  status: string;
  earnings: number;
}

interface ApiRider {
  id: string;
  name: string;
  phone?: string;
  rating?: number | string;
  estimated_arrival?: string;
  location?: { lat: number; lng: number };
  preferences?: string[];
}

interface AllocationResponse {
  success: boolean;
  allocation_id?: string;
  rider?: ApiRider;
  tracking_url?: string;
  estimated_cost?: number;
  response_time?: string;
}

// Mock data for components
const mockRequests: DemoRequest[] = [
  { id: "req_001", platform: "Swiggy", type: "Food", from: "Koramangala", to: "BTM Layout", priority: 'high', value: 180 },
  { id: "req_002", platform: "Blinkit", type: "Grocery", from: "Indiranagar", to: "Whitefield", priority: 'medium', value: 420 },
  { id: "req_003", platform: "Rapido", type: "Taxi", from: "MG Road", to: "Electronic City", priority: 'high', value: 350 },
  { id: "req_004", platform: "Dunzo", type: "Courier", from: "HSR Layout", to: "Kormangala", priority: 'low', value: 80 }
];

const mockRiders: DemoRider[] = [
  { id: "rider_001", name: "Rajesh Kumar", location: "Koramangala", rating: 4.8, preferences: ["Food", "Grocery"], status: "available", earnings: 1240 },
  { id: "rider_002", name: "Amit Singh", location: "Indiranagar", rating: 4.9, preferences: ["Courier", "Taxi"], status: "available", earnings: 890 },
  { id: "rider_003", name: "Suresh Reddy", location: "Whitefield", rating: 4.7, preferences: ["Grocery", "Food"], status: "available", earnings: 1580 }
];

const platforms = [
  {
    name: "Food Delivery",
    icon: Coffee,
    platforms: ["Zomato", "Swiggy", "Uber Eats"],
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    status: "Active",
    requests: "1,247",
    avgTime: "18min"
  },
  {
    name: "Grocery Delivery", 
    icon: ShoppingBag,
    platforms: ["Blinkit", "Instamart", "BigBasket"],
    color: "text-green-500",
    bgColor: "bg-green-50",
    status: "Active",
    requests: "856",
    avgTime: "25min"
  },
  {
    name: "Courier Services",
    icon: Truck,
    platforms: ["Dunzo", "Porter", "Local Courier"],
    color: "text-blue-500", 
    bgColor: "bg-blue-50",
    status: "Active",
    requests: "423",
    avgTime: "32min"
  },
  {
    name: "Bike Taxi",
    icon: Car,
    platforms: ["Rapido", "Ola Bike", "Uber Moto"],
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    status: "Active", 
    requests: "672",
    avgTime: "15min"
  }
];

// Platform Integrations Component
const PlatformIntegrations = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Multi-Platform Integration
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Seamlessly connect with leading delivery and transportation platforms. 
            Our API handles allocation, routing, and real-time tracking across all categories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <div key={platform.name} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${platform.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${platform.color}`} />
                  </div>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="h-3 w-3 mr-1 inline" />
                    {platform.status}
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg mb-3">{platform.name}</h3>
                
                <div className="space-y-2 mb-4">
                  {platform.platforms.map((p) => (
                    <div key={p} className="text-sm text-gray-600">• {p}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{platform.requests}</div>
                    <div className="text-xs text-gray-500">Today's Requests</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-teal-600">{platform.avgTime}</div>
                    <div className="text-xs text-gray-500">Avg Time</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 inline-flex items-center space-x-2">
            View API Integration Guide
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Allocation Engine Component
const AllocationEngine = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Smart Allocation Engine
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our AI-powered allocation system matches riders with tasks based on preferences, 
            location, ratings, and real-time availability for optimal efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Algorithm Features */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Brain className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Preference-Based Matching</h3>
                <p className="text-gray-300">
                  Riders choose their preferred delivery categories (food, grocery, courier, taxi). 
                  Our engine prioritizes assignments based on these preferences.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-600/20 rounded-lg">
                <MapPin className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Location Optimization</h3>
                <p className="text-gray-300">
                  Real-time GPS tracking ensures riders get assignments closest to their location, 
                  reducing travel time and increasing efficiency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-600/20 rounded-lg">
                <Target className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Performance Scoring</h3>
                <p className="text-gray-300">
                  Dynamic scoring based on completion rate, customer ratings, and delivery time 
                  ensures high-quality assignments to top performers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Real-Time Processing</h3>
                <p className="text-gray-300">
                  Sub-second allocation response time with real-time updates on rider availability 
                  and task status across all integrated platforms.
                </p>
              </div>
            </div>
          </div>

          {/* Live Allocation Demo */}
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Live Allocation Demo</h3>
              <p className="text-gray-300 text-sm">Real-time task assignment simulation</p>
            </div>

            <div className="space-y-6">
              {/* Incoming Request */}
              <div className="p-4 bg-blue-600/20 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Incoming Request</span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                    Food Delivery
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  Swiggy • Koramangala to BTM Layout • High Priority
                </p>
              </div>

              {/* Allocation Process */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analyzing rider pool...</span>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Preference matching...</span>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Location optimization...</span>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-4/5"></div>
                </div>
              </div>

              {/* Selected Rider */}
              <div className="p-4 bg-green-600/20 rounded-lg border-l-4 border-green-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Assigned to Rajesh Kumar</span>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Matched
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  • Food delivery preference ✓<br/>
                  • 0.8km away ✓<br/>
                  • 4.8★ rating ✓<br/>
                  • Available now ✓
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">0.3s</div>
                  <div className="text-xs text-gray-300">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">95%</div>
                  <div className="text-xs text-gray-300">Match Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 inline-flex items-center">
            Explore Algorithm Details
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Rider Dashboard Component
const RiderDashboard = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Rider Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive control center for riders to manage their work across all platforms
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Today's Overview */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Today's Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700">Earnings</span>
                <span className="text-2xl font-bold text-green-600">₹1,247</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Deliveries</span>
                <span className="text-2xl font-bold text-blue-600">12</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Hours Online</span>
                <span className="text-2xl font-bold text-purple-600">6.5</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <span className="text-gray-700">Rating</span>
                <span className="text-2xl font-bold text-orange-600">4.9★</span>
              </div>
            </div>
          </div>
          
          {/* Active Assignments */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Active Assignments</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-red-600">Zomato Order</span>
                    <div className="text-sm text-gray-600">Pizza Hut → Koramangala</div>
                    <div className="text-xs text-gray-500">Est. 15 min</div>
                  </div>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">In Progress</span>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-blue-600">Uber Ride</span>
                    <div className="text-sm text-gray-600">Airport → MG Road</div>
                    <div className="text-xs text-gray-500">Scheduled 2:30 PM</div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Pending</span>
                </div>
              </div>
              
              <div className="text-center py-4 text-gray-500">
                <span className="text-sm">2 more assignments queued</span>
              </div>
            </div>
          </div>
          
          {/* Preferences */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Preferred Categories</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Food Delivery</span>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Grocery Run</span>
                    <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Courier</span>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Working Hours</label>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">9:00 AM - 6:00 PM</div>
                  <div className="text-xs text-gray-500">Monday - Friday</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Max Distance</label>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">15 km radius</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Analytics */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Performance Analytics</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">₹45,680</div>
              <div className="text-gray-700 font-medium">Monthly Earnings</div>
              <div className="text-sm text-green-600 mt-1">↑ 12% from last month</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">342</div>
              <div className="text-gray-700 font-medium">Total Deliveries</div>
              <div className="text-sm text-blue-600 mt-1">↑ 8% from last month</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
              <div className="text-gray-700 font-medium">Avg Rating</div>
              <div className="text-sm text-purple-600 mt-1">Excellent performance</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">96%</div>
              <div className="text-gray-700 font-medium">Success Rate</div>
              <div className="text-sm text-orange-600 mt-1">Above average</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Live Demo Component
const LiveDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<DemoRequest | null>(null);
  const [allocatedRider, setAllocatedRider] = useState<DemoRider | null>(null);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    totalRequests: 0,
    successfulAllocations: 0,
    avgResponseTime: 0,
    totalEarnings: 0
  });

  const startDemo = () => {
    setIsRunning(true);
    processNextRequest();
  };

  const stopDemo = () => {
    setIsRunning(false);
    setProgress(0);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentRequest(null);
    setAllocatedRider(null);
    setProgress(0);
    setStats({
      totalRequests: 0,
      successfulAllocations: 0,
      avgResponseTime: 0,
      totalEarnings: 0
    });
  };

  const processNextRequest = () => {
    if (!isRunning) return;

    const randomRequest = mockRequests[Math.floor(Math.random() * mockRequests.length)];
    setCurrentRequest(randomRequest);
    setProgress(0);

    // Simulate allocation process
    const allocationSteps = [
      { step: "Analyzing request", duration: 500 },
      { step: "Finding available riders", duration: 700 },
      { step: "Matching preferences", duration: 600 },
      { step: "Optimizing route", duration: 400 },
      { step: "Allocating rider", duration: 300 }
    ];
    
    allocationSteps.forEach((stepInfo, index) => {
      setTimeout(() => {
        setProgress((index + 1) * 20);
        
        if (index === allocationSteps.length - 1) {
          // Find best matching rider
          const availableRiders = mockRiders.filter(r => 
            r.status === "available" && 
            r.preferences.includes(randomRequest.type)
          );
          
          const selectedRider = availableRiders.length > 0 
            ? availableRiders[Math.floor(Math.random() * availableRiders.length)]
            : mockRiders[Math.floor(Math.random() * mockRiders.length)];
          
          setAllocatedRider(selectedRider);
          
          // Update stats
          setStats(prev => ({
            totalRequests: prev.totalRequests + 1,
            successfulAllocations: prev.successfulAllocations + 1,
            avgResponseTime: 0.3 + Math.random() * 0.4,
            totalEarnings: prev.totalEarnings + randomRequest.value
          }));

          // Continue with next request after delay
          setTimeout(() => {
            if (isRunning) {
              processNextRequest();
            }
          }, 3000);
        }
      }, stepInfo.duration * (index + 1));
    });
  };

  useEffect(() => {
    if (isRunning && !currentRequest) {
      processNextRequest();
    }
  }, [isRunning]);

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Live MVP Demo
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch our allocation engine in action! Real-time rider assignment based on preferences, 
            location, and performance metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Controls */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Demo Controls</h3>
            
            <div className="flex gap-3 mb-6">
              <button 
                onClick={startDemo} 
                disabled={isRunning}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </button>
              <button 
                onClick={stopDemo} 
                disabled={!isRunning}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </button>
              <button 
                onClick={resetDemo} 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>

            {/* Real-time Stats */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Total Requests</span>
                <span className="font-semibold">{stats.totalRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Success Rate</span>
                <span className="font-semibold text-green-400">
                  {stats.totalRequests > 0 ? Math.round((stats.successfulAllocations / stats.totalRequests) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Avg Response</span>
                <span className="font-semibold">{stats.avgResponseTime.toFixed(2)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Total Earnings</span>
                <span className="font-semibold text-teal-400">₹{stats.totalEarnings}</span>
              </div>
            </div>
          </div>

          {/* Current Request */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Incoming Request</h3>
            
            {currentRequest ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{currentRequest.platform}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(currentRequest.priority)}`}>
                    {currentRequest.priority} priority
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{currentRequest.type}</span>
                    <span className="text-sm text-gray-300">₹{currentRequest.value}</span>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-300" />
                      <span>From: {currentRequest.from}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-300" />
                      <span>To: {currentRequest.to}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-300">Start demo to see live requests</p>
              </div>
            )}
          </div>

          {/* Allocated Rider */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Allocated Rider</h3>
            
            {allocatedRider ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{allocatedRider.name}</h4>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Matched
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Location</span>
                    <span className="text-sm">{allocatedRider.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-sm">{allocatedRider.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Today's Earnings</span>
                    <span className="text-sm font-medium">₹{allocatedRider.earnings}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-300 mb-2">Preferences</p>
                  <div className="flex gap-1 flex-wrap">
                    {allocatedRider.preferences.map((pref) => (
                      <span key={pref} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-300">Waiting for allocation...</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
            <Zap className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">0.3s</div>
            <div className="text-xs text-gray-300">Avg Response</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">95%</div>
            <div className="text-xs text-gray-300">Success Rate</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
            <Clock className="h-8 w-8 text-teal-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-xs text-gray-300">Availability</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
            <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">4.8★</div>
            <div className="text-xs text-gray-300">Avg Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Interactive API Component
const InteractiveAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AllocationResponse | null>(null);
  const [formData, setFormData] = useState<{[
    key: string]: string
  }>({
    platform: "swiggy",
    category: "food_delivery",
    pickup_lat: "12.9716",
    pickup_lng: "77.5946",
    pickup_address: "Koramangala, Bangalore",
    drop_lat: "12.9352",
    drop_lng: "77.6245",
    drop_address: "BTM Layout, Bangalore",
    priority: "high",
    estimated_value: "250"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const simulateAPICall = async () => {
    setIsLoading(true);
    setResponse(null);

    try {
      const payload = {
        platform: formData.platform,
        order_id: `req_${Math.random().toString(36).substr(2, 9)}`,
        category: formData.category,
        pickup_location: [parseFloat(formData.pickup_lat), parseFloat(formData.pickup_lng)],
        dropoff_location: [parseFloat(formData.drop_lat), parseFloat(formData.drop_lng)]
      };

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setResponse(data);
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockResponse: AllocationResponse = {
        success: true,
        allocation_id: `alloc_${Math.random().toString(36).substr(2, 9)}`,
        rider: {
          id: `rider_${Math.random().toString(36).substr(2, 6)}`,
          name: ["Rajesh Kumar", "Amit Singh", "Suresh Reddy"][Math.floor(Math.random() * 3)],
          phone: "+91-XXXXXXXXXX",
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
          estimated_arrival: `${Math.floor(Math.random() * 15) + 5} minutes`,
          location: {
            lat: parseFloat(formData.pickup_lat) + (Math.random() - 0.5) * 0.01,
            lng: parseFloat(formData.pickup_lng) + (Math.random() - 0.5) * 0.01
          }
        },
        tracking_url: "https://demo.superfleet.local/track/alloc_xyz789",
        estimated_cost: Math.floor(parseInt(formData.estimated_value) * (0.8 + Math.random() * 0.4)),
        response_time: `${(0.2 + Math.random() * 0.3).toFixed(2)}s`
      };
      setResponse(mockResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const requestPayload = {
    request_id: `req_${Math.random().toString(36).substr(2, 9)}`,
    platform: formData.platform,
    category: formData.category,
    pickup_location: {
      lat: parseFloat(formData.pickup_lat),
      lng: parseFloat(formData.pickup_lng),
      address: formData.pickup_address
    },
    drop_location: {
      lat: parseFloat(formData.drop_lat),
      lng: parseFloat(formData.drop_lng),
      address: formData.drop_address
    },
    priority: formData.priority,
    estimated_value: parseInt(formData.estimated_value),
    special_requirements: formData.category === "food_delivery" ? ["thermal_bag"] : []
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Interactive API Tester
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test our allocation API with real parameters. Experience the speed and accuracy 
            of our rider matching algorithm.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">API Request Builder</h3>
              <div className="flex items-center gap-2">
                <span className="bg-green-600 text-white px-3 py-1 rounded text-xs">POST</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">/api/v1/allocate-rider</code>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => copyToClipboard("https://api.superbike.com/v1/allocate-rider")}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select 
                    value={formData.platform} 
                    onChange={(e) => handleInputChange("platform", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="swiggy">Swiggy</option>
                    <option value="zomato">Zomato</option>
                    <option value="blinkit">Blinkit</option>
                    <option value="rapido">Rapido</option>
                    <option value="dunzo">Dunzo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="food_delivery">Food Delivery</option>
                    <option value="grocery_delivery">Grocery Delivery</option>
                    <option value="courier_services">Courier Services</option>
                    <option value="bike_taxi">Bike Taxi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                <input
                  type="text"
                  value={formData.pickup_address}
                  onChange={(e) => handleInputChange("pickup_address", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Latitude</label>
                  <input
                    type="text"
                    value={formData.pickup_lat}
                    onChange={(e) => handleInputChange("pickup_lat", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Longitude</label>
                  <input
                    type="text"
                    value={formData.pickup_lng}
                    onChange={(e) => handleInputChange("pickup_lng", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Drop Address</label>
                <input
                  type="text"
                  value={formData.drop_address}
                  onChange={(e) => handleInputChange("drop_address", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drop Latitude</label>
                  <input
                    type="text"
                    value={formData.drop_lat}
                    onChange={(e) => handleInputChange("drop_lat", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drop Longitude</label>
                  <input
                    type="text"
                    value={formData.drop_lng}
                    onChange={(e) => handleInputChange("drop_lng", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select 
                    value={formData.priority} 
                    onChange={(e) => handleInputChange("priority", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value (₹)</label>
                  <input
                    type="text"
                    value={formData.estimated_value}
                    onChange={(e) => handleInputChange("estimated_value", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <button 
                onClick={simulateAPICall} 
                disabled={isLoading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Allocating Rider...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send API Request
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Request & Response */}
          <div className="space-y-6">
            {/* Request Payload */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Request Payload</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs flex items-center">
                  <Code className="h-3 w-3 mr-1" />
                  JSON
                </span>
              </div>
              
              <textarea
                value={JSON.stringify(requestPayload, null, 2)}
                readOnly
                className="w-full min-h-[200px] p-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>

            {/* API Response */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">API Response</h3>
                {response && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    200 OK
                  </span>
                )}
              </div>
              
              {response ? (
                <div>
                  <textarea
                    value={JSON.stringify(response, null, 2)}
                    readOnly
                    className="w-full min-h-[250px] p-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm mb-4"
                  />
                  
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{response.response_time}</div>
                      <div className="text-xs text-gray-600">Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">₹{response.estimated_cost}</div>
                      <div className="text-xs text-gray-600">Estimated Cost</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[250px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Send a request to see the response</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// API Documentation Component
const APIDocumentation = () => {
  const [activeTab, setActiveTab] = useState("allocation");

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Developer-First API
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, powerful REST API endpoints for seamless integration with any delivery platform. 
            Built for scale with comprehensive documentation and real-time monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Fast & Reliable</h3>
            <p className="text-gray-600 text-sm">
              Sub-second response times with 99.9% uptime SLA. Built for high-volume production use.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="p-3 bg-teal-100 rounded-lg w-fit mx-auto mb-4">
              <Lock className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure & Compliant</h3>
            <p className="text-gray-600 text-sm">
              Enterprise-grade security with OAuth2, rate limiting, and GDPR compliance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="p-3 bg-yellow-100 rounded-lg w-fit mx-auto mb-4">
              <Globe className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">RESTful Design</h3>
            <p className="text-gray-600 text-sm">
              Clean, intuitive endpoints following REST principles. Easy to integrate and understand.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex border-b border-gray-200 mb-8">
            {["allocation", "tracking", "analytics", "webhooks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "allocation" ? "Rider Allocation" : 
                 tab === "tracking" ? "Real-time Tracking" :
                 tab === "analytics" ? "Analytics" : "Webhooks"}
              </button>
            ))}
          </div>

          {activeTab === "allocation" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Rider Allocation API</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Production Ready
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-xs">POST</span>
                  <code className="text-sm">/api/v1/allocate-rider</code>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                
                <pre className="text-sm bg-white p-4 rounded mt-4 overflow-x-auto">
{`{
  "request_id": "req_abc123",
  "platform": "swiggy",
  "category": "food_delivery",
  "pickup_location": {
    "lat": 12.9716,
    "lng": 77.5946,
    "address": "Koramangala, Bangalore"
  },
  "drop_location": {
    "lat": 12.9352,
    "lng": 77.6245,
    "address": "BTM Layout, Bangalore"
  },
  "priority": "high",
  "estimated_value": 250,
  "special_requirements": ["thermal_bag"]
}`}
                </pre>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Response (200 OK)</p>
                <pre className="text-sm bg-white p-4 rounded overflow-x-auto">
{`{
  "success": true,
  "allocation_id": "alloc_xyz789",
  "rider": {
    "id": "rider_123",
    "name": "Rajesh Kumar",
    "phone": "+91-XXXXXXXXXX",
    "rating": 4.8,
    "estimated_arrival": "8 minutes"
  },
  "tracking_url": "https://api.riderflow.com/track/alloc_xyz789"
}`}
                </pre>
              </div>
            </div>
          )}
          
          {/* Other tab content would go here but keeping it simple for now */}
          
          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center">
              <Code className="mr-2 h-5 w-5" />
              API Documentation
            </button>
            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium flex items-center">
              <ExternalLink className="mr-2 h-5 w-5" />
              Try in Postman
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Business Model Component
const BusinessModel = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Employee-First Business Model
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sustainable revenue streams that prioritize rider welfare while delivering 
            value to platforms. Our model creates win-win outcomes for all stakeholders.
          </p>
        </div>

        {/* Revenue Streams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
              Revenue Streams
            </h3>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Platform Integration Fee</h4>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">Primary</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  ₹5-20 per successful delivery allocation based on category and distance.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Expected Monthly</span>
                  <span className="font-semibold text-lg">₹8.5L - ₹12L</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Value-Added Services</h4>
                  <span className="border border-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs">Secondary</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Training programs, insurance, equipment rental, and compliance monitoring.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Expected Monthly</span>
                  <span className="font-semibold text-lg">₹2L - ₹3.5L</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Premium Analytics</h4>
                  <span className="border border-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs">Tertiary</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Advanced reporting, predictive analytics, and custom dashboard features.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Expected Monthly</span>
                  <span className="font-semibold text-lg">₹1L - ₹2L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Structure */}
<div>
  <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
    <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    Cost Structure
  </h3>

  <div className="space-y-6">
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Rider Compensation</h4>
        <span className="text-sm text-gray-500">60% of revenue</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Base Salary + Benefits</span>
          <span className="font-medium">₹12,00,000 / month</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Performance Bonuses</span>
          <span className="font-medium">₹3,60,000 / month</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div className="bg-blue-600 h-2 rounded-full" style="width: 60%;"></div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Platform Operations</h4>
        <span className="text-sm text-gray-500">25% of revenue</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Infrastructure & APIs</span>
          <span className="font-medium">₹3,90,000 / month</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Support & Monitoring</span>
          <span className="font-medium">₹2,60,000 / month</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div className="bg-teal-600 h-2 rounded-full" style="width: 25%;"></div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Growth & Development</h4>
        <span className="text-sm text-gray-500">15% of revenue</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">R&D and Features</span>
          <span className="font-medium">₹2,10,000 / month</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Marketing & Sales</span>
          <span className="font-medium">₹1,80,000 / month</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div className="bg-green-600 h-2 rounded-full" style="width: 15%;"></div>
      </div>
    </div>

    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Total Revenue</h4>
        <span className="font-medium text-green-700">₹26,00,000 / month</span>
      </div>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Total Costs</h4>
        <span className="font-medium text-red-600">₹26,00,000 / month (Breakeven)</span>
      </div>
    </div>
  </div>
</div>
</div>

        {/* Key Differentiators */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-center">Key Differentiators</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Employee-First Approach</h4>
              <p className="text-gray-600 text-sm">
                Fixed salaries, benefits, and growth opportunities vs traditional gig economy models.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Preference-Based Allocation</h4>
              <p className="text-gray-600 text-sm">
                Smart matching based on rider preferences, skills, and category expertise.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="p-3 bg-teal-100 rounded-lg w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-teal-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2">Multi-Platform Integration</h4>
              <p className="text-gray-600 text-sm">
                Single API for all delivery categories reducing platform dependency.
              </p>
            </div>
          </div>
        </div>

        {/* Financial Projections */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-8 rounded-xl text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-2">Financial Projections</h3>
            <p className="text-blue-100">12-month outlook for Bangalore market</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₹11.5L</div>
              <div className="text-blue-100 text-sm">Monthly Revenue</div>
              <div className="flex items-center justify-center mt-2">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm">+23% growth</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₹9.8L</div>
              <div className="text-blue-100 text-sm">Monthly Costs</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Optimized</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₹1.7L</div>
              <div className="text-blue-100 text-sm">Monthly Profit</div>
              <div className="flex items-center justify-center mt-2">
                <Award className="h-4 w-4 mr-1" />
                <span className="text-sm">15% margin</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₹20.4L</div>
              <div className="text-blue-100 text-sm">Annual Profit</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Sustainable</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-lg font-medium">
            Download Financial Model
          </button>
        </div>
      </div>
    </section>
  );
};

// Main Landing Page Component
const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Employee-First
              <span className="text-blue-600 block">Multi-Platform</span>
              Rider Allocation
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary API that connects trained, happy riders with multiple delivery platforms - 
              ensuring better earnings, flexible work, and superior service quality.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>View Live Demo</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/riders"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Join as Rider</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solving Real Problems
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Current gig economy platforms create inefficiencies that hurt both riders and businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-6">Current Challenges</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Riders struggle with low earnings and lack of benefits</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Platforms face inefficient rider allocation and high turnover</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">No training or safety support for delivery personnel</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Customers experience delays and inconsistent service</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-6">Our Solution</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Employee-first model with guaranteed earnings and benefits</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Intelligent allocation based on rider preferences and skills</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Comprehensive training and safety programs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Faster, more reliable deliveries across all platforms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why SuperBike Fleet?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets human-centered employment
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Employee-First Model</h3>
              <p className="text-gray-600 leading-relaxed">
                Guaranteed salaries, benefits, and career growth opportunities for all riders, 
                moving beyond the gig economy limitations.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Allocation</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered matching based on rider preferences, location, category expertise, 
                and real-time availability across multiple platforms.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Platform API</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamless integration with food delivery, grocery, courier, and bike taxi services 
                through our robust API infrastructure.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Safety & Training</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive training programs, safety equipment, and ongoing support 
                to ensure professional service delivery.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Bike className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Category Specialization</h3>
              <p className="text-gray-600 leading-relaxed">
                Riders can specialize in food delivery, grocery runs, courier services, 
                or passenger transport based on their preferences and skills.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced GPS tracking, route optimization, and live status updates 
                for complete visibility and efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Massive Market Opportunity
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The delivery and mobility market is expanding rapidly across India
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-blue-50 p-8 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹2.5L Cr</div>
              <div className="text-gray-700 font-medium">Food Delivery Market</div>
            </div>
            <div className="bg-teal-50 p-8 rounded-xl">
              <div className="text-3xl font-bold text-teal-600 mb-2">₹1.8L Cr</div>
              <div className="text-gray-700 font-medium">Grocery Delivery Market</div>
            </div>
            <div className="bg-green-50 p-8 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">₹95K Cr</div>
              <div className="text-gray-700 font-medium">Courier & Logistics</div>
            </div>
            <div className="bg-purple-50 p-8 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">₹65K Cr</div>
              <div className="text-gray-700 font-medium">Bike Taxi Services</div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <div className="bg-white p-6 text-center rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <div className="text-2xl font-bold mb-2">500+</div>
              <div className="text-gray-600">Active Riders</div>
            </div>
            
            <div className="bg-white p-6 text-center rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold mb-2">4</div>
              <div className="text-gray-600">Platform Categories</div>
            </div>
            
            <div className="bg-white p-6 text-center rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold mb-2">95%</div>
              <div className="text-gray-600">Assignment Success</div>
            </div>
            
            <div className="bg-white p-6 text-center rounded-xl shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold mb-2">12min</div>
              <div className="text-gray-600">Avg Delivery Time</div>
            </div>
          </div> 
        </div>
      </section>

      {/* All Integrated Components */}
      <PlatformIntegrations />
      <AllocationEngine />
      <RiderDashboard />
      <LiveDemo />
      <InteractiveAPI />
      <APIDocumentation />
      <BusinessModel />

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Delivery Operations?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the revolution in rider-centric, multi-platform delivery allocation
          </p>
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Explore Live Demo</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;