import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, AgentStatus, ContentItem, WorkflowStage } from '../types';
import { initialAgents, mockContentItems } from '../data/mockData';

interface AgentContextType {
  agents: Agent[];
  contentItems: ContentItem[];
  activeWorkflows: number;
  completedItems: number;
  updateAgentStatus: (id: string, status: AgentStatus) => void;
  advanceContent: (id: string) => void;
  addContentItem: (item: Partial<ContentItem>) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
};

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);
  const [activeWorkflows, setActiveWorkflows] = useState<number>(0);
  const [completedItems, setCompletedItems] = useState<number>(0);

  useEffect(() => {
    // Calculate active workflows
    const active = contentItems.filter(
      (item) => item.stage !== WorkflowStage.PUBLISHED && item.stage !== WorkflowStage.ARCHIVED
    ).length;
    setActiveWorkflows(active);

    // Calculate completed items
    const completed = contentItems.filter(
      (item) => item.stage === WorkflowStage.PUBLISHED
    ).length;
    setCompletedItems(completed);

    // Simulate agent status changes
    const interval = setInterval(() => {
      setAgents((prevAgents) => {
        return prevAgents.map((agent) => {
          // Random status change for demo purposes
          if (Math.random() > 0.7) {
            const statusOptions: AgentStatus[] = ['active', 'idle', 'processing'];
            const newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
            return { ...agent, status: newStatus };
          }
          return agent;
        });
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [contentItems]);

  const updateAgentStatus = (id: string, status: AgentStatus) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => (agent.id === id ? { ...agent, status } : agent))
    );
  };

  const advanceContent = (id: string) => {
    setContentItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const currentStageIndex = Object.values(WorkflowStage).indexOf(item.stage);
          const nextStage = Object.values(WorkflowStage)[currentStageIndex + 1] || item.stage;
          return { ...item, stage: nextStage };
        }
        return item;
      })
    );
  };

  const addContentItem = (item: Partial<ContentItem>) => {
    const newItem: ContentItem = {
      id: `content-${Date.now()}`,
      title: item.title || 'New Content',
      description: item.description || '',
      stage: WorkflowStage.PLANNING,
      createdAt: new Date().toISOString(),
      assignedTo: item.assignedTo || agents[0].id,
      contentType: item.contentType || 'blog',
      tags: item.tags || [],
      metrics: {
        views: 0,
        engagement: 0,
        conversion: 0,
      },
    };

    setContentItems((prev) => [...prev, newItem]);
  };

  return (
    <AgentContext.Provider
      value={{
        agents,
        contentItems,
        activeWorkflows,
        completedItems,
        updateAgentStatus,
        advanceContent,
        addContentItem,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};