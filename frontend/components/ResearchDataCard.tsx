// frontend/components/ResearchDataCard.tsx
import React, { useState } from "react";
import axios from "axios";

const ResearchDataCard = () => {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [loading, setLoading] = useState(false);

	const runAgent = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				"http://localhost:8000/run/research_data",
				{
					text: input,
				}
			);
			setOutput(response.data.text || "No output returned.");
		} catch (error: any) {
			setOutput(
				"⚠️ Error: " + (error?.response?.data?.error || "Unknown error")
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white rounded shadow p-4 mt-4">
			<h2 className="text-xl font-bold mb-2">🔍 Research & Data Agent</h2>
			<textarea
				className="w-full border rounded p-2 mb-2"
				placeholder="Enter content brief..."
				value={input}
				onChange={(e) => setInput(e.target.value)}
				rows={3}
			/>
			<button
				className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
				onClick={runAgent}
				disabled={loading}>
				{loading ? "Running..." : "Run Research Agent"}
			</button>
			{output && (
				<div className="mt-4">
					<h3 className="font-semibold mb-1">🔬 Output:</h3>
					<pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded border">
						{output}
					</pre>
				</div>
			)}
		</div>
	);
};

export default ResearchDataCard;
