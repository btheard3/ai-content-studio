import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Play,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  Settings,
  Clock,
  FileVideo,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useApi, apiService } from '../hooks/useApi';
import ElaiVideoCard from '../components/ElaiVideoCard';

interface VideoTaskResponse {
  success: boolean;
  output?: {
    video_script: string;
    video_url: string;
    video_id: string;
    video_status: string;
    processing_time: number;
    video_metadata: any;
  };
  error?: string;
  stage?: string;
}

const VideoPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    data: videoResult,
    loading,
    error,
    execute: generateVideo,
    reset
  } = useApi<VideoTaskResponse>(apiService.runTask);

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;

    const result = await generateVideo({
      inputs: {
        user_prompt: prompt.trim(),
        text: "placeholder", // Required for ADK compatibility
        title: title.trim() || prompt.trim()
      }
    });

    if (result?.success) {
      console.log('✅ Video task completed successfully:', result);
    } else {
      console.error('❌ Video task failed:', result?.error);
    }
  };

  const handleReset = () => {
    reset();
    setPrompt('');
    setTitle('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-200 bg-emerald-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  // Safe parsing of video result
  const safeVideoOutput = videoResult?.output ? {
    video_url: videoResult.output.video_url || "",
    video_status: videoResult.output.video_status || "idle",
    video_id: videoResult.output.video_id || "",
    processing_time: videoResult.output.processing_time || 0,
    video_metadata: videoResult.output.video_metadata || {},
    video_script: videoResult.output.video_script || ""
  } : null;

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
          <h1 className="text-3xl font-bold text-gray-900">AI Video Generator</h1>
          <p className="text-gray-600">OpenAI Script Generation + Elai.io Video Creation</p>
        </div>
      </motion.div>

      {/* Direct Elai Video Generator */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ElaiVideoCard />
      </motion.div>

      {/* Workflow Video Generation Card */}
      <motion.div 
        className="card overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Script + Video Workflow</h3>
              <p className="text-sm text-gray-500">Prompt → OpenAI Script → Elai Video</p>
            </div>
          </div>
          
          <motion.button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-lg transition-colors ${
              showAdvanced ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Prompt Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Video Topic / Prompt
          </label>
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.01 }}
          >
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
              rows={4}
              placeholder="Enter your video topic... e.g., 'Create a video about hurricane safety tips for families'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {prompt.length}/500
            </div>
          </motion.div>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Video Title (Optional)
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            placeholder="Enter video title (will use prompt if empty)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            onClick={handleGenerateVideo}
            disabled={loading || !prompt.trim()}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Generating Video...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Generate AI Video
              </>
            )}
          </motion.button>

          {(videoResult || error) && (
            <motion.button
              onClick={handleReset}
              className="flex items-center px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </motion.button>
          )}
        </div>

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
                  <strong>Video Generation Error:</strong>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workflow Results */}
        <AnimatePresence>
          {videoResult && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Status Header */}
              <motion.div 
                className={`flex items-center justify-between p-4 border-2 rounded-xl ${
                  videoResult.success 
                    ? 'border-emerald-200 bg-emerald-50' 
                    : 'border-red-200 bg-red-50'
                }`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center">
                  {videoResult.success ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                  )}
                  <div>
                    <span className="font-semibold text-lg">
                      Video Task {videoResult.success ? "Completed Successfully" : "Failed"}
                    </span>
                    <p className="text-sm opacity-75 mt-1">
                      Script generation and video creation pipeline
                    </p>
                  </div>
                </div>
                
                {videoResult.success && safeVideoOutput?.video_url && (
                  <div className="flex items-center gap-2">
                    <motion.button
                      className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Download video"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Share video"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </motion.div>

              {/* Generated Script Display */}
              {safeVideoOutput?.video_script && (
                <motion.div 
                  className="p-4 border-2 border-blue-200 bg-blue-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FileVideo className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Generated Script</h4>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                      {safeVideoOutput.video_script}
                    </pre>
                  </div>
                  <div className="mt-3 text-xs text-blue-600">
                    Script length: {safeVideoOutput.video_script.length} characters
                  </div>
                </motion.div>
              )}

              {/* Video Player */}
              {safeVideoOutput?.video_url && (
                <motion.div
                  className="p-4 border-2 border-gray-200 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Video className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-800">Generated Video</h4>
                  </div>
                  
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video 
                      controls 
                      className="w-full h-auto max-h-96"
                      poster="/api/placeholder/800/450"
                    >
                      <source src={safeVideoOutput.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Video ID:</span>
                      <p className="text-gray-800">{safeVideoOutput.video_id || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <p className="text-gray-800">{safeVideoOutput.video_status}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Processing:</span>
                      <p className="text-gray-800">{safeVideoOutput.processing_time?.toFixed(1)}s</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Provider:</span>
                      <p className="text-gray-800">Elai.io</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Details */}
              {!videoResult.success && videoResult.error && (
                <motion.div 
                  className="p-4 border-2 border-red-200 bg-red-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-semibold text-red-800 mb-2">Error Details</h4>
                  <p className="text-sm text-red-600">{videoResult.error}</p>
                  {videoResult.stage && (
                    <p className="text-sm text-red-600 mt-1">Failed at stage: {videoResult.stage}</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Process Flow Visualization */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">1. Script Generation</h4>
            <p className="text-sm text-gray-600">OpenAI GPT-4 creates an engaging video script from your prompt</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">2. Video Creation</h4>
            <p className="text-sm text-gray-600">Elai.io transforms the script into a professional AI video</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">3. Ready to Share</h4>
            <p className="text-sm text-gray-600">Download, share, or embed your AI-generated video</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoPage;