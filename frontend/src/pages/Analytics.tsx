import React from 'react';
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
} from 'recharts';
import MetricsCard from '../components/MetricsCard';
import { mockAnalyticsData, mockPerformanceMetrics } from '../data/mockData';

const Analytics: React.FC = () => {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <motion.h1
        className="text-2xl font-semibold text-gray-900 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Content Analytics
      </motion.h1>

      {/* Performance metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockPerformanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MetricsCard metric={metric} />
          </motion.div>
        ))}
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-medium mb-4">Content Production</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockAnalyticsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="content" fill="#1A365D" name="Content Items" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-medium mb-4">Content Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockAnalyticsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#0D9488"
                  name="Engagement"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="conversion"
                  stroke="#7E22CE"
                  name="Conversion"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Content type breakdown */}
      <motion.div
        className="card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-4">Content Type Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={[
                { type: 'Blog Posts', count: 24 },
                { type: 'Social Media', count: 42 },
                { type: 'Email', count: 18 },
                { type: 'Video', count: 9 },
                { type: 'Whitepaper', count: 6 },
              ]}
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="type" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#7E22CE" name="Content Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Agent performance comparison */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-lg font-medium mb-4">Agent Performance</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                {
                  name: 'Strategist',
                  tasks: 42,
                  time: 36,
                  success: 94,
                },
                {
                  name: 'Researcher',
                  tasks: 68,
                  time: 42,
                  success: 88,
                },
                {
                  name: 'Writer',
                  tasks: 125,
                  time: 64,
                  success: 92,
                },
                {
                  name: 'Quality',
                  tasks: 98,
                  time: 24,
                  success: 96,
                },
                {
                  name: 'Publisher',
                  tasks: 76,
                  time: 36,
                  success: 91,
                },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#1A365D" name="Tasks Completed" />
              <Bar dataKey="time" fill="#0D9488" name="Avg Time (hours)" />
              <Bar dataKey="success" fill="#7E22CE" name="Success Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;