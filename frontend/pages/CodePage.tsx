import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, History, Settings, BarChart3, BookOpen } from 'lucide-react';
import CodeGeneratorCard from '../components/CodeGeneratorCard';

const CodePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generate');

  const tabs = [
    { id: 'generate', label: 'Generate Code', icon: <Code className="w-4 h-4" /> },
    { id: 'history', label: 'Code History', icon: <History className="w-4 h-4" /> },
    { id: 'templates', label: 'Templates', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate':
        return <CodeGeneratorCard />;
      case 'history':
        return (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Code Generation History</h2>
            <p className="text-gray-600">Your generated code projects will appear here...</p>
            <div className="mt-6 space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">Task Management API</h3>
                    <p className="text-sm text-gray-500">Python • FastAPI • Generated 2 hours ago</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Code
                  </button>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">React Dashboard</h3>
                    <p className="text-sm text-gray-500">TypeScript • React • Generated 1 day ago</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Code Templates</h2>
            <p className="text-gray-600">Pre-built templates for common use cases...</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'REST API', description: 'Basic CRUD API with authentication', language: 'Python' },
                { name: 'React Component', description: 'Reusable UI component with props', language: 'TypeScript' },
                { name: 'Database Model', description: 'ORM model with relationships', language: 'Python' },
                { name: 'Microservice', description: 'Containerized microservice', language: 'Go' },
                { name: 'CLI Tool', description: 'Command-line utility', language: 'Rust' },
                { name: 'Web Scraper', description: 'Data extraction tool', language: 'Python' }
              ].map((template, index) => (
                <motion.div
                  key={template.name}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="font-medium text-gray-800 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {template.language}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Use Template
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Code Generation Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">42</div>
                <div className="text-sm text-gray-600">Projects Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">8</div>
                <div className="text-sm text-gray-600">Languages Used</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
                <div className="text-sm text-gray-600">Files Created</div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="font-semibold text-gray-800 mb-4">Most Used Languages</h3>
              <div className="space-y-3">
                {[
                  { name: 'Python', percentage: 35, color: 'bg-blue-500' },
                  { name: 'TypeScript', percentage: 28, color: 'bg-emerald-500' },
                  { name: 'JavaScript', percentage: 20, color: 'bg-yellow-500' },
                  { name: 'Java', percentage: 17, color: 'bg-red-500' }
                ].map((lang) => (
                  <div key={lang.name} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-600">{lang.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${lang.color}`}
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-500">{lang.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Code Generator Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Default Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Default Language
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Python</option>
                      <option>TypeScript</option>
                      <option>JavaScript</option>
                      <option>Java</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Default Complexity
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Simple</option>
                      <option>Medium</option>
                      <option>Complex</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Code Style</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-gray-700">Include detailed comments</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-gray-700">Generate unit tests by default</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Use strict type checking</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-gray-700">Include error handling</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Output Format</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="format" className="rounded" defaultChecked />
                    <span className="text-sm text-gray-700">Separate files</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="format" className="rounded" />
                    <span className="text-sm text-gray-700">Single file with sections</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <CodeGeneratorCard />;
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
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Code className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Code Generator</h1>
          <p className="text-gray-600">Generate clean, documented code in multiple programming languages</p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex items-center gap-1 mb-8 bg-gray-100 p-1 rounded-xl overflow-x-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
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

export default CodePage;