import React from "react";
import { motion } from "framer-motion";
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
} from "recharts";
import { TrendingUp, Users, FileText, Clock, Target, Award } from "lucide-react";
import MetricsCard from "../components/MetricsCard";
import { mockAnalyticsData, mockPerformanceMetrics } from "../data/mockData";

const Analytics: React.FC = () => {
  const chartData = [
    { month: "Jan", content: 24, engagement: 78, conversion: 12 },
    { month: "Feb", content: 32, engagement: 82, conversion: 15 },
    { month: "Mar", content: 28, engagement: 85, conversion: 18 },
    { month: "Apr", content: 45, engagement: 88, conversion: 22 },
    { month: "May", content: 38, engagement: 91, conversion: 25 },
    { month: "Jun", content: 52, engagement: 94, conversion: 28 },
  ];

  const contentTypeData = [
    { type: "Blog Posts", count: 24, color: "#3B82F6" },
    { type: "Social Media", count: 42, color: "#10B981" },
    { type: "Email", count: 18, color: "#8B5CF6" },
    { type: "Video", count: 9, color: "#F59E0B" },
    { type: "Whitepaper", count: 6, color: "#EF4444" },
  ];

  const agentPerformanceData = [
    { name: "Strategist", tasks: 42, time: 36, success: 94 },
    { name: "Researcher", tasks: 68, time: 42, success: 88 },
    { name: "Writer", tasks: 125, time: 64, success: 92 },
    { name: "Quality", tasks: 98, time: 24, success: 96 },
    { name: "Publisher", tasks: 76, time: 36, success: 91 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="px-4 py-6 md:px-6 md:py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="flex items-center gap-3 mb-8"
        variants={itemVariants}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Analytics</h1>
          <p className="text-gray-600">Performance insights and metrics</p>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
      >
        {mockPerformanceMetrics.map((metric, index) => (
          <MetricsCard key={metric.name} metric={metric} index={index} />
        ))}
      </motion.div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Content Production Chart */}
        <motion.div
          className="card"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Content Production</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="content" 
                  fill="url(#contentGradient)" 
                  name="Content Items"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="contentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Performance Trends */}
        <motion.div
          className="card"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Performance Trends</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Engagement %"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="conversion"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="Conversion %"
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Content Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          className="card"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Content Distribution</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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

        {/* Agent Performance */}
        <motion.div
          className="card"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Agent Performance</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="tasks" fill="#3B82F6" name="Tasks Completed" radius={[2, 2, 0, 0]} />
                <Bar dataKey="success" fill="#10B981" name="Success Rate (%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div className="card text-center" variants={itemVariants}>
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Top Performer</h3>
          <p className="text-2xl font-bold text-emerald-600 mb-1">Quality Agent</p>
          <p className="text-sm text-gray-500">96% success rate</p>
        </motion.div>

        <motion.div className="card text-center" variants={itemVariants}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Fastest Agent</h3>
          <p className="text-2xl font-bold text-blue-600 mb-1">Quality Agent</p>
          <p className="text-sm text-gray-500">24 min avg time</p>
        </motion.div>

        <motion.div className="card text-center" variants={itemVariants}>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Most Active</h3>
          <p className="text-2xl font-bold text-purple-600 mb-1">Writer Agent</p>
          <p className="text-sm text-gray-500">125 tasks completed</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;