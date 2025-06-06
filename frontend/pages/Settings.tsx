import React from "react";
import { motion } from "framer-motion";
import {
	Cloud,
	Database,
	Key,
	AlertCircle,
	Info,
	Settings as SettingsIcon,
	BrainCircuit,
	CheckCircle,
} from "lucide-react";
import { useAgents } from "../context/AgentContext";

const Settings: React.FC = () => {
	const { agents } = useAgents();

	return (
		<div className="px-4 py-6 md:px-6 md:py-8">
			<motion.h1
				className="text-2xl font-semibold text-gray-900 mb-6"
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}>
				System Settings
			</motion.h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="col-span-1 space-y-6">
					<motion.div
						className="card"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}>
						<div className="flex items-start justify-between mb-4">
							<Cloud className="w-5 h-5 text-primary-600 mr-2" />
							<CheckCircle className="w-5 h-5 text-green-600" />
						</div>
						<p className="text-sm">Google Cloud Integration</p>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
