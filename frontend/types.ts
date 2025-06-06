export type Agent = {
	name: string;
	status: AgentStatus;
	output?: string;
};

export type AgentStatus = "idle" | "processing" | "error" | "done" | "active";

export enum WorkflowStage {
	PLANNING = "Planning",
	RESEARCH = "Research",
	WRITING = "Writing",
	REVIEW = "Review",
	PUBLISHED = "Published",
	ARCHIVED = "Archived",
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
