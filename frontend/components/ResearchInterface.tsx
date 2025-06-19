import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	Filter,
	Calendar,
	Database,
	TrendingUp,
	BarChart3,
	Download,
	Share2,
	BookOpen,
	Globe,
	FileText,
	Clock,
	Star,
	ChevronDown,
	ChevronUp,
	Loader2,
	AlertCircle,
	CheckCircle,
	RefreshCw,
} from "lucide-react";
import axios from "axios";

interface ResearchResult {
	title: string;
	content: string;
	source: string;
	url: string;
	relevance_score: number;
	data_type: string;
	metadata: any;
	created_at: string;
}

interface ResearchResponse {
	query_id: number;
	query: string;
	total_results: number;
	results: ResearchResult[];
	search_time: string;
	sources_searched: string[];
}

interface SearchFilters {
	sources: string[];
	data_types: string[];
	date_from: string;
	date_to: string;
	min_relevance: number;
}

const ResearchInterface: React.FC = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<ResearchResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedResult, setSelectedResult] = useState<ResearchResult | null>(
		null
	);

	const [filters, setFilters] = useState<SearchFilters>({
		sources: [],
		data_types: [],
		date_from: "",
		date_to: "",
		min_relevance: 0.5,
	});

	const [dataSources] = useState([
		{
			id: "academic",
			name: "Academic Databases",
			icon: <BookOpen className="w-4 h-4" />,
		},
		{ id: "web", name: "Web Sources", icon: <Globe className="w-4 h-4" /> },
		{
			id: "statistics",
			name: "Statistical Data",
			icon: <BarChart3 className="w-4 h-4" />,
		},
	]);

	const [dataTypes] = useState([
		{ id: "academic", name: "Academic Papers" },
		{ id: "news", name: "News Articles" },
		{ id: "statistics", name: "Statistical Data" },
		{ id: "market-data", name: "Market Reports" },
		{ id: "meta-analysis", name: "Meta-Analysis" },
	]);

	// Debounced search suggestions
	const getSuggestions = useCallback(async (searchQuery: string) => {
		if (searchQuery.length < 2) {
			setSuggestions([]);
			return;
		}

		try {
			const response = await axios.get(
				`http://localhost:8000/api/research/suggestions`,
				{
					params: { q: searchQuery },
					headers: { Authorization: "Bearer dummy-token" },
				}
			);
			setSuggestions(response.data.data.suggestions);
		} catch (err) {
			console.error("Failed to get suggestions:", err);
		}
	}, []);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (query) {
				getSuggestions(query);
			}
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [query, getSuggestions]);

	const performSearch = async () => {
		if (!query.trim()) return;
		console.log(
			"Calling:",
			`${import.meta.env.VITE_API_BASE_URL}/run_workflow`
		);
		setLoading(true);
		setError("");
		setShowSuggestions(false);

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/run_workflow`,
				{
					input: {
						query: query.trim(),
						filters: filters,
						user_id: "user123",
					},
					agent: "research_data",
				}
			);

			const output = response.data?.output;

			if (!output || !output.results || output.results.length === 0) {
				setError("No results returned.");
				setResults(null);
			} else {
				setResults(output);
				setCurrentPage(1);
			}
		} catch (err: any) {
			console.error("Search error:", err);
			const errorMessage =
				err?.response?.data?.detail || "Search failed. Please try again.";
			setError(errorMessage);
			setResults(null);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			performSearch();
		}
	};

	const selectSuggestion = (suggestion: string) => {
		setQuery(suggestion);
		setShowSuggestions(false);
		setTimeout(() => performSearch(), 100);
	};

	const toggleFilter = (filterType: keyof SearchFilters, value: string) => {
		setFilters((prev) => {
			const currentArray = prev[filterType] as string[];
			const newArray = currentArray.includes(value)
				? currentArray.filter((item) => item !== value)
				: [...currentArray, value];

			return { ...prev, [filterType]: newArray };
		});
	};

	const getSourceIcon = (source: string) => {
		switch (source.toLowerCase()) {
			case "academic database":
			case "pubmed":
				return <BookOpen className="w-4 h-4 text-blue-600" />;
			case "government statistics":
				return <BarChart3 className="w-4 h-4 text-green-600" />;
			case "industry news":
			case "market research":
				return <Globe className="w-4 h-4 text-purple-600" />;
			default:
				return <FileText className="w-4 h-4 text-gray-600" />;
		}
	};

	const getRelevanceColor = (score: number) => {
		if (score >= 0.8) return "text-green-600 bg-green-100";
		if (score >= 0.6) return "text-yellow-600 bg-yellow-100";
		return "text-red-600 bg-red-100";
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="max-w-7xl mx-auto p-6">
			{/* Header */}
			<motion.div
				className="mb-8"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}>
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
						<Search className="w-5 h-5 text-white" />
					</div>
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Research & Data Agent
						</h1>
						<p className="text-gray-600">
							Comprehensive research across academic, web, and statistical
							sources
						</p>
					</div>
				</div>
			</motion.div>

			{/* Search Interface */}
			<motion.div
				className="card mb-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}>
				<div className="relative">
					{/* Search Input */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<Search className="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="text"
							className="w-full pl-12 pr-32 py-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							placeholder="Enter your research query..."
							value={query}
							onChange={(e) => {
								setQuery(e.target.value);
								setShowSuggestions(true);
							}}
							onKeyPress={handleKeyPress}
							onFocus={() => setShowSuggestions(true)}
						/>
						<div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-4">
							<motion.button
								onClick={() => setShowFilters(!showFilters)}
								className={`p-2 rounded-lg transition-colors ${
									showFilters
										? "bg-blue-100 text-blue-600"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								<Filter className="w-4 h-4" />
							</motion.button>
							<motion.button
								onClick={performSearch}
								disabled={loading || !query.trim()}
								className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}>
								{loading ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									"Search"
								)}
							</motion.button>
						</div>
					</div>

					{/* Search Suggestions */}
					<AnimatePresence>
						{showSuggestions && suggestions.length > 0 && (
							<motion.div
								className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}>
								{suggestions.map((suggestion, index) => (
									<motion.button
										key={index}
										className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
										onClick={() => selectSuggestion(suggestion)}
										whileHover={{ backgroundColor: "#f9fafb" }}>
										<div className="flex items-center gap-2">
											<Search className="w-4 h-4 text-gray-400" />
											<span className="text-gray-700">{suggestion}</span>
										</div>
									</motion.button>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Filters Panel */}
				<AnimatePresence>
					{showFilters && (
						<motion.div
							className="mt-6 p-6 bg-gray-50 rounded-xl"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								{/* Data Sources */}
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-3">
										Data Sources
									</label>
									<div className="space-y-2">
										{dataSources.map((source) => (
											<label
												key={source.id}
												className="flex items-center gap-2 cursor-pointer">
												<input
													type="checkbox"
													checked={filters.sources.includes(source.id)}
													onChange={() => toggleFilter("sources", source.id)}
													className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												/>
												<div className="flex items-center gap-2">
													{source.icon}
													<span className="text-sm text-gray-700">
														{source.name}
													</span>
												</div>
											</label>
										))}
									</div>
								</div>

								{/* Data Types */}
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-3">
										Data Types
									</label>
									<div className="space-y-2">
										{dataTypes.map((type) => (
											<label
												key={type.id}
												className="flex items-center gap-2 cursor-pointer">
												<input
													type="checkbox"
													checked={filters.data_types.includes(type.id)}
													onChange={() => toggleFilter("data_types", type.id)}
													className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												/>
												<span className="text-sm text-gray-700">
													{type.name}
												</span>
											</label>
										))}
									</div>
								</div>

								{/* Date Range */}
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-3">
										Date Range
									</label>
									<div className="space-y-2">
										<input
											type="date"
											value={filters.date_from}
											onChange={(e) =>
												setFilters((prev) => ({
													...prev,
													date_from: e.target.value,
												}))
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="From"
										/>
										<input
											type="date"
											value={filters.date_to}
											onChange={(e) =>
												setFilters((prev) => ({
													...prev,
													date_to: e.target.value,
												}))
											}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="To"
										/>
									</div>
								</div>

								{/* Relevance */}
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-3">
										Min Relevance: {(filters.min_relevance * 100).toFixed(0)}%
									</label>
									<input
										type="range"
										min="0"
										max="1"
										step="0.1"
										value={filters.min_relevance}
										onChange={(e) =>
											setFilters((prev) => ({
												...prev,
												min_relevance: parseFloat(e.target.value),
											}))
										}
										className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
									/>
									<div className="flex justify-between text-xs text-gray-500 mt-1">
										<span>0%</span>
										<span>100%</span>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			{/* Error Display */}
			<AnimatePresence>
				{error && (
					<motion.div
						className="mb-6 p-4 border-2 border-red-200 bg-red-50 rounded-xl"
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}>
						<div className="flex items-center text-red-600">
							<AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
							<span className="font-medium">{error}</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Results */}
			<AnimatePresence>
				{results && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}>
						{/* Results Header */}
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-4">
								<h2 className="text-xl font-bold text-gray-800">
									Search Results
								</h2>
								<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
									{results.total_results} results found
								</span>
							</div>
							<div className="flex items-center gap-2">
								<motion.button
									className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									title="Download results">
									<Download className="w-4 h-4 text-gray-600" />
								</motion.button>
								<motion.button
									className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									title="Share results">
									<Share2 className="w-4 h-4 text-gray-600" />
								</motion.button>
							</div>
						</div>

						{/* Results List */}
						<div className="space-y-4">
							{results.results.map((result, index) => (
								<motion.div
									key={index}
									className="card hover:shadow-lg transition-all cursor-pointer"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									onClick={() => setSelectedResult(result)}
									whileHover={{ scale: 1.01 }}>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												{getSourceIcon(result.source)}
												<span className="text-sm font-medium text-gray-600">
													{result.source}
												</span>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(
														result.relevance_score
													)}`}>
													{(result.relevance_score * 100).toFixed(0)}% relevant
												</span>
												<span className="text-xs text-gray-400">
													{result.metadata?.publication_date &&
														formatDate(result.metadata.publication_date)}
												</span>
											</div>
											<h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
												{result.title}
											</h3>
											<p className="text-gray-600 text-sm line-clamp-2 mb-3">
												{result.content}
											</p>
											<div className="flex items-center gap-4 text-xs text-gray-500">
												<span className="flex items-center gap-1">
													<FileText className="w-3 h-3" />
													{result.data_type}
												</span>
												{result.metadata?.word_count && (
													<span>{result.metadata.word_count} words</span>
												)}
												{result.metadata?.citations && (
													<span>{result.metadata.citations} citations</span>
												)}
											</div>
										</div>
										<div className="ml-4 flex flex-col items-end gap-2">
											<div className="flex items-center gap-1">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`w-3 h-3 ${
															i < Math.round(result.relevance_score * 5)
																? "text-yellow-400 fill-current"
																: "text-gray-300"
														}`}
													/>
												))}
											</div>
											{result.url && (
												<a
													href={result.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:text-blue-800 text-xs"
													onClick={(e) => e.stopPropagation()}>
													View Source →
												</a>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</div>

						{/* Pagination */}
						{results.total_results > 20 && (
							<div className="mt-8 flex justify-center">
								<div className="flex items-center gap-2">
									<button
										disabled={currentPage === 1}
										className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
										Previous
									</button>
									<span className="px-4 py-2 text-sm text-gray-600">
										Page {currentPage} of{" "}
										{Math.ceil(results.total_results / 20)}
									</span>
									<button
										disabled={
											currentPage >= Math.ceil(results.total_results / 20)
										}
										className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
										Next
									</button>
								</div>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Result Detail Modal */}
			<AnimatePresence>
				{selectedResult && (
					<motion.div
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setSelectedResult(null)}>
						<motion.div
							className="bg-white rounded-xl max-w-4xl max-h-[80vh] overflow-y-auto p-6"
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}>
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									{getSourceIcon(selectedResult.source)}
									<div>
										<h2 className="text-xl font-bold text-gray-800">
											{selectedResult.title}
										</h2>
										<p className="text-sm text-gray-600">
											{selectedResult.source}
										</p>
									</div>
								</div>
								<button
									onClick={() => setSelectedResult(null)}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
									×
								</button>
							</div>

							<div className="prose max-w-none">
								<p className="text-gray-700 leading-relaxed">
									{selectedResult.content}
								</p>
							</div>

							{selectedResult.metadata &&
								Object.keys(selectedResult.metadata).length > 0 && (
									<div className="mt-6 p-4 bg-gray-50 rounded-lg">
										<h3 className="font-semibold text-gray-800 mb-2">
											Metadata
										</h3>
										<div className="grid grid-cols-2 gap-4 text-sm">
											{Object.entries(selectedResult.metadata).map(
												([key, value]) => (
													<div key={key}>
														<span className="font-medium text-gray-600">
															{key}:
														</span>
														<span className="ml-2 text-gray-800">
															{String(value)}
														</span>
													</div>
												)
											)}
										</div>
									</div>
								)}

							{selectedResult.url && (
								<div className="mt-4 flex justify-end">
									<a
										href={selectedResult.url}
										target="_blank"
										rel="noopener noreferrer"
										className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
										View Full Source
									</a>
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ResearchInterface;
