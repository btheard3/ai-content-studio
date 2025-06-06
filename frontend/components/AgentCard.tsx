import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileSearch, PenTool, CheckCircle, Upload } from 'lucide-react';
import { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  // Get the right icon based on agent type
  const getAgentIcon = () => {
    switch (agent.type) {
      case 'strategist':
        return <Brain className="w-5 h-5" />;
      case 'researcher':
        return <FileSearch className="w-5 h-5" />;
      case 'writer':
        return <PenTool className="w-5 h-5" />;
      case 'quality':
        return <CheckCircle className="w-5 h-5" />;
      case 'publisher':
        return <Upload className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  // Get the right background color for the agent type
  const getAgentColorClass = () => {
    switch (agent.type) {
      case 'strategist':
        return 'bg-primary-600';
      case 'researcher':
        return 'bg-secondary-600';
      case 'writer':
        return 'bg-accent-600';
      case 'quality':
        return 'bg-success-600';
      case 'publisher':
        return 'bg-warning-600';
      default:
        return 'bg-primary-600';
    }
  };

  // Get the status indicator
  const getStatusIndicator = () => {
    switch (agent.status) {
      case 'active':
        return 'bg-success-500';
      case 'idle':
        return 'bg-warning-500';
      case 'processing':
        return 'bg-primary-500 animate-pulse';
      case 'error':
        return 'bg-error-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <motion.div
      className="agent-card card-hover cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <div className="agent-header">
        <div className={`agent-icon ${getAgentColorClass()}`}>{getAgentIcon()}</div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{agent.name}</h3>
          <div className="flex items-center space-x-1">
            <span className={`agent-status ${getStatusIndicator()}`}></span>
            <span className="text-sm text-gray-500 capitalize">{agent.status}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{agent.description}</p>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Tasks completed</span>
          <span className="font-medium">{agent.metrics.tasksCompleted}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getAgentColorClass()}`}
            style={{ width: `${Math.min(100, agent.metrics.successRate)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Success rate</span>
          <span className="text-xs font-medium">{agent.metrics.successRate}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentCard;