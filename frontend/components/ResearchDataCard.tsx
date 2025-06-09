import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Search, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  TrendingUp,
  BarChart3,
  FileText,
  Globe,
  BookOpen,
  Clock,
  Star,
  ExternalLink,
  Filter,
  Download,
  Share2
} from "lucide-react";

interface ResearchResult {
  title: string;
  content: string;
  source: string;
  url?: string;
  relevance_score: number;
  data_type: string;
  metadata: any;
}

interface ResearchResponse {
  query_id: number;
  query: string;
  total_results: number;
  results: ResearchResult[];
  search_time: string;
  sources_searched: string[];
}

const ResearchDataCard = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ResearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(['academic', 'web', 'statistics']);
  const [minRelevance, setMinRelevance] = useState(0.5);

  const dataSources = [
    { id: 'academic', name: 'Academic Papers', icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-600' },
    { id: 'web', name: 'Web Sources', icon: <Globe className="w-4 h-4" />, color: 'text-green-600' },
    { id: 'statistics', name: 'Statistical Data', icon: <BarChart3 className="w-4 h-4" />, color: 'text-purple-600' }
  ];

  const runAgent = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      setError("");
      setResults(null);

      // Use the new research API
      const response = await axios.post(
        "http://localhost:8000/api/research/search",
        {
          query: input.trim(),
          filters: {
            sources: selectedSources,
            min_relevance: minRelevance
          },
          user_id: "user123"
        },
        {
          headers: { Authorization: 'Bearer dummy-token' }
        }
      );

      setResults(response.data.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.response?.data?.error || "Research failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (source: string) => {
    if (source.toLowerCase().includes('academic') || source.toLowerCase().includes('pubmed')) {
      return <BookOpen className="w-4 h-4 text-blue-600" />;
    } else if (source.toLowerCase().includes('government') || source.toLowerCase().includes('statistics')) {
      return <BarChart3 className="w-4 h-4 text-green-600" />;
    } else {
      return <Globe className="w-4 h-4 text-purple-600" />;
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  return (
    <motion.div 
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Search className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Research & Data Agent</h3>
            <p className="text-sm text-gray-500">Comprehensive research across multiple sources</p>
          </div>
        </div>
        
        <motion.button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`p-2 rounded-lg transition-colors ${
            showAdvanced ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Research Query
        </label>
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.01 }}
        >
          <textarea
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
            rows={3}
            placeholder="Enter your research topic... e.g., 'AI applications in healthcare', 'climate change statistics', 'market trends in renewable energy'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {input.length}/500
          </div>
        </motion.div>
      </div>

      {/* Advanced Options */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            className="mb-6 p-4 bg-gray-50 rounded-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-semibold text-gray-700 mb-4">Search Options</h4>
            
            {/* Data Sources */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">Data Sources</label>
              <div className="flex flex-wrap gap-2">
                {dataSources.map((source) => (
                  <motion.button
                    key={source.id}
                    onClick={() => toggleSource(source.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      selectedSources.includes(source.id)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {source.icon}
                    <span className="text-sm">{source.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Relevance Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Minimum Relevance: {(minRelevance * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={minRelevance}
                onChange={(e) => setMinRelevance(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <motion.button
        onClick={runAgent}
        disabled={loading || !input.trim()}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg mb-6"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Researching...
          </>
        ) : (
          <>
            <Search className="w-5 h-5 mr-2" />
            Start Research
          </>
        )}
      </motion.button>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="mb-6 p-4 border-2 border-red-200 bg-red-50 rounded-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center text-red-600 text-sm">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <div>
                <strong>Research Error:</strong>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Results Header */}
            <motion.div 
              className="flex items-center justify-between p-4 border-2 border-emerald-200 bg-emerald-50 rounded-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                <div>
                  <span className="font-semibold text-lg text-emerald-800">
                    Research Completed Successfully
                  </span>
                  <p className="text-sm text-emerald-600 mt-1">
                    Found {results.total_results} results from {results.sources_searched.length} sources
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Download results"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Share results"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Research Results */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                <Database className="w-5 h-5" />
                Research Findings:
              </h4>
              
              {results.results.map((result, index) => (
                <motion.div
                  key={index}
                  className="p-4 border-2 border-gray-200 bg-gray-50 rounded-xl hover:shadow-md transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getSourceIcon(result.source)}
                      <div>
                        <span className="text-sm font-medium text-gray-600">{result.source}</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(result.relevance_score)}`}>
                          {(result.relevance_score * 100).toFixed(0)}% relevant
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.round(result.relevance_score * 5)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <h5 className="font-semibold text-gray-800 mb-2">{result.title}</h5>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{result.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {result.data_type}
                      </span>
                      {result.metadata?.publication_date && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(result.metadata.publication_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    {result.url && (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        View Source
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary Stats */}
            <motion.div 
              className="p-4 border-2 border-blue-200 bg-blue-50 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Research Summary
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{results.total_results}</div>
                  <div className="text-blue-600">Total Results</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{results.sources_searched.length}</div>
                  <div className="text-blue-600">Sources Searched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {results.results.length > 0 
                      ? (results.results.reduce((sum, r) => sum + r.relevance_score, 0) / results.results.length * 100).toFixed(0)
                      : 0}%
                  </div>
                  <div className="text-blue-600">Avg Relevance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {new Date(results.search_time).toLocaleTimeString()}
                  </div>
                  <div className="text-blue-600">Search Time</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResearchDataCard;