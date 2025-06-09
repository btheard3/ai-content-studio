import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart3, History, Settings } from 'lucide-react';
import ResearchInterface from '../components/ResearchInterface';
import ResearchAnalytics from '../components/ResearchAnalytics';

const ResearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');

  const tabs = [
    { id: 'search', label: 'Research Search', icon: <Search className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'history', label: 'Search History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return <ResearchInterface />;
      case 'analytics':
        return <ResearchAnalytics />;
      case 'history':
        return (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Search History</h2>
            <p className="text-gray-600">Search history functionality coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Research Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <ResearchInterface />;
    }
  };

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      {/* Tab Navigation */}
      <motion.div 
        className="flex items-center gap-1 mb-8 bg-gray-100 p-1 rounded-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default ResearchPage;