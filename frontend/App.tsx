import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import ContentWorkflow from "./pages/ContentWorkflow";
import Settings from "./pages/Settings";
import ResearchPage from "./pages/ResearchPage";
import CodePage from "./pages/CodePage";
import VideoPage from "./pages/VideoPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { AgentProvider } from "./context/AgentContext";

const App: React.FC = () => {
	return (
		<ErrorBoundary>
			<AgentProvider>
				<Layout>
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/workflow" element={<ContentWorkflow />} />
						<Route path="/research" element={<ResearchPage />} />
						<Route path="/code" element={<CodePage />} />
						<Route path="/video" element={<VideoPage />} />
						<Route path="/analytics" element={<Analytics />} />
						<Route path="/settings" element={<Settings />} />
					</Routes>
				</Layout>
			</AgentProvider>
		</ErrorBoundary>
	);
};

export default App;