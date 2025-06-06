import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, FileText, Filter } from 'lucide-react';
import ContentCard from '../components/ContentCard';
import WorkflowVisualizer from '../components/WorkflowVisualizer';
import { useAgents } from '../context/AgentContext';
import { WorkflowStage, ContentType } from '../types';

const ContentWorkflow: React.FC = () => {
  const { contentItems } = useAgents();
  const [filterStage, setFilterStage] = useState<WorkflowStage | 'all'>('all');
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');

  // Filter content items
  const filteredContent = contentItems.filter((item) => {
    const matchesStage = filterStage === 'all' || item.stage === filterStage;
    const matchesType = filterType === 'all' || item.contentType === filterType;
    return matchesStage && matchesType;
  });

  // Group content by stage
  const groupedContent = filteredContent.reduce(
    (acc, item) => {
      if (!acc[item.stage]) {
        acc[item.stage] = [];
      }
      acc[item.stage].push(item);
      return acc;
    },
    {} as Record<string, typeof contentItems>
  );

  // Content type options
  const contentTypes: { value: ContentType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'blog', label: 'Blog Posts' },
    { value: 'social', label: 'Social Media' },
    { value: 'email', label: 'Email' },
    { value: 'video', label: 'Video' },
    { value: 'whitepaper', label: 'Whitepaper' },
  ];

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <motion.h1 
          className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Content Workflow
        </motion.h1>
        <motion.button 
          className="btn btn-primary flex items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Content
        </motion.button>
      </div>

      {/* Workflow Visualizer */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WorkflowVisualizer 
          activeStage={WorkflowStage.WRITING} 
          onStageClick={(stage) => setFilterStage(stage)}
        />
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700 font-medium">Filter:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              filterStage === 'all'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterStage('all')}
          >
            All Stages
          </button>
          
          {Object.values(WorkflowStage).map((stage) => (
            <button
              key={stage}
              className={`px-3 py-1 text-sm rounded-full capitalize ${
                filterStage === stage
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilterStage(stage)}
            >
              {stage}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ContentType | 'all')}
          >
            {contentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Stages */}
      <div className="space-y-8">
        {filterStage === 'all' ? (
          Object.entries(groupedContent).map(([stage, items]) => (
            <div key={stage}>
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-medium text-gray-900 capitalize">{stage}</h2>
                <div className="ml-3 bg-gray-200 rounded-full px-2 py-0.5">
                  <span className="text-sm text-gray-700">{items.length}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <ContentCard key={item.id} content={item} />
                ))}
                
                {items.length === 0 && (
                  <div className="col-span-full">
                    <div className="text-center py-8 card bg-gray-50">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No content items in this stage</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
            
            {filteredContent.length === 0 && (
              <div className="col-span-full">
                <div className="text-center py-8 card bg-gray-50">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No content items match your filters</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentWorkflow;