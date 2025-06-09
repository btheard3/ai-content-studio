import React from "react";
import ContentGenerationForm from "../components/ContentCard";
import { useAgents } from "../context/AgentContext";

const Dashboard: React.FC = () => {
  const { agents, activeWorkflows, completedItems } = useAgents();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          AI Content Studio Dashboard
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Multi-Agent Content Generation
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500 mb-1">Active Workflows</h4>
          <p className="text-xl font-semibold text-gray-800">{activeWorkflows}</p>
          <p className="text-xs text-gray-400">Content in progress</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500 mb-1">Completed Content</h4>
          <p className="text-xl font-semibold text-gray-800">{completedItems}</p>
          <p className="text-xs text-gray-400">Published items</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500 mb-1">Active Agents</h4>
          <p className="text-xl font-semibold text-gray-800">
            {agents.filter(agent => agent.status === 'active').length}
          </p>
          <p className="text-xs text-gray-400">Currently processing</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500 mb-1">Success Rate</h4>
          <p className="text-xl font-semibold text-gray-800">94%</p>
          <p className="text-xs text-gray-400">Workflow completion</p>
        </div>
      </div>

      {/* Content Generation Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Generate New Content</h3>
        <ContentGenerationForm />
      </div>

      {/* Agent Status Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Network Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{agent.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  agent.status === 'active' ? 'bg-green-100 text-green-800' :
                  agent.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  agent.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {agent.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Tasks: {agent.tasksCompleted}</p>
                <p>Success: {(agent.successRate * 100).toFixed(0)}%</p>
                <p>Avg Time: {agent.avgCompletionTime}min</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;