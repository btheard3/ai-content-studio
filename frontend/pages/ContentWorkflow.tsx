// ContentWorkflow.tsx

import React, { useState } from "react";
import { ContentItem, WorkflowStage } from "../types";
import { mockContentItems } from "../data/mockData";
import WorkflowVisualizer from "../components/WorkflowVisualizer";
import ContentCard from "../components/ContentCard";

const contentTypes = [
	{ value: "email", label: "Email" },
	{ value: "video", label: "Video" },
	{ value: "whitepaper", label: "Whitepapers" },
];

const ContentWorkflow: React.FC = () => {
	const [filterStage, setFilterStage] = useState<WorkflowStage>(
		WorkflowStage.PLANNING
	);
	const [filterType, setFilterType] = useState<string>("");

	const groupedContent: Record<string, ContentItem[]> = mockContentItems
		.filter((item) => {
			const matchesStage =
				filterStage === WorkflowStage.ALL || item.stage === filterStage;
			const matchesType = filterType === "" || item.contentType === filterType;
			return matchesStage && matchesType;
		})
		.reduce((acc, item) => {
			const key = item.stage;
			if (!acc[key]) acc[key] = [];
			acc[key].push(item);
			return acc;
		}, {} as Record<string, ContentItem[]>);

	const handleAdvance = (item: ContentItem) => {
		console.log("Advance stage for:", item.title);
		// Future: implement logic to update item's stage
	};

	return (
		<div className="p-4">
			{/* Filters */}
			<div className="flex items-center gap-4 mb-4">
				<select
					className="border rounded px-2 py-1"
					value={filterType}
					onChange={(e) => setFilterType(e.target.value)}>
					<option value="">All Types</option>
					{contentTypes.map((type) => (
						<option key={type.value} value={type.value}>
							{type.label}
						</option>
					))}
				</select>
			</div>

			{/* Workflow Visualizer */}
			<WorkflowVisualizer
				activeStage={filterStage}
				onStageClick={(stage) => setFilterStage(stage)}
			/>

			{/* Content Grouped by Stage */}
			{Object.entries(groupedContent as Record<string, ContentItem[]>).map(
				([stage, items]) => (
					<div key={stage} className="my-8">
						<h2 className="text-primary-600 font-medium mb-2">
							{stage} {items.length !== 1 ? "s" : ""}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{items.map((item) => (
								<ContentCard
									key={item.id}
									content={item}
									onAdvance={() => handleAdvance(item)}
								/>
							))}
						</div>
					</div>
				)
			)}
		</div>
	);
};

export default ContentWorkflow;
