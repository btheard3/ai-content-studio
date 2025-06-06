import React from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  FileSearch,
  PenTool,
  CheckCircle,
  Upload,
} from 'lucide-react';
import { WorkflowStage } from '../types';

interface WorkflowVisualizerProps {
  activeStage: WorkflowStage;
  onStageClick?: (stage: WorkflowStage) => void;
}

const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  activeStage,
  onStageClick,
}) => {
  const stages = [
    {
      key: WorkflowStage.PLANNING,
      label: 'Planning',
      icon: <BrainCircuit className="w-5 h-5" />,
      color: 'bg-primary-600',
      textColor: 'text-primary-600',
      description: 'Strategy & planning',
    },
    {
      key: WorkflowStage.RESEARCH,
      label: 'Research',
      icon: <FileSearch className="w-5 h-5" />,
      color: 'bg-secondary-600',
      textColor: 'text-secondary-600',
      description: 'Data gathering',
    },
    {
      key: WorkflowStage.WRITING,
      label: 'Writing',
      icon: <PenTool className="w-5 h-5" />,
      color: 'bg-accent-600',
      textColor: 'text-accent-600',
      description: 'Content creation',
    },
    {
      key: WorkflowStage.REVIEW,
      label: 'Review',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-success-600',
      textColor: 'text-success-600',
      description: 'Quality check',
    },
    {
      key: WorkflowStage.PUBLISHING,
      label: 'Publishing',
      icon: <Upload className="w-5 h-5" />,
      color: 'bg-warning-600',
      textColor: 'text-warning-600',
      description: 'Distribution',
    },
  ];

  const isStageActive = (stage: WorkflowStage) => {
    const stageOrder = Object.values(WorkflowStage);
    const activeIndex = stageOrder.indexOf(activeStage);
    const stageIndex = stageOrder.indexOf(stage);
    return stageIndex <= activeIndex;
  };

  const isStageCompleted = (stage: WorkflowStage) => {
    const stageOrder = Object.values(WorkflowStage);
    const activeIndex = stageOrder.indexOf(activeStage);
    const stageIndex = stageOrder.indexOf(stage);
    return stageIndex < activeIndex;
  };

  return (
    <div className="card p-8">
      <h2 className="text-xl font-medium mb-6">Content Workflow</h2>
      <div className="relative">
        <div className="flex justify-between items-center">
          {stages.map((stage, index) => (
            <div
              key={stage.key}
              className="flex flex-col items-center relative z-10"
              onClick={() => onStageClick && onStageClick(stage.key)}
            >
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                  isStageActive(stage.key)
                    ? stage.color + ' text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                whileHover={{ scale: 1.1 }}
                animate={{
                  scale: activeStage === stage.key ? [1, 1.1, 1] : 1,
                  transition: { 
                    duration: 0.5, 
                    repeat: activeStage === stage.key ? Infinity : 0,
                    repeatType: 'reverse'
                  }
                }}
              >
                {stage.icon}
              </motion.div>
              <span
                className={`mt-2 font-medium ${
                  isStageActive(stage.key) ? stage.textColor : 'text-gray-500'
                }`}
              >
                {stage.label}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {stage.description}
              </span>
            </div>
          ))}
        </div>

        {/* Connecting lines */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

        {/* Active progress */}
        <motion.div
          className="absolute top-6 left-0 h-0.5 bg-primary-600 z-1"
          initial={{ width: '0%' }}
          animate={{
            width: `${
              (Object.values(WorkflowStage).indexOf(activeStage) /
                (Object.values(WorkflowStage).length - 3)) *
              100
            }%`,
          }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
    </div>
  );
};

export default WorkflowVisualizer;