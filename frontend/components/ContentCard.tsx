import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Eye,
  TrendingUp
} from "lucide-react";
import { useApi, apiService } from "../hooks/useApi";
import { useAgents } from "../context/AgentContext";
import CreativeWriterCard from "./CreativeWriterCard";
import LoadingSpinner from "./LoadingSpinner";

interface WorkflowStage {
  agent_id: string;
  stage_name: string;
  status: string;
  output_keys?: string[];
  error?: string;
}

interface WorkflowResponse {
  success: boolean;
  data?: any;
  error?: string;
  stages_completed?: WorkflowStage[];
  workflow_type?: string;
}

const ContentGenerationForm = () => {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { addWorkflowResult } = useAgents();
  
  const {
    data: workflowResult,
    loading,
    error,
    execute: runWorkflow,
    reset
  } = useApi<WorkflowResponse>(apiService.runWorkflow);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const result = await runWorkflow({
      text: input,
      workflow_type: "content_generation"
    });

    if (result?.success) {
      addWorkflowResult(result);
      setIsExpanded(true);
    }
  };

  const handleReset = () => {
    reset();
    setInput("");
    setIsExpanded(false);
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-emerald-200 bg-emerald-50 shadow-emerald-100";
      case "error":
        return "border-red-200 bg-red-50 shadow-red-100";
      default:
        return "border-gray-200 bg-gray-50 shadow-gray-100";
    }
  };

  const cardVariants = {
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

  const stageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      className="card mb-8 overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              AI Content Generation Workflow
            </h3>
            <p className="text-sm text-gray-500">
              Multi-agent collaborative content creation
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.div 
            className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TrendingUp className="w-3 h-3" />
            94% Success Rate
          </motion.div>
        </div>
      </div>
      
      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Content Brief
        </label>
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.01 }}
        >
          <textarea
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-none"
            rows={4}
            placeholder="Describe your content needs in detail... e.g., 'Create a comprehensive guide about AI implementation in healthcare for C-suite executives, focusing on ROI, implementation strategies, and risk mitigation.'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {input.length}/500
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
              Processing Workflow...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Generate Content
            </>
          )}
        </motion.button>

        {(workflowResult || error) && (
          <motion.button
            onClick={handleReset}
            className="flex items-center px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </motion.button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div
          className="mb-6 p-8 border-2 border-blue-200 bg-blue-50 rounded-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <LoadingSpinner size="lg" text="Processing your content request through our AI agents..." />
        </motion.div>
      )}

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="mb-6 p-4 border-2 border-red-200 bg-red-50 rounded-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center text-red-600 text-sm">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <div>
                <strong>Workflow Error:</strong>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflow Results */}
      <AnimatePresence>
        {workflowResult && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Status Header */}
            <motion.div 
              className={`flex items-center justify-between p-4 border-2 rounded-xl ${
                workflowResult.success 
                  ? 'border-emerald-200 bg-emerald-50' 
                  : 'border-red-200 bg-red-50'
              }`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center">
                {workflowResult.success ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                )}
                <div>
                  <span className="font-semibold text-lg">
                    Workflow {workflowResult.success ? "Completed Successfully" : "Failed"}
                  </span>
                  <p className="text-sm opacity-75 mt-1">
                    {workflowResult.stages_completed?.length || 0} stages processed
                  </p>
                </div>
              </div>
              
              {workflowResult.success && (
                <div className="flex items-center gap-2">
                  <motion.button
                    className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Preview content"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Download content"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Share content"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Stages Progress */}
            {workflowResult.stages_completed && workflowResult.stages_completed.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-lg">Workflow Pipeline:</h4>
                <div className="space-y-3">
                  {workflowResult.stages_completed.map((stage, index) => (
                    <motion.div
                      key={stage.agent_id}
                      className={`p-4 border-2 rounded-xl ${getStageColor(stage.status)} relative overflow-hidden`}
                      variants={stageVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStageIcon(stage.status)}
                          <div className="ml-3">
                            <span className="font-semibold">{stage.stage_name}</span>
                            <span className="ml-2 text-sm text-gray-500">({stage.agent_id})</span>
                          </div>
                        </div>
                        {index < workflowResult.stages_completed!.length - 1 && (
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      {stage.error && (
                        <p className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded-lg">
                          {stage.error}
                        </p>
                      )}
                      {stage.output_keys && stage.output_keys.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {stage.output_keys.map((key) => (
                            <span 
                              key={key}
                              className="px-2 py-1 bg-white bg-opacity-50 text-xs rounded-full"
                            >
                              {key}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Output */}
            {workflowResult.success && workflowResult.data && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-semibold text-gray-800 text-lg">Generated Content:</h4>
                
                {/* Campaign Theme */}
                {workflowResult.data.campaign_theme && (
                  <motion.div 
                    className="p-4 border-2 border-blue-200 bg-blue-50 rounded-xl"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Campaign Theme
                    </h5>
                    <p className="text-blue-700">{workflowResult.data.campaign_theme}</p>
                  </motion.div>
                )}

                {/* Creative Writer Output */}
                {workflowResult.data.creative_draft && (
                  <CreativeWriterCard
                    creative_draft={workflowResult.data.creative_draft}
                    content_sections={workflowResult.data.content_sections || ""}
                    tone_analysis={workflowResult.data.tone_analysis || ""}
                  />
                )}

                {/* Final Content */}
                {workflowResult.data.final_content && (
                  <motion.div 
                    className="p-4 border-2 border-gray-200 bg-gray-50 rounded-xl relative"
                    whileHover={{ scale: 1.005 }}
                  >
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                      <span>Final Content</span>
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                    </h5>
                    <div className={`text-sm text-gray-700 whitespace-pre-line transition-all duration-300 ${
                      isExpanded ? 'max-h-none' : 'max-h-48 overflow-hidden'
                    }`}>
                      {workflowResult.data.final_content}
                    </div>
                    {!isExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                    )}
                  </motion.div>
                )}

                {/* Quality Score */}
                {workflowResult.data.quality_score && (
                  <motion.div 
                    className="p-4 border-2 border-emerald-200 bg-emerald-50 rounded-xl"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h5 className="font-semibold text-emerald-800 mb-3">Quality Assessment</h5>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <motion.span 
                          className="text-3xl font-bold text-emerald-700"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7, type: "spring" }}
                        >
                          {Math.round(workflowResult.data.quality_score * 10)}%
                        </motion.span>
                        <span className="ml-2 text-emerald-600">Quality Score</span>
                      </div>
                      <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${workflowResult.data.quality_score * 10}%` }}
                          transition={{ delay: 0.8, duration: 1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Publishing Status */}
                {workflowResult.data.published_status && (
                  <motion.div 
                    className="p-4 border-2 border-purple-200 bg-purple-50 rounded-xl"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h5 className="font-semibold text-purple-800 mb-2">Publishing Status</h5>
                    <div className="text-sm text-purple-700 whitespace-pre-line">
                      {workflowResult.data.published_status}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContentGenerationForm;