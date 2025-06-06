import React from "react";
import { useAgents } from "../context/AgentContext";
import AgentCard from "../components/AgentCard";

const Dashboard: React.FC = () => {
	const { agents, activeWorkflows, completedItems } = useAgents();

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800">
					Content Creation Dashboard
				</h2>
				<button className="bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800 text-sm">
					+ New Content
				</button>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<div className="bg-white p-4 rounded shadow">
					<h4 className="text-sm text-gray-500 mb-1">Active Workflows</h4>
					<p className="text-xl font-semibold text-gray-800">
						{activeWorkflows}
					</p>
				</div>
				<div className="bg-white p-4 rounded shadow">
					<h4 className="text-sm text-gray-500 mb-1">Published Content</h4>
					<p className="text-xl font-semibold text-gray-800">
						{completedItems}
					</p>
				</div>
				<div className="bg-white p-4 rounded shadow">
					<h4 className="text-sm text-gray-500 mb-1">Content Performance</h4>
					<p className="text-xl font-semibold text-gray-800">78%</p>
				</div>
				<div className="bg-white p-4 rounded shadow">
					<h4 className="text-sm text-gray-500 mb-1">Avg. Completion Time</h4>
					<p className="text-xl font-semibold text-gray-800">2.4 days</p>
				</div>
			</div>

			{/* Agent Network */}
			<h3 className="text-xl font-bold text-gray-800 mb-4">Agent Network</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
				{agents.map((agent, index) => (
					<AgentCard key={index} agent={agent} />
				))}
			</div>
		</div>
	);
};

export default Dashboard;
