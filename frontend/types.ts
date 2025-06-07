export type Agent = {
	id: string;
	name: string;
	status: AgentStatus;
	output?: string;
	tasksCompleted: number;
	avgCompletionTime: number;
	successRate: number;
};

export type AgentStatus = "idle" | "processing" | "error" | "done" | "active";

export enum WorkflowStage {
	PLANNING = "Planning",
	RESEARCH = "Research",
	WRITING = "Writing",
	REVIEW = "Review",
	PUBLISHED = "Published",
	ARCHIVED = "Archived",
	ALL = "All",
}

export type ContentItem = {
	id: string;
	title: string;
	type: string;
	contentType: string;
	tags: string[];
	metrics: {
		views: number;
		engagement: number;
		conversion: number;
	};
	stage: WorkflowStage;
	description: string;
	createdAt: string;
	assignedTo: string;
};

export type ActivityLog = {
	id: string;
	action: string;
	details?: string;
	timestamp: string;
};

export type PerformanceMetric = {
	name: string;
	value: number;
	target: number;
	change: number;
};
