import React from "react";
import { Agent } from "../types";

interface Props {
	agent: Agent;
}

const AgentCard: React.FC<Props> = ({ agent }) => {
	const statusColor =
		agent.status === "active"
			? "text-green-600"
			: agent.status === "processing"
			? "text-blue-600"
			: "text-yellow-500";

	return (
		<div className="bg-white rounded-lg shadow p-4">
			<div className="flex justify-between items-center mb-2">
				<div>
					<h3 className="text-lg font-bold text-gray-800">{agent.name}</h3>
					<p className={`text-sm font-medium ${statusColor}`}>{agent.status}</p>
				</div>
			</div>
			<p className="text-sm text-gray-600 mb-1">
				{agent.output || (
					<span className="italic text-gray-400">No output yet</span>
				)}
			</p>
			<p className="text-xs text-gray-500">
				Tasks: {agent.tasksCompleted ?? "N/A"} • Avg:{" "}
				{agent.avgCompletionTime ?? "N/A"}d • Success:{" "}
				{agent.successRate ?? "N/A"}%
			</p>
		</div>
	);
};

export default AgentCard;
