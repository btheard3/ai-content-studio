import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Play, History, Settings, BarChart3 } from 'lucide-react';
import VideoCreatorCard from '../components/VideoCreatorCard';

const VideoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');

  const tabs = [
    { id: 'create', label: 'Create Video', icon: <Video className="w-4 h-4" /> },
    { id: 'history', label: 'Video History', icon: <History className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'create':
        return <VideoCreatorCard />;
      case 'history':
        return (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Video History</h2>
            <p className="text-gray-600">Your generated videos will appear here...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Video Analytics</h2>
            <p className="text-gray-600">Video performance metrics coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Video Settings</h2>
            <p className="text-gray-600">Configure your video generation preferences...</p>
          </div>
        );
      default:
        return <VideoCreatorCard />;
    }
  };

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <motion.div 
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Video className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Video Creator</h1>
          <p className="text-gray-600">Transform your text into engaging videos with Elai AI</p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex items-center gap-1 mb-8 bg-gray-100 p-1 rounded-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
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

export default VideoPage;