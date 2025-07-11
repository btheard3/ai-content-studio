import React from "react";
import { motion } from "framer-motion";
import {
	Zap,
	Users,
	FileText,
	Activity,
	Award,
	Target,
	BookOpen,
	UploadCloud,
	Code,
} from "lucide-react";
import ContentGenerationForm from "../components/ContentCard";
import ResearchDataCard from "../components/ResearchDataCard";
import CodeGeneratorCard from "../components/CodeGeneratorCard";
import CreativeWriterCard from "../components/CreativeWriterCard";
import QualityControlCard from "../components/QualityControlCard";
import PublishingCard from "../components/PublishingCard";
import WorkflowVisualizer from "../components/WorkflowVisualizer";
import { useAgents } from "../context/AgentContext";
import {
	QualityControlOutput,
	PublishingOutput,
	WorkflowStage,
} from "../types";

// Type guards
function isQualityControlOutput(obj: any): obj is QualityControlOutput {
	return (
		obj &&
		typeof obj === "object" &&
		typeof obj.quality_score === "number" &&
		typeof obj.final_content === "string" &&
		Array.isArray(obj.improvements_made)
	);
}

function isPublishingOutput(obj: any): obj is PublishingOutput {
	return (
		obj &&
		typeof obj === "object" &&
		typeof obj.published_status === "string" &&
		Array.isArray(obj.distribution_channels) &&
		obj.publication_metadata &&
		typeof obj.publication_metadata === "object"
	);
}

// Safe parser
function safeParseAgentOutput(output: any, fallback: any = {}) {
	if (!output) return fallback;
	if (typeof output === "object") return output;
	if (typeof output === "string") {
		try {
			return JSON.parse(output);
		} catch (e) {
			console.error("Failed to parse agent output:", e);
			return { error: "Invalid output format", raw_output: output };
		}
	}
	return fallback;
}

