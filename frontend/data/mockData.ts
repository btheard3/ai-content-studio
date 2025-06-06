import { Agent, ActivityLog, PerformanceMetric, ContentItem } from "../types";

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
		stage: "Planning",
		description: "Exploring AI applications in healthcare.",
		createdAt: "2024-06-01T09:00:00Z",
		assignedTo: "agent-1",
	},
	{
		id: "content-2",
		title: "Next-Gen UX",
		type: "video",
		contentType: "social",
		tags: ["design", "ux"],
		metrics: {
			views: 980,
			engagement: 62,
			conversion: 15,
		},
		stage: "Review",
		description: "Trends in user experience design.",
		createdAt: "2024-06-03T12:00:00Z",
		assignedTo: "agent-2",
	},
];
