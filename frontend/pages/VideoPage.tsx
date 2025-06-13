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
  Mic,
  Palette,
  RefreshCw,
  Info,
  Sparkles
} from 'lucide-react';
import { useApi, apiService } from '../hooks/useApi';

interface VideoGenerationResponse {
  success: boolean;
  video_url?: string;
  video_id?: string;
  processing_time?: number;
  video_metadata?: any;
  status: string;
  error?: string;
  demo_mode?: boolean;
}

const VideoPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [script, setScript] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    data: videoResult,
    loading,
    error,
    execute: generateVideo,
    reset
  } = useApi<VideoGenerationResponse>(apiService.generateTavusVideo);

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;

    try {
      // Step 1: Generate script using OpenAI
      const scriptResponse = await fetch('http://localhost:8000/run/script_generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_prompt: prompt.trim() })
      });

      if (!scriptResponse.ok) {
        throw new Error('Failed to generate script');
      }

      const scriptData = await scriptResponse.json();
      const generatedScript = scriptData.video_script || scriptData.output?.video_script;
      
      if (!generatedScript) {
        throw new Error('No script generated');
      }

      setScript(generatedScript);

      // Step 2: Generate video using Tavus
      const result = await generateVideo({
        script: generatedScript,
        title: prompt.trim()
      });

      if (result?.success) {
        console.log('✅ Video generated successfully:', result);
      } else {
        console.error('❌ Video generation failed:', result?.error);
      }
    } catch (err) {
      console.error('Error in video generation process:', err);
    }
  };

  const handleReset = () => {
    reset();
    setPrompt('');
    setScript('');
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
          <p className="text-gray-600">Transform your ideas into engaging AI-powered videos</p>
        </div>
      </motion.div>

      {/* Main Video Generation Card */}
      <motion.div 
        className="card overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Create AI Video</h3>
              <p className="text-sm text-gray-500">OpenAI Script + Tavus Video Generation</p>
            </div>
          </div>
          
          <motion.button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-lg transition-colors ${
              showAdvanced ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Video Topic / Prompt
          </label>
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.01 }}
          >
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-none"
              rows={4}
              placeholder="Enter your video topic... e.g., 'Introduce our new AI-powered project management tool that helps teams collaborate 10x faster'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {prompt.length}/500
            </div>
          </motion.div>
        </div>

        {/* Advanced Options */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              className="mb-6 p-4 bg-gray-50 rounded-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Advanced Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Script Style
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Energetic</option>
                    <option>Educational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Video Length
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>30 seconds</option>
                    <option>45 seconds</option>
                    <option>60 seconds</option>
                    <option>90 seconds</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            onClick={handleGenerateVideo}
            disabled={loading || !prompt.trim()}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
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

          {(videoResult || error || script) && (
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

        {/* Generated Script Display */}
        <AnimatePresence>
          {script && (
            <motion.div 
              className="mb-6 p-4 border-2 border-blue-200 bg-blue-50 rounded-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <FileVideo className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Generated Script</h4>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {script}
                </pre>
              </div>
              <div className="mt-3 text-xs text-blue-600">
                Script length: {script.length} characters • ~{Math.ceil(script.split(' ').length / 150)} minutes
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Results */}
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
                className={`flex items-center justify-between p-4 border-2 rounded-xl ${getStatusColor(videoResult.status)}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center">
                  {getStatusIcon(videoResult.status)}
                  <div className="ml-3">
                    <span className="font-semibold text-lg">
                      Video {videoResult.status === 'completed' ? 'Generated Successfully' : 
                             videoResult.status === 'error' ? 'Generation Failed' : 
                             'Processing...'}
                    </span>
                    {videoResult.processing_time && (
                      <p className="text-sm opacity-75 mt-1">
                        Processing time: {videoResult.processing_time.toFixed(1)}s
                      </p>
                    )}
                    {videoResult.demo_mode && (
                      <p className="text-sm opacity-75 mt-1 text-purple-600">
                        🎬 Demo Mode: Using sample video for demonstration
                      </p>
                    )}
                  </div>
                </div>
                
                {videoResult.status === 'completed' && videoResult.video_url && (
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

              {/* Video Player */}
              {videoResult.status === 'completed' && videoResult.video_url && (
                <motion.div 
                  className="p-4 border-2 border-gray-200 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Video className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-800">Your AI Generated Video</h4>
                    {videoResult.demo_mode && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Demo
                      </span>
                    )}
                  </div>
                  
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-auto max-h-96"
                      poster="/api/placeholder/800/450"
                    >
                      <source src={videoResult.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>Video ID: {videoResult.video_id}</span>
                      {videoResult.video_metadata?.duration_estimate && (
                        <span>Duration: ~{Math.floor(videoResult.video_metadata.duration_estimate / 60)}:{(videoResult.video_metadata.duration_estimate % 60).toString().padStart(2, '0')}</span>
                      )}
                    </div>
                    <a
                      href={videoResult.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Open in new tab →
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Error Details */}
              {videoResult.status === 'error' && videoResult.error && (
                <motion.div 
                  className="p-4 border-2 border-red-200 bg-red-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-semibold text-red-800 mb-2">Error Details</h4>
                  <p className="text-sm text-red-600">{videoResult.error}</p>
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
        transition={{ delay: 0.2 }}
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
            <p className="text-sm text-gray-600">Tavus AI transforms the script into a professional video</p>
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