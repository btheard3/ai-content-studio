import React, { useState } from "react";
import { Textarea } from "@/components/textarea";
import { Button } from "@/components/button";
import { Loader } from "lucide-react";

const VideoPage: React.FC = () => {
	const [prompt, setPrompt] = useState("");
	const [script, setScript] = useState("");
	const [videoUrl, setVideoUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("");

	const handleGenerate = async () => {
		setLoading(true);
		setStatus("Generating script with OpenAI...");

		try {
			// Step 1: Call script_generator agent
			const scriptRes = await fetch("/run/script_generator", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_prompt: prompt }),
			});
			const scriptData = await scriptRes.json();
			const generatedScript = scriptData.output?.video_script;

			setScript(generatedScript);
			setStatus("Generating video with Tavus...");

			// Step 2: Call video_generator agent
			const videoRes = await fetch("/run/video_generator", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ video_script: generatedScript, title: prompt }),
			});
			const videoData = await videoRes.json();
			const url = videoData.output?.video_url;

			setVideoUrl(url);
			setStatus("Video ready!");
		} catch (error) {
			console.error("Error:", error);
			setStatus("Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">🎥 AI Video Generator</h1>

			<Textarea
				placeholder="Enter a topic for your video..."
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				className="w-full min-h-[100px]"
			/>

			<Button onClick={handleGenerate} disabled={loading || !prompt}>
				{loading ? (
					<>
						<Loader className="animate-spin mr-2 h-4 w-4" />
						Generating...
					</>
				) : (
					"Generate Video"
				)}
			</Button>

			{status && <p className="text-gray-600">{status}</p>}

			{script && (
				<div className="mt-6">
					<h2 className="text-xl font-semibold mb-2">📝 Generated Script</h2>
					<pre className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
						{script}
					</pre>
				</div>
			)}

			{videoUrl && (
				<div className="mt-6">
					<h2 className="text-xl font-semibold mb-2">📹 Generated Video</h2>
					<video
						src={videoUrl}
						controls
						className="w-full rounded-lg border border-gray-200"
					/>
				</div>
			)}
		</div>
	);
};

export default VideoPage;