const Dashboard: React.FC = () => {
	const { agents, activeWorkflows, completedItems, contentItems } = useAgents();

	const latestItem = contentItems[contentItems.length - 1];
	const currentStage: WorkflowStage =
		latestItem?.stage || WorkflowStage.PLANNING;

	const handleStageClick = (stage: WorkflowStage) => {
		console.log("Clicked stage:", stage);
		// You can hook this into state or routing here
	};

	// Outputs
	let qualityControlOutput: QualityControlOutput | null = null;
	let publishingOutput: PublishingOutput | null = null;

	const qualityAgent = agents.find((a) => a.id === "quality_control");
	const publishingAgent = agents.find((a) => a.id === "publishing_agent");

	if (qualityAgent?.output) {
		const parsed = safeParseAgentOutput(qualityAgent.output);
		if (isQualityControlOutput(parsed)) qualityControlOutput = parsed;
	}

	if (publishingAgent?.output) {
		const parsed = safeParseAgentOutput(publishingAgent.output);
		if (isPublishingOutput(parsed)) publishingOutput = parsed;
	}

	const kpiCards = [
		{
			title: "Active Workflows",
			value: activeWorkflows,
			subtitle: "Content in progress",
			icon: <Activity className="w-6 h-6" />,
			color: "from-blue-500 to-cyan-500",
			change: "+12%",
		},
		{
			title: "Completed Content",
			value: completedItems,
			subtitle: "Published items",
			icon: <FileText className="w-6 h-6" />,
			color: "from-emerald-500 to-teal-500",
			change: "+8%",
		},
		{
			title: "Active Agents",
			value: agents.filter((a) => a.status === "active").length,
			subtitle: "Currently processing",
			icon: <Users className="w-6 h-6" />,
			color: "from-purple-500 to-pink-500",
			change: "+5%",
		},
		{
			title: "Success Rate",
			value: "94%",
			subtitle: "Workflow completion",
			icon: <Award className="w-6 h-6" />,
			color: "from-orange-500 to-red-500",
			change: "+2%",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	return (
		<motion.div
			className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen"
			variants={containerVariants}
			initial="hidden"
			animate="visible">
			{/* Header */}
			<motion.div
				className="flex justify-between items-center mb-8"
				variants={itemVariants}>
				<div>
					<h2 className="text-3xl font-bold text-gray-800 mb-2">
						AI Content Studio Dashboard
					</h2>
					<p className="text-gray-600">
						Multi-Agent Content Generation Platform with Research & Code
						Generation
					</p>
				</div>
				<motion.div
					className="flex items-center space-x-4"
					whileHover={{ scale: 1.02 }}>
					<div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
						<Zap className="w-5 h-5 text-emerald-600" />
						<span className="text-sm font-medium text-emerald-700">
							System Online
						</span>
					</div>
				</motion.div>
			</motion.div>

			{/* KPI Cards */}
			<motion.div
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
				variants={containerVariants}>
				{kpiCards.map((kpi) => (
					<motion.div
						key={kpi.title}
						className="card relative overflow-hidden group"
						variants={itemVariants}
						whileHover={{ scale: 1.02 }}>
						<div
							className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
						/>
						<div className="relative z-10">
							<div className="flex items-center justify-between mb-4">
								<div
									className={`p-3 bg-gradient-to-br ${kpi.color} rounded-xl text-white shadow-lg`}>
									{kpi.icon}
								</div>
								<span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
									{kpi.change}
								</span>
							</div>
							<h4 className="text-sm font-medium text-gray-600 mb-1">
								{kpi.title}
							</h4>
							<p className="text-2xl font-bold text-gray-800 mb-1">
								{kpi.value}
							</p>
							<p className="text-xs text-gray-500">{kpi.subtitle}</p>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* 🧠 Interactive Workflow Timeline */}
			<motion.div className="mb-12" variants={itemVariants}>
				<WorkflowVisualizer
					activeStage={currentStage}
					onStageClick={handleStageClick}
				/>
			</motion.div>

			{/* Content Generator */}
			<motion.div className="mb-8" variants={itemVariants}>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
						<Target className="w-5 h-5 text-white" />
					</div>
					<h3 className="text-2xl font-bold text-gray-800">
						Generate New Content
					</h3>
				</div>
				<ContentGenerationForm />
			</motion.div>

			{/* Code Generator */}
			<motion.div className="mb-8" variants={itemVariants}>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
						<Code className="w-5 h-5 text-white" />
					</div>
					<h3 className="text-xl font-bold text-gray-800">AI Code Generator</h3>
				</div>
				<CodeGeneratorCard />
			</motion.div>

			{/* Research Agent */}
			<motion.div className="mb-8" variants={itemVariants}>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
						<BookOpen className="w-5 h-5 text-white" />
					</div>
					<h3 className="text-xl font-bold text-gray-800">
						Research & Data Agent
					</h3>
				</div>
				<ResearchDataCard />
			</motion.div>

			{/* Quality Control Results */}
			{qualityControlOutput && (
				<motion.div className="mb-8" variants={itemVariants}>
					<div className="flex items-center gap-3 mb-4">
						<div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
							<Award className="w-5 h-5 text-white" />
						</div>
						<h3 className="text-xl font-bold text-gray-800">
							Quality Control Results
						</h3>
					</div>
					<QualityControlCard {...qualityControlOutput} />
				</motion.div>
			)}

			{/* Publishing Summary */}
			{publishingOutput && (
				<motion.div className="mb-8" variants={itemVariants}>
					<div className="flex items-center gap-3 mb-4">
						<div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
							<UploadCloud className="w-5 h-5 text-white" />
						</div>
						<h3 className="text-xl font-bold text-gray-800">
							Publishing Summary
						</h3>
					</div>
					<PublishingCard {...publishingOutput} />
				</motion.div>
			)}
		</motion.div>
	);
};

export default Dashboard;
