import React from "react";
import { Gauge, ClipboardCheck, Wand2 } from "lucide-react";

interface QualityControlProps {
	quality_score: number;
	final_content: string;
	improvements_made: string[];
}

const QualityControlCard: React.FC<QualityControlProps> = ({
	quality_score,
	final_content,
	improvements_made,
}) => {
	return (
		<div className="rounded-2xl shadow-lg border border-gray-200 mb-6">
			<div className="space-y-4 p-6">
				<div className="flex items-center gap-3">
					<Gauge className="w-5 h-5 text-blue-600" />
					<h2 className="text-xl font-semibold">Quality Control Review</h2>
				</div>

				<div className="flex items-center gap-2">
					<ClipboardCheck className="text-green-600 w-4 h-4" />
					<p className="text-gray-700">
						<strong>Score:</strong> {quality_score} / 10
					</p>
				</div>

				<div>
					<h3 className="text-md font-medium text-gray-800 mb-1">
						Improvements Made:
					</h3>
					<ul className="list-disc list-inside text-sm text-gray-600">
						{improvements_made.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</ul>
				</div>

				<div>
					<h3 className="text-md font-medium text-gray-800 mb-1">
						Final Content:
					</h3>
					<div className="bg-gray-100 p-4 rounded-md text-sm whitespace-pre-wrap text-gray-700">
						{final_content}
					</div>
				</div>
			</div>
		</div>
	);
};

export default QualityControlCard;
