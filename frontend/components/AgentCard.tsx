import React from "react";
import { Agent } from "../types";

type AgentCardProps = {
	agent: Agent;
};

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
	if (!agent) return null;

	return (
		<div className="card">
			<h3 className="text-lg font-semibold">{agent.name}</h3>
			<p className="text-sm text-gray-500">{agent.type}</p>
			<div className="mt-2">
				<p>
					Status: <span className="font-medium">{agent.status}</span>
				</p>
				<p>Tasks Completed: {agent.tasksCompleted ?? "N/A"}</p>
			</div>
		</div>
	);
};

export default AgentCard;
