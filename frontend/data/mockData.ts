import { Agent, ContentItem, WorkflowStage, ActivityLog, PerformanceMetric } from '../types';

export const initialAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Content Strategist',
    type: 'strategist',
    description: 'Analyzes audience and competition to develop content strategy',
    status: 'active',
    capabilities: [
      'Audience analysis',
      'Content strategy',
      'Editorial calendar planning',
      'Brand voice consistency',
    ],
    metrics: {
      tasksCompleted: 42,
      avgCompletionTime: 1.5,
      successRate: 94,
    },
  },
  {
    id: 'agent-2',
    name: 'Research & Data',
    type: 'researcher',
    description: 'Gathers market insights and analyzes trending topics',
    status: 'idle',
    capabilities: [
      'Market research',
      'Trend analysis',
      'Keyword research',
      'Performance metrics',
    ],
    metrics: {
      tasksCompleted: 68,
      avgCompletionTime: 2.1,
      successRate: 88,
    },
  },
  {
    id: 'agent-3',
    name: 'Creative Writer',
    type: 'writer',
    description: 'Generates engaging copy across multiple content formats',
    status: 'processing',
    capabilities: [
      'Long-form content',
      'Social media copy',
      'Email marketing',
      'SEO optimization',
    ],
    metrics: {
      tasksCompleted: 125,
      avgCompletionTime: 3.2,
      successRate: 92,
    },
  },
  {
    id: 'agent-4',
    name: 'Quality Control',
    type: 'quality',
    description: 'Reviews content for accuracy, compliance, and quality',
    status: 'idle',
    capabilities: [
      'Grammar checking',
      'Brand alignment',
      'Fact verification',
      'Compliance review',
    ],
    metrics: {
      tasksCompleted: 98,
      avgCompletionTime: 1.2,
      successRate: 96,
    },
  },
  {
    id: 'agent-5',
    name: 'Publishing Agent',
    type: 'publisher',
    description: 'Formats and distributes content across platforms',
    status: 'active',
    capabilities: [
      'Multi-platform publishing',
      'Content scheduling',
      'Distribution optimization',
      'Engagement tracking',
    ],
    metrics: {
      tasksCompleted: 76,
      avgCompletionTime: 1.8,
      successRate: 91,
    },
  },
];

export const mockContentItems: ContentItem[] = [
  {
    id: 'content-1',
    title: 'The Future of AI in Content Marketing',
    description:
      'An in-depth analysis of how AI is transforming content marketing strategies.',
    stage: WorkflowStage.WRITING,
    createdAt: '2025-03-15T10:30:00Z',
    assignedTo: 'agent-3',
    contentType: 'blog',
    tags: ['AI', 'Marketing', 'Technology'],
    metrics: {
      views: 0,
      engagement: 0,
      conversion: 0,
    },
  },
  {
    id: 'content-2',
    title: 'Q1 Social Media Campaign',
    description: 'A series of social media posts for the Q1 product launch.',
    stage: WorkflowStage.REVIEW,
    createdAt: '2025-03-12T14:45:00Z',
    assignedTo: 'agent-4',
    contentType: 'social',
    tags: ['Social Media', 'Campaign', 'Product Launch'],
    metrics: {
      views: 0,
      engagement: 0,
      conversion: 0,
    },
  },
  {
    id: 'content-3',
    title: 'Email Sequence: Customer Onboarding',
    description: 'A 5-part email sequence to onboard new customers.',
    stage: WorkflowStage.PUBLISHING,
    createdAt: '2025-03-10T09:15:00Z',
    assignedTo: 'agent-5',
    contentType: 'email',
    tags: ['Email', 'Onboarding', 'Automation'],
    metrics: {
      views: 0,
      engagement: 0,
      conversion: 0,
    },
  },
  {
    id: 'content-4',
    title: 'Data-Driven Marketing Whitepaper',
    description:
      'Comprehensive guide on implementing data-driven marketing strategies.',
    stage: WorkflowStage.RESEARCH,
    createdAt: '2025-03-08T11:20:00Z',
    assignedTo: 'agent-2',
    contentType: 'whitepaper',
    tags: ['Data', 'Marketing', 'Research'],
    metrics: {
      views: 0,
      engagement: 0,
      conversion: 0,
    },
  },
  {
    id: 'content-5',
    title: 'Product Walkthrough Video Script',
    description: 'Script for a 3-minute product demonstration video.',
    stage: WorkflowStage.PLANNING,
    createdAt: '2025-03-05T16:30:00Z',
    assignedTo: 'agent-1',
    contentType: 'video',
    tags: ['Video', 'Product', 'Tutorial'],
    metrics: {
      views: 0,
      engagement: 0,
      conversion: 0,
    },
  },
  {
    id: 'content-6',
    title: 'Industry Trends Report 2025',
    description: 'Annual report analyzing key industry trends and predictions.',
    stage: WorkflowStage.PUBLISHED,
    createdAt: '2025-02-25T10:00:00Z',
    assignedTo: 'agent-5',
    contentType: 'blog',
    tags: ['Trends', 'Industry', 'Report'],
    metrics: {
      views: 1245,
      engagement: 78,
      conversion: 23,
    },
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    agentId: 'agent-1',
    contentId: 'content-5',
    action: 'Created content plan',
    timestamp: '2025-03-15T10:45:00Z',
  },
  {
    id: 'log-2',
    agentId: 'agent-2',
    contentId: 'content-4',
    action: 'Gathered market research data',
    timestamp: '2025-03-15T09:30:00Z',
  },
  {
    id: 'log-3',
    agentId: 'agent-3',
    contentId: 'content-1',
    action: 'Started draft writing',
    timestamp: '2025-03-15T08:15:00Z',
  },
  {
    id: 'log-4',
    agentId: 'agent-4',
    contentId: 'content-2',
    action: 'Quality check in progress',
    timestamp: '2025-03-15T07:50:00Z',
  },
  {
    id: 'log-5',
    agentId: 'agent-5',
    contentId: 'content-3',
    action: 'Preparing for publishing',
    timestamp: '2025-03-15T07:20:00Z',
  },
];

export const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    name: 'Content Produced',
    value: 42,
    change: 15,
    target: 50,
  },
  {
    name: 'Avg. Quality Score',
    value: 87,
    change: 5,
    target: 90,
  },
  {
    name: 'Workflow Efficiency',
    value: 76,
    change: 12,
    target: 85,
  },
  {
    name: 'Audience Engagement',
    value: 64,
    change: 8,
    target: 75,
  },
];

export const mockAnalyticsData = [
  { month: 'Jan', content: 15, engagement: 30, conversion: 5 },
  { month: 'Feb', content: 20, engagement: 42, conversion: 8 },
  { month: 'Mar', content: 25, engagement: 51, conversion: 12 },
  { month: 'Apr', content: 32, engagement: 63, conversion: 18 },
  { month: 'May', content: 38, engagement: 75, conversion: 24 },
  { month: 'Jun', content: 42, engagement: 82, conversion: 28 },
];