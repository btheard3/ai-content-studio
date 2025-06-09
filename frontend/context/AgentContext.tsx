import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { Agent, AgentStatus, ContentItem, WorkflowStage } from "../types";

import {
  initialAgents,
  mockContentItems,
  mockActivityLogs,
  mockPerformanceMetrics,
} from "../data/mockData";

interface AgentContextType {
  agents: Agent[];
  contentItems: ContentItem[];
  activeWorkflows: number;
  completedItems: number;
  updateAgentStatus: (id: string, status: AgentStatus) => void;
  advanceContent: (id: string) => void;
  addContentItem: (item: Partial<ContentItem>) => void;
  addWorkflowResult: (result: any) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgents must be used within an AgentProvider");
  }
  return context;
};

export const AgentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "content_strategist",
      name: "Content Strategist",
      status: "active",
      output: "Strategy planning complete",
      tasksCompleted: 12,
      avgCompletionTime: 45,
      successRate: 0.94,
    },
    {
      id: "research_data",
      name: "Research & Data Agent",
      status: "active",
      output: "Market research compiled",
      tasksCompleted: 8,
      avgCompletionTime: 60,
      successRate: 0.91,
    },
    {
      id: "creative_writer",
      name: "Creative Writer",
      status: "active",
      output: "Content draft ready",
      tasksCompleted: 15,
      avgCompletionTime: 90,
      successRate: 0.96,
    },
    {
      id: "quality_control",
      name: "Quality Control",
      status: "active",
      output: "Quality review complete",
      tasksCompleted: 20,
      avgCompletionTime: 30,
      successRate: 0.98,
    },
    {
      id: "publishing_agent",
      name: "Publishing Agent",
      status: "active",
      output: "Content published",
      tasksCompleted: 18,
      avgCompletionTime: 25,
      successRate: 0.95,
    },
  ]);
  
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);
  const [activeWorkflows, setActiveWorkflows] = useState<number>(0);
  const [completedItems, setCompletedItems] = useState<number>(0);

  useEffect(() => {
    // Calculate workflow statistics
    const active = contentItems.filter(
      (item) =>
        item.stage !== WorkflowStage.PUBLISHED &&
        item.stage !== WorkflowStage.ARCHIVED
    ).length;

    const completed = contentItems.filter(
      (item) =>
        item.stage === WorkflowStage.PUBLISHED ||
        item.stage === WorkflowStage.ARCHIVED
    ).length;

    setActiveWorkflows(active);
    setCompletedItems(completed);
  }, [contentItems]);

  const updateAgentStatus = (id: string, status: AgentStatus) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, status } : agent
      )
    );
  };

  const advanceContent = (id: string) => {
    setContentItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        const stageOrder = [
          WorkflowStage.PLANNING,
          WorkflowStage.RESEARCH,
          WorkflowStage.WRITING,
          WorkflowStage.REVIEW,
          WorkflowStage.PUBLISHED,
          WorkflowStage.ARCHIVED,
        ];
        const nextStageIndex = stageOrder.indexOf(item.stage) + 1;
        const nextStage =
          nextStageIndex < stageOrder.length
            ? stageOrder[nextStageIndex]
            : WorkflowStage.ARCHIVED;

        return {
          ...item,
          stage: nextStage,
        };
      })
    );
  };

  const addContentItem = (item: Partial<ContentItem>) => {
    const newItem: ContentItem = {
      id: `content-${Date.now()}`,
      title: item.title || "New Content",
      type: item.type || "article",
      contentType: item.contentType || "blog",
      tags: item.tags || [],
      metrics: item.metrics || { views: 0, engagement: 0, conversion: 0 },
      stage: WorkflowStage.PLANNING,
      description: item.description || "",
      createdAt: new Date().toISOString(),
      assignedTo: item.assignedTo || agents[0]?.name || "",
    };

    setContentItems((prev) => [...prev, newItem]);
  };

  const addWorkflowResult = (result: any) => {
    if (result.success && result.data) {
      // Create a new content item from workflow result
      const newItem: ContentItem = {
        id: `workflow-${Date.now()}`,
        title: result.data.campaign_theme || "Generated Content",
        type: "article",
        contentType: "guide",
        tags: result.data.key_pillars || ["strategy"],
        metrics: { views: 0, engagement: 0, conversion: 0 },
        stage: WorkflowStage.PUBLISHED,
        description: "Content generated through multi-agent workflow",
        createdAt: new Date().toISOString(),
        assignedTo: "Multi-Agent System",
      };

      setContentItems((prev) => [...prev, newItem]);

      // Update agent task counts
      setAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          tasksCompleted: agent.tasksCompleted + 1,
          status: "active" as AgentStatus,
        }))
      );
    }
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
        addWorkflowResult,
      }}>
      {children}
    </AgentContext.Provider>
  );
};