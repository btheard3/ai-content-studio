// frontend/components/ContentCard.tsx
import React, { useState } from "react";
import axios from "axios";

const ContentStrategistCard = () => {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [loading, setLoading] = useState(false);

	const runAgent = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				"http://localhost:8000/run/content_strategist",
				{
					text: input,
				}
			);

			// Safely access the 'text' field
			setOutput(response.data?.text ?? "❌ No content returned.");
		} catch (error: any) {
			console.error("Agent Error:", error);
			setOutput(
				"⚠️ Error: " +
					(error?.response?.data?.error ?? error?.message ?? "Unknown error")
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white p-4 rounded shadow mt-4">
			<h4 className="text-lg font-semibold mb-2">Content Strategist</h4>

			<textarea
				className="w-full border rounded p-2 mb-2"
				rows={3}
				placeholder="Enter a content idea or prompt"
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>

			<button
				onClick={runAgent}
				className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
				disabled={loading || !input}>
				{loading ? "Generating..." : "⚡ Generate Content Roadmap"}
			</button>

			<div className="mt-4">
				<h5 className="font-bold">Generated Output:</h5>
				<p className="whitespace-pre-wrap text-gray-800 mt-1">{output}</p>
			</div>
		</div>
	);
};

export default ContentStrategistCard;
