export type AgentStatus = 'active' | 'idle' | 'processing' | 'error';

export type AgentType = 
  | 'strategist'
  | 'researcher'
  | 'writer'
  | 'quality'
  | 'publisher';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  status: AgentStatus;
  capabilities: string[];
  avatar?: string;
  metrics: {
    tasksCompleted: number;
    avgCompletionTime: number;
    successRate: number;
  };
}

export enum WorkflowStage {
  PLANNING = 'planning',
  RESEARCH = 'research',
  WRITING = 'writing',
  REVIEW = 'review',
  PUBLISHING = 'publishing',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export type ContentType = 'blog' | 'social' | 'email' | 'video' | 'whitepaper';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  stage: WorkflowStage;
  createdAt: string;
  assignedTo: string;
  contentType: ContentType;
  tags: string[];
  metrics: {
    views: number;
    engagement: number;
    conversion: number;
  };
}

export interface PerformanceMetric {
  name: string;
  value: number;
  change: number;
  target: number;
}

export interface ActivityLog {
  id: string;
  agentId: string;
  contentId?: string;
  action: string;
  timestamp: string;
  details?: string;
}