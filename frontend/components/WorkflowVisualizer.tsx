import React from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  FileSearch,
  PenTool,
  CheckCircle,
  Upload,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { WorkflowStage } from "../types";

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
      label: "Planning",
      icon: <BrainCircuit className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      description: "Strategy & planning",
    },
    {
      key: WorkflowStage.RESEARCH,
      label: "Research",
      icon: <FileSearch className="w-5 h-5" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      description: "Data gathering",
    },
    {
      key: WorkflowStage.WRITING,
      label: "Writing",
      icon: <PenTool className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      description: "Content creation",
    },
    {
      key: WorkflowStage.REVIEW,
      label: "Review",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      description: "Quality check",
    },
    {
      key: WorkflowStage.PUBLISHED,
      label: "Publishing",
      icon: <Upload className="w-5 h-5" />,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      description: "Distribution",
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const stageVariants = {
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
      className="card p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Play className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Content Workflow</h2>
            <p className="text-sm text-gray-500">Multi-agent collaboration pipeline</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Pause workflow"
          >
            <Pause className="w-4 h-4 text-gray-600" />
          </motion.button>
          <motion.button
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Reset workflow"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Workflow Stages */}
      <div className="relative">
        <motion.div 
          className="flex justify-between items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stages.map((stage, index) => (
            <motion.div
              key={stage.key}
              className="flex flex-col items-center relative z-10 cursor-pointer group"
              variants={stageVariants}
              onClick={() => onStageClick && onStageClick(stage.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Stage Circle */}
              <motion.div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isStageActive(stage.key as WorkflowStage)
                    ? `bg-gradient-to-br ${stage.color} text-white shadow-lg`
                    : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                }`}
                animate={{
                  scale: activeStage === stage.key ? [1, 1.1, 1] : 1,
                  transition: {
                    duration: 2,
                    repeat: activeStage === stage.key ? Infinity : 0,
                    repeatType: "reverse",
                  },
                }}
              >
                {stage.icon}
              </motion.div>

              {/* Stage Info */}
              <div className="mt-4 text-center">
                <span
                  className={`font-semibold text-sm ${
                    isStageActive(stage.key as WorkflowStage)
                      ? stage.textColor
                      : "text-gray-500"
                  }`}
                >
                  {stage.label}
                </span>
                <p className="text-xs text-gray-400 mt-1 max-w-20">
                  {stage.description}
                </p>
              </div>

              {/* Completion Indicator */}
              {isStageCompleted(stage.key as WorkflowStage) && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Active Pulse */}
              {activeStage === stage.key && (
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stage.color} opacity-20`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.1, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Connecting Lines */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 z-0" />

        {/* Active Progress Line */}
        <motion.div
          className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 z-1"
          initial={{ width: "0%" }}
          animate={{
            width: `${
              (Object.values(WorkflowStage).indexOf(activeStage) /
                (Object.values(WorkflowStage).length - 3)) *
              100
            }%`,
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>

      {/* Stage Details */}
      <motion.div 
        className="mt-8 p-4 bg-gray-50 rounded-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
            stages.find(s => s.key === activeStage)?.color || 'from-gray-400 to-gray-500'
          } flex items-center justify-center text-white`}>
            {stages.find(s => s.key === activeStage)?.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              Current Stage: {stages.find(s => s.key === activeStage)?.label}
            </h3>
            <p className="text-sm text-gray-500">
              {stages.find(s => s.key === activeStage)?.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkflowVisualizer;