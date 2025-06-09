import React, { useState } from "react";
import axios from "axios";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";

const ContentStrategistCard = () => {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const runAgent = async () => {
		setLoading(true);
		setError("");
		setOutput("");

		try {
			const response = await axios.post(
				"http://localhost:8000/run/content_strategist",
				{
					text: input,
				}
			);

			setOutput(response.data.text || "");
		} catch (err: any) {
			setError(err?.response?.data?.error || "Network Error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md mb-8">
			<h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
				<Sparkles className="w-5 h-5 text-purple-500 mr-2" />
				Content Strategist
			</h3>
			<textarea
				className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
				rows={3}
				placeholder="e.g., Generate a content plan for a presidential campaign..."
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<button
				onClick={runAgent}
				disabled={loading || !input}
				className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
				{loading ? (
					<>
						<Loader2 className="animate-spin w-4 h-4 mr-2" />
						Generating...
					</>
				) : (
					<>
						<Sparkles className="w-4 h-4 mr-2" />
						Generate Content Roadmap
					</>
				)}
			</button>

			<div className="mt-4">
				<h4 className="text-sm font-bold text-gray-700 mb-1">
					Generated Output:
				</h4>
				{error && (
					<div className="text-red-600 flex items-center text-sm">
						<AlertTriangle className="w-4 h-4 mr-1" />
						Error: {error}
					</div>
				)}
				{!error && !loading && output && (
					<div className="text-sm text-gray-800 whitespace-pre-line">
						{output}
					</div>
				)}
			</div>
		</div>
	);
};

export default ContentStrategistCard;
