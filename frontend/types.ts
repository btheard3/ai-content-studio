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

// Add interfaces for agent outputs
export interface QualityControlOutput {
	quality_score: number;
	final_content: string;
	improvements_made: string[];
}

export interface PublishingOutput {
	published_status: string;
	distribution_channels: string[];
	publication_metadata: {
		timestamp: string;
		word_count: number;
		campaign: string;
	};
}