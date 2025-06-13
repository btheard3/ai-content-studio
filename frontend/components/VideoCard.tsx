import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Play,
  Download,
  Share2,
  Clock,
  FileVideo,
  ExternalLink,
  Info,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface VideoCardProps {
  video_url?: string;
  video_status?: string;
  video_id?: string;
  processing_time?: number;
  video_metadata?: {
    script_length?: number;
    campaign_theme?: string;
    created_at?: string;
    duration_estimate?: number;
  };
  demo_mode?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video_url,
  video_status = 'processing',
  video_id,
  processing_time,
  video_metadata,
  demo_mode = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoError, setVideoError] = useState(false);

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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleDownload = () => {
    if (video_url) {
      const link = document.createElement('a');
      link.href = video_url;
      link.download = `video_${video_id || 'generated'}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (video_url && navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Video',
          text: 'Check out this AI-generated video!',
          url: video_url
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(video_url);
      }
    } else if (video_url) {
      navigator.clipboard.writeText(video_url);
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
            <h3 className="text-xl font-bold text-gray-800">AI Generated Video</h3>
            <p className="text-sm text-gray-500">
              {demo_mode ? 'Demo Mode - Tavus AI Video' : 'Powered by Tavus AI'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {video_metadata && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Video details"
            >
              <Info className="w-4 h-4 text-gray-600" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Status Header */}
      <motion.div 
        className={`flex items-center justify-between p-4 border-2 rounded-xl mb-6 ${getStatusColor(video_status)}`}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          {getStatusIcon(video_status)}
          <div className="ml-3">
            <span className="font-semibold text-lg">
              Video {video_status === 'completed' ? 'Generated Successfully' : 
                     video_status === 'error' ? 'Generation Failed' : 
                     'Processing...'}
            </span>
            {processing_time && (
              <p className="text-sm opacity-75 mt-1">
                Processing time: {processing_time.toFixed(1)}s
              </p>
            )}
            {demo_mode && (
              <p className="text-sm opacity-75 mt-1 text-purple-600">
                🎬 Demo Mode: Using sample video for demonstration
              </p>
            )}
          </div>
        </div>
        
        {video_status === 'completed' && video_url && (
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleDownload}
              className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Download video"
            >
              <Download className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleShare}
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
      {video_status === 'completed' && video_url && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative bg-black rounded-xl overflow-hidden">
            {!videoError ? (
              <video
                controls
                className="w-full h-auto max-h-96"
                poster="/api/placeholder/800/450"
                onError={handleVideoError}
              >
                <source src={video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-white">
                <AlertTriangle className="w-12 h-12 mb-4 text-red-400" />
                <p className="text-lg font-medium mb-2">Video Load Error</p>
                <p className="text-sm opacity-75 mb-4">Unable to load the video player</p>
                <a
                  href={video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Video in New Tab
                </a>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FileVideo className="w-4 h-4" />
                Video ID: {video_id}
              </span>
              {video_metadata?.duration_estimate && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ~{formatDuration(video_metadata.duration_estimate)}
                </span>
              )}
            </div>
            <a
              href={video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium"
            >
              Open in new tab
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      )}

      {/* Video Metadata */}
      <AnimatePresence>
        {isExpanded && video_metadata && (
          <motion.div
            className="p-4 bg-gray-50 rounded-xl mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Video Details
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {video_metadata.campaign_theme && (
                <div>
                  <span className="font-medium text-gray-600">Theme:</span>
                  <p className="text-gray-800">{video_metadata.campaign_theme}</p>
                </div>
              )}
              
              {video_metadata.script_length && (
                <div>
                  <span className="font-medium text-gray-600">Script Length:</span>
                  <p className="text-gray-800">{video_metadata.script_length} characters</p>
                </div>
              )}
              
              {video_metadata.duration_estimate && (
                <div>
                  <span className="font-medium text-gray-600">Estimated Duration:</span>
                  <p className="text-gray-800">{formatDuration(video_metadata.duration_estimate)}</p>
                </div>
              )}
              
              {video_metadata.created_at && (
                <div>
                  <span className="font-medium text-gray-600">Created:</span>
                  <p className="text-gray-800">
                    {new Date(video_metadata.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing State */}
      {video_status === 'processing' && (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Video className="w-12 h-12 text-purple-500" />
            </motion.div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Generating Your Video</h4>
              <p className="text-sm text-gray-600">
                Our AI is creating a personalized video from your content...
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {video_status === 'error' && (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Video Generation Failed</h4>
              <p className="text-sm text-gray-600">
                There was an issue generating your video. Please try again.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VideoCard;