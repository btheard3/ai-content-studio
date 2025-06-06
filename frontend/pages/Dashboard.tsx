import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, BarChart2, Clock, Layers, CheckCircle2 } from 'lucide-react';
import AgentCard from '../components/AgentCard';
import ContentCard from '../components/ContentCard';
import MetricsCard from '../components/MetricsCard';
import ActivityFeed from '../components/ActivityFeed';
import { useAgents } from '../context/AgentContext';
import { mockActivityLogs, mockPerformanceMetrics } from '../data/mockData';
import { WorkflowStage } from '../types';

const Dashboard: React.FC = () => {
  const { agents, contentItems, activeWorkflows, completedItems } = useAgents();

  // Get active content items (not published or archived)
  const activeContent = contentItems.filter(
    (item) => item.stage !== WorkflowStage.PUBLISHED && item.stage !== WorkflowStage.ARCHIVED
  ).slice(0, 3);

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <motion.h1 
          className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Content Creation Dashboard
        </motion.h1>
        <motion.button 
          className="btn btn-primary flex items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Content
        </motion.button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="card bg-primary-50 border-primary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Layers className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{activeWorkflows}</h3>
              <p className="text-sm text-gray-600">Active Workflows</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card bg-secondary-50 border-secondary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{completedItems}</h3>
              <p className="text-sm text-gray-600">Published Content</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card bg-accent-50 border-accent-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">78%</h3>
              <p className="text-sm text-gray-600">Content Performance</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="card bg-success-50 border-success-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-success-100 rounded-lg">
              <Clock className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">2.4 days</h3>
              <p className="text-sm text-gray-600">Avg. Completion Time</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Agents Section */}
      <h2 className="text-xl font-medium text-gray-900 mb-4">Agent Network</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {agents.map((agent, index) => (
          <motion.div 
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <AgentCard agent={agent} />
          </motion.div>
        ))}
      </div>

      {/* Content and Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Active Content</h2>
          <div className="space-y-4">
            {activeContent.map((content, index) => (
              <motion.div 
                key={content.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ContentCard content={content} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Performance</h2>
            <div className="space-y-4">
              {mockPerformanceMetrics.slice(0, 2).map((metric, index) => (
                <motion.div 
                  key={metric.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <MetricsCard metric={metric} />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ActivityFeed activities={mockActivityLogs.slice(0, 3)} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;