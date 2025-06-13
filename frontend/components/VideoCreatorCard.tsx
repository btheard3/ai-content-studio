// VideoCreatorCard.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Video,
	Play,
	Loader2,
	AlertTriangle,
	CheckCircle,
	Download,
	Share2,
	Clock,
	FileVideo,
} from "lucide-react";
import { useApi, apiService } from "../hooks/useApi";

interface VideoResponse {
	success: boolean;
	video_url?: string;
	video_id?: string;
	processing_time?: number;
	status: string;
	error?: string;
	demo_mode?: boolean;
	message?: string;
}

const VideoCreatorCard: React.FC = () => {
	const [text, setText] = useState("");
	const {
		data: videoResult,
		loading,
		error,
		execute: generateVideo,
		reset,
	} = useApi<VideoResponse>(apiService.generateTavusVideo);

	const handleGenerateVideo = async () => {
		if (!text.trim()) return;

		const result = await generateVideo({
			script: text.trim(),
			title: "AI Generated Video",
		});

		if (result?.success) {
			console.log("✅ Tavus video generated:", result);
		} else {
			console.error("❌ Tavus generation failed:", result?.error);
		}
	};

	const handleReset = () => {
		reset();
		setText("");
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="w-5 h-5 text-emerald-500" />;
			case "error":
				return <AlertTriangle className="w-5 h-5 text-red-500" />;
			case "processing":
				return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
			default:
				return <Clock className="w-5 h-5 text-gray-400" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "border-emerald-200 bg-emerald-50";
			case "error":
				return "border-red-200 bg-red-50";
			case "processing":
				return "border-blue-200 bg-blue-50";
			default:
				return "border-gray-200 bg-gray-50";
		}
	};

	return (
		<motion.div
			className="card overflow-hidden"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}>
			{/* Header */}
			<div className="flex items-center gap-3 mb-6">
				<motion.div
					className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
					whileHover={{ scale: 1.05, rotate: 5 }}
					transition={{ type: "spring", stiffness: 300 }}>
					<Video className="w-6 h-6 text-white" />
				</motion.div>
				<div>
					<h3 className="text-xl font-bold text-gray-800">
						AI Video Generator (Tavus)
					</h3>
					<p className="text-sm text-gray-500">
						Generate AI videos using Tavus API
					</p>
				</div>
			</div>

			{/* Text Input */}
			<div className="mb-6">
				<label className="block text-sm font-semibold text-gray-700 mb-2">
					Video Script
				</label>
				<textarea
					className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-none"
					rows={4}
					placeholder="Enter your script here... e.g., 'Welcome to our platform. Here's how we change the game.'"
					value={text}
					onChange={(e) => setText(e.target.value)}
					disabled={loading}
				/>
				<div className="text-xs text-right text-gray-400 mt-1">
					{text.length}/1000
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex items-center gap-3 mb-6">
				<motion.button
					onClick={handleGenerateVideo}
					disabled={loading || !text.trim()}
					className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
					whileHover={{ scale: 1.02, y: -1 }}
					whileTap={{ scale: 0.98 }}>
					{loading ? (
						<>
							<Loader2 className="animate-spin w-5 h-5 mr-2" />
							Generating Video...
						</>
					) : (
						<>
							<Play className="w-5 h-5 mr-2" />
							Generate Video
						</>
					)}
				</motion.button>

				{(videoResult || error) && (
					<motion.button
						onClick={handleReset}
						className="flex items-center px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}>
						Reset
					</motion.button>
				)}
			</div>

			{/* Error Display */}
			<AnimatePresence>
				{error && (
					<motion.div
						className="mb-6 p-4 border-2 border-red-200 bg-red-50 rounded-xl"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}>
						<div className="flex items-center text-red-600 text-sm">
							<AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
							<div>
								<strong>Video Generation Error:</strong>
								<p className="mt-1">{error}</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Video Result */}
			<AnimatePresence>
				{videoResult && (
					<motion.div
						className="space-y-4"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.5, ease: "easeInOut" }}>
						<motion.div
							className={`flex items-center justify-between p-4 border-2 rounded-xl ${getStatusColor(
								videoResult.status
							)}`}
							initial={{ scale: 0.95 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2 }}>
							<div className="flex items-center">
								{getStatusIcon(videoResult.status)}
								<div className="ml-3">
									<span className="font-semibold text-lg">
										{videoResult.status === "completed"
											? "Video Generated Successfully"
											: videoResult.status === "error"
											? "Generation Failed"
											: "Processing..."}
									</span>
									{videoResult.processing_time && (
										<p className="text-sm opacity-75 mt-1">
											Processing time: {videoResult.processing_time}s
										</p>
									)}
								</div>
							</div>
							{videoResult.status === "completed" && videoResult.video_url && (
								<div className="flex items-center gap-2">
									<a
										href={videoResult.video_url}
										download
										target="_blank"
										rel="noopener noreferrer">
										<Download className="w-4 h-4 text-gray-600" />
									</a>
									<a
										href={videoResult.video_url}
										target="_blank"
										rel="noopener noreferrer">
										<Share2 className="w-4 h-4 text-gray-600" />
									</a>
								</div>
							)}
						</motion.div>

						{videoResult.status === "completed" && videoResult.video_url && (
							<motion.div
								className="p-4 border-2 border-gray-200 bg-gray-50 rounded-xl"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}>
								<div className="flex items-center gap-3 mb-4">
									<FileVideo className="w-5 h-5 text-purple-600" />
									<h4 className="font-semibold text-gray-800">
										Generated Video
									</h4>
								</div>
								<video controls className="w-full h-auto max-h-96">
									<source src={videoResult.video_url} type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							</motion.div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default VideoCreatorCard;
