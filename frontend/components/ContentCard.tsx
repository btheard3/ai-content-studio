import React from "react";
import { ContentItem } from "../types";
import { FaFileAlt } from "react-icons/fa";

interface Props {
	content: ContentItem;
	onAdvance: () => void;
}

const ContentCard: React.FC<Props> = ({ content, onAdvance }) => {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
			<div className="flex items-center gap-3 text-gray-700 mb-2">
				<FaFileAlt className="text-gray-400" />
				<h3 className="font-semibold">{content.title}</h3>
			</div>
			<p className="text-sm text-gray-500">{content.description}</p>
			<div className="mt-2 text-xs text-gray-400">
				{content.type} • {content.contentType}
			</div>
			<div className="mt-2 flex justify-between items-center text-sm text-gray-600">
				<span>{content.stage}</span>
				<button
					onClick={onAdvance}
					className="text-sm text-blue-600 hover:underline">
					Advance →
				</button>
			</div>
		</div>
	);
};

export default ContentCard;
