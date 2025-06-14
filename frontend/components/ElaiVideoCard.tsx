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
  RefreshCw,
  Sparkles,
  Mic,
  Palette
} from 'lucide-react';
import { useApi, apiService } from '../hooks/useApi';

interface ElaiVideoResponse {
  success: boolean;
  video_url?: string;
  video_id?: string;
  processing_time?: number;
  status: string;
  error?: string;
  template_used?: string;
  voice_used?: string;
  demo_mode?: boolean;
  message?: string;
}

const ElaiVideoCard: React.FC = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [voices, setVoices] = useState<any[]>([]);

  const {
    data: videoResult,
    loading,
    error,
    execute: generateVideo,
    reset
  } = useApi<ElaiVideoResponse>(apiService.generateElaiVideo);

  // Load templates and voices on component mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [templatesRes, voicesRes] = await Promise.all([
          apiService.getElaiTemplates(),
          apiService.getElaiVoices()
        ]);
        
        if (templatesRes.success) {
          setTemplates(templatesRes.templates);
        }
        
        if (voicesRes.success) {
          setVoices(voicesRes.voices);
        }
      } catch (error) {
        console.error('Failed to load templates/voices:', error);
      }
    };

    loadOptions();
  }, []);

  const handleGenerateVideo = async () => {
    if (!text.trim()) return;

    const result = await generateVideo({
      text: text.trim(),
      title: title.trim() || 'AI Generated Video',
      template_id: selectedTemplate || undefined,
      voice_id: selectedVoice || undefined
    });

    if (result?.success) {
      console.log('✅ Elai video generated successfully:', result);
    } else {
      console.error('❌ Elai video generation failed:', result?.error);
    }
  };

  const handleReset = () => {
    reset();
    setText('');
    setTitle('');
    setSelectedTemplate('');
    setSelectedVoice('');
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
            <h3 className="text-xl font-bold text-gray-800">Elai.io Video Generator</h3>
            <p className="text-sm text-gray-500">Professional AI video creation</p>
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

      {/* Script Input */}
      <div className="mb-4">
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
            placeholder="Enter your video script... e.g., 'Welcome to our revolutionary AI platform that transforms how businesses operate. Discover the future of automation today.'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {text.length}/1000
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
          className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          placeholder="Enter video title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
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
                </label>
                <select 
                  value={selectedTemplate} 
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Default Template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {selectedTemplate && templates.find(t => t.id === selectedTemplate) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {templates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                )}
              </div>

              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Voice Selection
                </label>
                <select 
                  value={selectedVoice} 
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Default Voice</option>
                  {voices.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name} ({voice.language}) - {voice.gender}
                    </option>
                  ))}
                </select>
                {selectedVoice && voices.find(v => v.id === selectedVoice) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {voices.find(v => v.id === selectedVoice)?.language} • {voices.find(v => v.id === selectedVoice)?.gender}
                  </p>
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
                    {videoResult.status === 'completed' ? 'Video Generated Successfully' : 
                     videoResult.status === 'error' ? 'Generation Failed' : 
                     'Processing...'}
                  </span>
                  {videoResult.processing_time && (
                    <p className="text-sm opacity-75 mt-1">
                      Processing time: {videoResult.processing_time.toFixed(1)}s
                    </p>
                  )}
                  {videoResult.message && (
                    <p className="text-sm opacity-75 mt-1">
                      {videoResult.message}
                    </p>
                  )}
                </div>
              </div>
              
              {videoResult.status === 'completed' && videoResult.video_url && (
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = videoResult.video_url!;
                      link.download = `elai-video-${videoResult.video_id || 'generated'}.mp4`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Download video"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'AI Generated Video',
                          text: 'Check out this AI-generated video!',
                          url: videoResult.video_url
                        });
                      } else {
                        navigator.clipboard.writeText(videoResult.video_url!);
                      }
                    }}
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
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Video ID:</span>
                    <p className="text-gray-800">{videoResult.video_id || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Template:</span>
                    <p className="text-gray-800">{videoResult.template_used || 'Default'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Voice:</span>
                    <p className="text-gray-800">{videoResult.voice_used || 'Default'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Processing:</span>
                    <p className="text-gray-800">{videoResult.processing_time?.toFixed(1)}s</p>
                  </div>
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

export default ElaiVideoCard;