import React, { useState, useEffect } from 'react';
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
  Info
} from 'lucide-react';
import { useApi, apiService } from '../hooks/useApi';

interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

interface Voice {
  id: string;
  name: string;
  language: string;
  gender: string;
  preview_url?: string;
}

interface VideoResponse {
  success: boolean;
  video_url?: string;
  video_id?: string;
  processing_time?: number;
  status: string;
  error?: string;
  demo_mode?: boolean;
  message?: string;
  template_used?: string;
  voice_used?: string;
}

const VideoCreatorCard: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [templatesError, setTemplatesError] = useState('');
  const [voicesError, setVoicesError] = useState('');

  const {
    data: videoResult,
    loading,
    error,
    execute: generateVideo,
    reset
  } = useApi<VideoResponse>(apiService.generateVideo);

  // Load templates and voices on component mount
  useEffect(() => {
    loadTemplatesAndVoices();
  }, []);

  const loadTemplatesAndVoices = async () => {
    await Promise.all([loadTemplates(), loadVoices()]);
  };

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      setTemplatesError('');
      
      const response = await fetch('http://localhost:8000/video/templates');
      const data = await response.json();
      
      if (data.success && data.templates) {
        setTemplates(data.templates);
        
        // Auto-select first template if none selected
        if (data.templates.length > 0 && !selectedTemplate) {
          setSelectedTemplate(data.templates[0].id);
        }
        
        console.log(`✅ Loaded ${data.templates.length} templates`);
      } else {
        setTemplatesError(data.error || 'Failed to load templates');
        console.warn('⚠️ Templates loading failed:', data.error);
      }
    } catch (error) {
      const errorMsg = 'Failed to connect to video service';
      setTemplatesError(errorMsg);
      console.error('❌ Templates loading error:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const loadVoices = async () => {
    try {
      setLoadingVoices(true);
      setVoicesError('');
      
      const response = await fetch('http://localhost:8000/video/voices');
      const data = await response.json();
      
      if (data.success && data.voices) {
        setVoices(data.voices);
        
        // Auto-select first voice if none selected
        if (data.voices.length > 0 && !selectedVoice) {
          setSelectedVoice(data.voices[0].id);
        }
        
        console.log(`✅ Loaded ${data.voices.length} voices`);
      } else {
        setVoicesError(data.error || 'Failed to load voices');
        console.warn('⚠️ Voices loading failed:', data.error);
      }
    } catch (error) {
      const errorMsg = 'Failed to connect to video service';
      setVoicesError(errorMsg);
      console.error('❌ Voices loading error:', error);
    } finally {
      setLoadingVoices(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!text.trim()) return;

    const result = await generateVideo({
      text: text.trim(),
      template_id: selectedTemplate || undefined,
      voice_id: selectedVoice || undefined
    });

    if (result?.success) {
      console.log('✅ Video generated successfully:', result);
    } else {
      console.error('❌ Video generation failed:', result?.error);
    }
  };

  const handleReset = () => {
    reset();
    setText('');
  };

  const handleRefreshTemplatesAndVoices = () => {
    loadTemplatesAndVoices();
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
    <motion.div 
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Video className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">AI Video Creator</h3>
            <p className="text-sm text-gray-500">Transform text into engaging videos with Elai AI</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleRefreshTemplatesAndVoices}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Refresh templates and voices"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </motion.button>
          
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
      </div>

      {/* Text Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Video Script
        </label>
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.01 }}
        >
          <textarea
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-none"
            rows={4}
            placeholder="Enter your video script here... e.g., 'Welcome to our new product launch. Today we're excited to introduce revolutionary AI technology that will transform how you work.'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {text.length}/1000
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
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Video Template
                  {loadingTemplates && <Loader2 className="w-3 h-3 animate-spin" />}
                </label>
                
                {templatesError ? (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {templatesError}
                  </div>
                ) : (
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    disabled={loadingTemplates || templates.length === 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  >
                    <option value="">Select template...</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} {template.description && `- ${template.description}`}
                      </option>
                    ))}
                  </select>
                )}
                
                {templates.length === 0 && !loadingTemplates && !templatesError && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-600 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    No templates available
                  </div>
                )}
              </div>

              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Voice
                  {loadingVoices && <Loader2 className="w-3 h-3 animate-spin" />}
                </label>
                
                {voicesError ? (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {voicesError}
                  </div>
                ) : (
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    disabled={loadingVoices || voices.length === 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  >
                    <option value="">Select voice...</option>
                    {voices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} ({voice.language}) - {voice.gender}
                      </option>
                    ))}
                  </select>
                )}
                
                {voices.length === 0 && !loadingVoices && !voicesError && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-600 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    No voices available
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          onClick={handleGenerateVideo}
          disabled={loading || !text.trim()}
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
              Generate Video
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

      {/* Video Result */}
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
                      Processing time: {videoResult.processing_time}s
                    </p>
                  )}
                  {videoResult.demo_mode && (
                    <p className="text-sm opacity-75 mt-1 text-blue-600">
                      🎬 Demo Mode: {videoResult.message}
                    </p>
                  )}
                  {videoResult.template_used && (
                    <p className="text-sm opacity-75 mt-1">
                      Template: {videoResult.template_used} | Voice: {videoResult.voice_used}
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
                  <FileVideo className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-800">Generated Video</h4>
                  {videoResult.demo_mode && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
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
                  <span>Video ID: {videoResult.video_id}</span>
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
  );
};

export default VideoCreatorCard;