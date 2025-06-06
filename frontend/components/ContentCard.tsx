import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  MessageSquare, 
  Mail, 
  Video, 
  FileBarChart2,
  ChevronRight
} from 'lucide-react';
import { ContentItem, WorkflowStage } from '../types';
import { useAgents } from '../context/AgentContext';

interface ContentCardProps {
  content: ContentItem;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const { agents, advanceContent } = useAgents();
  
  // Get the assigned agent
  const assignedAgent = agents.find(agent => agent.id === content.assignedTo);

  // Get the right icon based on content type
  const getContentIcon = () => {
    switch (content.contentType) {
      case 'blog':
        return <FileText className="w-5 h-5" />;
      case 'social':
        return <MessageSquare className="w-5 h-5" />;
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'whitepaper':
        return <FileBarChart2 className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Get the stage color
  const getStageColor = () => {
    switch (content.stage) {
      case WorkflowStage.PLANNING:
        return 'bg-primary-100 text-primary-800';
      case WorkflowStage.RESEARCH:
        return 'bg-secondary-100 text-secondary-800';
      case WorkflowStage.WRITING:
        return 'bg-accent-100 text-accent-800';
      case WorkflowStage.REVIEW:
        return 'bg-success-100 text-success-800';
      case WorkflowStage.PUBLISHING:
        return 'bg-warning-100 text-warning-800';
      case WorkflowStage.PUBLISHED:
        return 'bg-gray-100 text-gray-800';
      case WorkflowStage.ARCHIVED:
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <motion.div 
      className="card card-hover"
      whileHover={{ y: -3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            {getContentIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{content.title}</h3>
            <span className="text-sm text-gray-500 capitalize">{content.contentType}</span>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStageColor()}`}>
          {content.stage}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{content.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {content.tags.map((tag, index) => (
          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-medium">{assignedAgent?.name.charAt(0) || '?'}</span>
          </div>
          <span className="text-xs text-gray-500">{formatDate(content.createdAt)}</span>
        </div>
        
        {content.stage !== WorkflowStage.PUBLISHED && content.stage !== WorkflowStage.ARCHIVED && (
          <button 
            className="text-xs text-primary-600 flex items-center hover:text-primary-700"
            onClick={() => advanceContent(content.id)}
          >
            Advance <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ContentCard;