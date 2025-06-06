import React from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Cloud, 
  Database, 
  Key, 
  AlertCircle, 
  Info, 
  Settings as SettingsIcon,
  BrainCircuit
} from 'lucide-react';
import { useAgents } from '../context/AgentContext';

const Settings: React.FC = () => {
  const { agents } = useAgents();

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <motion.h1
        className="text-2xl font-semibold text-gray-900 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        System Settings
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Google Cloud Integration */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Cloud className="w-5 h-5 text-primary-600 mr-2" />
                <h2 className="text-lg font-medium">Google Cloud Integration</h2>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-success-100 text-success-800">
                Connected
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Connect your Google Cloud account to enable BigQuery data analysis and other Google Cloud services.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value="content-adk-12345"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>us-central1</option>
                  <option>us-east1</option>
                  <option>europe-west1</option>
                  <option>asia-east1</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button className="btn btn-outline flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Update API Keys
              </button>
              <button className="btn btn-primary flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </motion.div>

          {/* Database Configuration */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center mb-4">
              <Database className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-medium">Database Configuration</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Configure database connections for content storage and analytics.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Database Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>BigQuery</option>
                  <option>Cloud SQL</option>
                  <option>Firestore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Connection String
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value="projects/content-adk-12345/datasets/content_data"
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-warning-700 bg-warning-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>Changes to database configuration require system restart</p>
              </div>
            </div>
            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
              <button className="btn btn-primary flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </button>
            </div>
          </motion.div>

          {/* Agent Configuration */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <BrainCircuit className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-medium">Agent Configuration</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Configure agent behavior, capabilities, and communication protocols.
            </p>
            
            <div className="space-y-6">
              {agents.map((agent) => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{agent.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      agent.status === 'active' ? 'bg-success-100 text-success-800' : 
                      agent.status === 'idle' ? 'bg-warning-100 text-warning-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Priority Level
                      </label>
                      <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Resource Allocation
                      </label>
                      <select className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg">
                        <option>Standard</option>
                        <option>Enhanced</option>
                        <option>Maximum</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="text-primary-600 hover:text-primary-700">
                      Advanced Settings
                    </button>
                    <button className="text-gray-600 hover:text-gray-700">
                      Reset Defaults
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-6">
              <button className="btn btn-primary flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save All Agent Settings
              </button>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* System Information */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <Info className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-medium">System Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium">1.0.5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium">Mar 15, 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ADK Version</span>
                <span className="text-sm font-medium">3.2.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Python Runtime</span>
                <span className="text-sm font-medium">3.10.5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-xs font-medium bg-success-100 text-success-800 px-2 py-0.5 rounded-full">Healthy</span>
              </div>
            </div>
          </motion.div>

          {/* System Controls */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center mb-4">
              <SettingsIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-medium">System Controls</h2>
            </div>
            <div className="space-y-3">
              <button className="btn btn-outline w-full justify-center">
                Restart Services
              </button>
              <button className="btn btn-outline w-full justify-center">
                Flush Cache
              </button>
              <button className="btn btn-outline w-full justify-center">
                Run Diagnostics
              </button>
              <button className="btn btn-outline w-full justify-center text-error-600 hover:text-error-700 hover:border-error-300">
                Reset System
              </button>
            </div>
          </motion.div>

          {/* License Information */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-lg font-medium mb-4">License</h2>
            <div className="p-3 bg-success-50 text-success-800 rounded-lg mb-4">
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                <span className="font-medium">Active License</span>
              </div>
              <p className="text-sm mt-1">Valid until Mar 15, 2026</p>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">License ID: ADK-CONTENT-PRO-12345</p>
              <p>For support or renewal inquiries, please contact support@adk-content.example.com</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;