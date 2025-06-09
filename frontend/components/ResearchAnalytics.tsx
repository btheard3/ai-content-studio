import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Search,
  Database,
  Clock,
  Target,
  Users,
  FileText,
  Globe,
  BookOpen,
  BarChart3
} from 'lucide-react';
import axios from 'axios';

interface AnalyticsData {
  total_searches: number;
  unique_queries: number;
  average_results_per_query: number;
  most_popular_sources: Array<{ source: string; count: number }>;
  search_trends: Array<{ date: string; searches: number }>;
  top_queries: Array<{ query: string; count: number }>;
}

const ResearchAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/research/analytics`, {
        params: { days: timeRange },
        headers: { Authorization: 'Bearer dummy-token' }
      });
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Fallback to mock data
      setAnalytics({
        total_searches: 156,
        unique_queries: 89,
        average_results_per_query: 12.4,
        most_popular_sources: [
          { source: 'Academic Database', count: 45 },
          { source: 'Web Sources', count: 38 },
          { source: 'Statistical Databases', count: 32 }
        ],
        search_trends: [
          { date: '2024-03-01', searches: 12 },
          { date: '2024-03-02', searches: 15 },
          { date: '2024-03-03', searches: 18 },
          { date: '2024-03-04', searches: 14 },
          { date: '2024-03-05', searches: 22 },
          { date: '2024-03-06', searches: 19 },
          { date: '2024-03-07', searches: 25 }
        ],
        top_queries: [
          { query: 'AI in healthcare', count: 8 },
          { query: 'climate change statistics', count: 6 },
          { query: 'market trends 2024', count: 5 },
          { query: 'renewable energy research', count: 4 },
          { query: 'blockchain technology', count: 3 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const sourceColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

  const kpiCards = [
    {
      title: 'Total Searches',
      value: analytics?.total_searches || 0,
      icon: <Search className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Unique Queries',
      value: analytics?.unique_queries || 0,
      icon: <FileText className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      change: '+8%'
    },
    {
      title: 'Avg Results/Query',
      value: analytics?.average_results_per_query?.toFixed(1) || '0.0',
      icon: <Target className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      change: '+5%'
    },
    {
      title: 'Data Sources',
      value: analytics?.most_popular_sources?.length || 0,
      icon: <Database className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      change: '0%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Research Analytics</h2>
            <p className="text-gray-600">Usage insights and performance metrics</p>
          </div>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            className="card relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${kpi.color} rounded-xl text-white shadow-lg`}>
                  {kpi.icon}
                </div>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  {kpi.change}
                </span>
              </div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h4>
              <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Trends */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Search Trends</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.search_trends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="searches"
                  stroke="#3B82F6"
                  fill="url(#searchGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="searchGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Popular Sources */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-800">Popular Data Sources</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.most_popular_sources || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                >
                  {(analytics?.most_popular_sources || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sourceColors[index % sourceColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Queries */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Top Search Queries</h3>
        </div>
        <div className="space-y-4">
          {(analytics?.top_queries || []).map((query, index) => (
            <motion.div
              key={query.query}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {index + 1}
                </div>
                <span className="font-medium text-gray-800">{query.query}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{query.count} searches</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(query.count / Math.max(...(analytics?.top_queries || []).map(q => q.count))) * 100}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Source Performance */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Source Performance</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.most_popular_sources || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="source" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="url(#barGradient)" 
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ResearchAnalytics;