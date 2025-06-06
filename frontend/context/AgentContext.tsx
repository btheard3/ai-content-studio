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
	const [agents, setAgents] = useState<Agent[]>(initialAgents);
	const [contentItems, setContentItems] =
		useState<ContentItem[]>(mockContentItems);
	const [activeWorkflows, setActiveWorkflows] = useState<number>(0);
	const [completedItems, setCompletedItems] = useState<number>(0);

	useEffect(() => {
		// Simulate calculated workflow data
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
			prev.map((agent, idx) =>
				idx.toString() === id ? { ...agent, status } : agent
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
			}}>
			{children}
		</AgentContext.Provider>
	);
};
