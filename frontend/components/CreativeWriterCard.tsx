// frontend/components/CreativeWriterCard.tsx

import React from "react";
import { motion } from "framer-motion";
import { PenTool, ScrollText, Split, Mic2 } from "lucide-react";

interface Props {
	creative_draft: string;
	content_sections: string;
	tone_analysis: string;
}

const CreativeWriterCard: React.FC<Props> = ({
	creative_draft,
	content_sections,
	tone_analysis,
}) => {
	return (
		<motion.div
			className="card overflow-hidden"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}>
			{/* Header */}
			<div className="flex items-center gap-3 mb-6">
				<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
					<PenTool className="w-5 h-5 text-white" />
				</div>
				<div>
					<h3 className="text-xl font-bold text-gray-800">
						Creative Writer Agent
					</h3>
					<p className="text-sm text-gray-500">
						Engaging content generation based on research and strategy
					</p>
				</div>
			</div>

			{/* Creative Draft */}
			<div className="mb-6">
				<h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
					<ScrollText className="w-4 h-4 text-purple-600" />
					Creative Draft
				</h4>
				<p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200">
					{creative_draft}
				</p>
			</div>

			{/* Structured Sections */}
			<div className="mb-6">
				<h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
					<Split className="w-4 h-4 text-indigo-600" />
					Content Sections
				</h4>
				<p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200">
					{content_sections}
				</p>
			</div>

			{/* Tone Analysis */}
			<div>
				<h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
					<Mic2 className="w-4 h-4 text-pink-600" />
					Tone Analysis
				</h4>
				<p className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200">
					{tone_analysis}
				</p>
			</div>
		</motion.div>
	);
};

export default CreativeWriterCard;
