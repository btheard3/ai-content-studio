// mockData.ts

import { Agent, ContentItem, WorkflowStage } from "../types";

// ✅ Initial Agents (with all required fields)
export const initialAgents: Agent[] = [
	{
		id: "agent1",
		name: "Content Strategist",
		status: "active",
		output: "Created roadmap",
		tasksCompleted: 5,
		avgCompletionTime: 120,
		successRate: 0.92,
	},
	{
		id: "agent2",
		name: "Research & Data",
		status: "idle",
		output: "",
		tasksCompleted: 0,
		avgCompletionTime: 0,
		successRate: 0.0,
	},
];

// ✅ Mock Content Items (with all required fields)
export const mockContentItems: ContentItem[] = [
	{
		id: "content1",
		title: "AI in Healthcare",
		type: "article",
		contentType: "blog",
		tags: ["ai", "healthcare"],
		metrics: {
			views: 1200,
			engagement: 80,
			conversion: 10,
		},
		stage: WorkflowStage.PLANNING,
		description: "An overview of AI applications in healthcare.",
		createdAt: "2024-06-01T10:00:00Z",
		assignedTo: "agent1",
	},
	{
		id: "content2",
		title: "Blockchain for Creators",
		type: "article",
		contentType: "guide",
		tags: ["blockchain", "creator economy"],
		metrics: {
			views: 850,
			engagement: 60,
			conversion: 12,
		},
		stage: WorkflowStage.WRITING,
		description: "How blockchain tech is empowering content creators.",
		createdAt: "2024-06-05T09:30:00Z",
		assignedTo: "agent2",
	},
];

import { PerformanceMetric, ActivityLog } from "../types";

export const mockAnalyticsData: ActivityLog[] = [
	{
		id: "log1",
		action: "Created Content",
		details: "Initial draft submitted by Research Agent",
		timestamp: "2025-06-05T10:00:00Z",
	},
	{
		id: "log2",
		action: "Reviewed",
		details: "Feedback added by QA",
		timestamp: "2025-06-05T14:30:00Z",
	},
];

export const mockPerformanceMetrics: PerformanceMetric[] = [
	{
		name: "Engagement Rate",
		value: 78,
		target: 85,
		change: -7,
	},
	{
		name: "Conversion Rate",
		value: 12,
		target: 10,
		change: +2,
	},
];
