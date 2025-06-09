import React from "react";
import { UploadCloud, CheckCircle } from "lucide-react";

interface PublishingProps {
	published_status: string;
	distribution_channels: string[];
	publication_metadata: {
		timestamp: string;
		word_count: number;
		campaign: string;
	};
}

const PublishingCard: React.FC<PublishingProps> = ({
	published_status,
	distribution_channels,
	publication_metadata,
}) => {
	return (
		<div className="rounded-2xl shadow-lg border border-gray-200 mb-6">
			<div className="space-y-4 p-6">
				<div className="flex items-center gap-3">
					<UploadCloud className="w-5 h-5 text-blue-600" />
					<h2 className="text-xl font-semibold">Publishing Summary</h2>
				</div>

				<div className="flex items-center gap-2">
					<CheckCircle className="text-green-600 w-4 h-4" />
					<p className="text-gray-700">
						<strong>Status:</strong> {published_status}
					</p>
				</div>

				<div>
					<h3 className="text-md font-medium text-gray-800 mb-1">
						Distribution Channels:
					</h3>
					<div className="flex gap-2 flex-wrap">
						{distribution_channels.map((channel, i) => (
							<span
								key={i}
								className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
								{channel}
							</span>
						))}
					</div>
				</div>

				<div className="text-sm text-gray-600">
					<p>
						<strong>Published:</strong> {publication_metadata.timestamp}
					</p>
					<p>
						<strong>Word Count:</strong> {publication_metadata.word_count}
					</p>
					<p>
						<strong>Campaign:</strong> {publication_metadata.campaign}
					</p>
				</div>
			</div>
		</div>
	);
};

export default PublishingCard;
