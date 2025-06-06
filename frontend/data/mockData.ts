import {
	Agent,
	ContentItem,
	ActivityLog,
	PerformanceMetric,
	WorkflowStage,
} from "../types";

export const initialAgents: Agent[] = [
	{
		name: "Content Strategist",
		status: "active",
		output: "Created roadmap",
	},
	{
		name: "Research & Data",
		status: "idle",
		output: "",
	},
];

export const mockContentItems: ContentItem[] = [
	{
		id: "content-1",
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
		description: "Exploring AI applications in healthcare.",
		createdAt: "2024-06-01T09:00:00Z",
		assignedTo: "agent-1",
	},
	{
		id: "content-2",
		title: "The Future of Work",
		type: "video",
		contentType: "social",
		tags: ["future", "work"],
		metrics: {
			views: 900,
			engagement: 65,
			conversion: 12,
		},
		stage: WorkflowStage.RESEARCH,
		description: "Remote work trends and AI automation.",
		createdAt: "2024-06-03T14:00:00Z",
		assignedTo: "agent-2",
	},
];

export const mockActivityLogs: ActivityLog[] = [
	{
		id: "log-1",
		action: "Published Article",
		details: "How AI is transforming business",
		timestamp: "2024-06-01T09:00:00Z",
	},
	{
		id: "log-2",
		action: "Edited Video",
		details: "Behind the Scenes of the Studio",
		timestamp: "2024-06-02T14:30:00Z",
	},
];

export const mockPerformanceMetrics: PerformanceMetric[] = [
	{
		name: "Engagement Rate",
		value: 78,
		target: 90,
		change: 4,
	},
	{
		name: "Content Shares",
		value: 1220,
		target: 1500,
		change: -6,
	},
];

export const mockAnalyticsData = [
	{
		name: "Content Items",
		data: [
			{ month: "Jan", value: 40 },
			{ month: "Feb", value: 55 },
			{ month: "Mar", value: 65 },
			{ month: "Apr", value: 80 },
		],
	},
	{
		name: "Content Performance",
		data: [
			{ month: "Jan", engagement: 78, conversion: 12 },
			{ month: "Feb", engagement: 85, conversion: 14 },
			{ month: "Mar", engagement: 62, conversion: 9 },
			{ month: "Apr", engagement: 90, conversion: 17 },
		],
	},
];
