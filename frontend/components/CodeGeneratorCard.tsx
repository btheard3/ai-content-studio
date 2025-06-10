import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Play,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  Settings,
  Clock,
  FileCode,
  TestTube,
  BookOpen,
  RefreshCw,
  Info,
  Copy,
  Eye,
  Folder,
  File
} from 'lucide-react';
import { useApi, apiService } from '../hooks/useApi';

interface CodeGenerationResponse {
  success: boolean;
  generated_code?: Record<string, string>;
  test_files?: Record<string, string>;
  documentation?: string;
  setup_instructions?: string;
  api_docs?: string;
  architecture?: any;
  language?: string;
  framework?: string;
  status: string;
  error?: string;
}

const CodeGeneratorCard: React.FC = () => {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('python');
  const [framework, setFramework] = useState('');
  const [complexity, setComplexity] = useState('medium');
  const [includeTests, setIncludeTests] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [selectedFile, setSelectedFile] = useState<string>('');

  const {
    data: codeResult,
    loading,
    error,
    execute: generateCode,
    reset
  } = useApi<CodeGenerationResponse>(apiService.generateCode);

  const languages = [
    { id: 'python', name: 'Python', frameworks: ['FastAPI', 'Django', 'Flask', 'None'] },
    { id: 'javascript', name: 'JavaScript', frameworks: ['React', 'Node.js', 'Express', 'Vue.js', 'None'] },
    { id: 'typescript', name: 'TypeScript', frameworks: ['React', 'Node.js', 'Express', 'Angular', 'None'] },
    { id: 'java', name: 'Java', frameworks: ['Spring Boot', 'Spring MVC', 'None'] },
    { id: 'csharp', name: 'C#', frameworks: ['.NET Core', 'ASP.NET', 'None'] },
    { id: 'go', name: 'Go', frameworks: ['Gin', 'Echo', 'Fiber', 'None'] },
    { id: 'rust', name: 'Rust', frameworks: ['Actix', 'Warp', 'Rocket', 'None'] },
    { id: 'php', name: 'PHP', frameworks: ['Laravel', 'Symfony', 'None'] },
    { id: 'ruby', name: 'Ruby', frameworks: ['Rails', 'Sinatra', 'None'] },
    { id: 'swift', name: 'Swift', frameworks: ['SwiftUI', 'UIKit', 'None'] }
  ];

  const complexityLevels = [
    { id: 'simple', name: 'Simple', description: 'Basic functionality, single file' },
    { id: 'medium', name: 'Medium', description: 'Modular structure, multiple files' },
    { id: 'complex', name: 'Complex', description: 'Full architecture, enterprise patterns' }
  ];

  const selectedLanguage = languages.find(l => l.id === language);

  useEffect(() => {
    // Reset framework when language changes
    if (selectedLanguage && !selectedLanguage.frameworks.includes(framework)) {
      setFramework(selectedLanguage.frameworks[0] || '');
    }
  }, [language, selectedLanguage, framework]);

  useEffect(() => {
    // Auto-select first file when code is generated
    if (codeResult?.generated_code && Object.keys(codeResult.generated_code).length > 0) {
      const firstFile = Object.keys(codeResult.generated_code)[0];
      setSelectedFile(firstFile);
    }
  }, [codeResult]);

  const handleGenerateCode = async () => {
    if (!description.trim()) return;

    const result = await generateCode({
      description: description.trim(),
      language,
      framework: framework === 'None' ? '' : framework,
      complexity,
      include_tests: includeTests
    });

    if (result?.success) {
      console.log('✅ Code generated successfully:', result);
      setActiveTab('code');
    } else {
      console.error('❌ Code generation failed:', result?.error);
    }
  };

  const handleReset = () => {
    reset();
    setDescription('');
    setSelectedFile('');
    setActiveTab('code');
  };

  const handleCopyCode = (content: string) => {
    navigator.clipboard.writeText(content);
    // TODO: Add toast notification
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-200 bg-emerald-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const renderFileTree = (files: Record<string, string>) => {
    return (
      <div className="space-y-1">
        {Object.keys(files).map((fileName) => (
          <motion.button
            key={fileName}
            onClick={() => setSelectedFile(fileName)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectedFile === fileName
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <File className="w-4 h-4" />
            <span className="text-sm font-medium">{fileName}</span>
          </motion.button>
        ))}
      </div>
    );
  };

  const renderCodeViewer = (content: string, fileName: string) => {
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-800">{fileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => handleCopyCode(content)}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Copy code"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </motion.button>
          </div>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{content}</code>
        </pre>
      </div>
    );
  };

  const tabs = [
    { id: 'code', label: 'Generated Code', icon: <Code className="w-4 h-4" /> },
    { id: 'tests', label: 'Test Files', icon: <TestTube className="w-4 h-4" /> },
    { id: 'docs', label: 'Documentation', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'setup', label: 'Setup Guide', icon: <Settings className="w-4 h-4" /> }
  ];

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
            <Code className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">AI Code Generator</h3>
            <p className="text-sm text-gray-500">Generate clean, documented code in multiple languages</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-lg transition-colors ${
              showAdvanced ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Description Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Project Description
        </label>
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.01 }}
        >
          <textarea
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
            rows={4}
            placeholder="Describe what you want to build... e.g., 'A REST API for a task management system with user authentication, CRUD operations for tasks, and email notifications'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {description.length}/1000
          </div>
        </motion.div>
      </div>

      {/* Basic Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Framework</label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedLanguage?.frameworks.map((fw) => (
              <option key={fw} value={fw}>
                {fw}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Complexity</label>
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {complexityLevels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>
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
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Advanced Options
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeTests"
                  checked={includeTests}
                  onChange={(e) => setIncludeTests(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="includeTests" className="text-sm text-gray-700">
                  Generate unit tests
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complexityLevels.map((level) => (
                  <div
                    key={level.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      complexity === level.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setComplexity(level.id)}
                  >
                    <div className="font-medium text-sm text-gray-800">{level.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          onClick={handleGenerateCode}
          disabled={loading || !description.trim()}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
              Generating Code...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Generate Code
            </>
          )}
        </motion.button>

        {(codeResult || error) && (
          <motion.button
            onClick={handleReset}
            className="flex items-center px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
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
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center text-red-600 text-sm">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <div>
                <strong>Code Generation Error:</strong>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {codeResult && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Status Header */}
            <motion.div 
              className={`flex items-center justify-between p-4 border-2 rounded-xl ${getStatusColor(codeResult.status)}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center">
                {getStatusIcon(codeResult.status)}
                <div className="ml-3">
                  <span className="font-semibold text-lg">
                    Code {codeResult.status === 'completed' ? 'Generated Successfully' : 
                           codeResult.status === 'error' ? 'Generation Failed' : 
                           'Processing...'}
                  </span>
                  <p className="text-sm opacity-75 mt-1">
                    Language: {codeResult.language} | Framework: {codeResult.framework || 'None'}
                  </p>
                </div>
              </div>
              
              {codeResult.status === 'completed' && (
                <div className="flex items-center gap-2">
                  <motion.button
                    className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Download project"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Share project"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Tab Navigation */}
            {codeResult.status === 'completed' && (
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Tab Content */}
            {codeResult.status === 'completed' && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-2 border-gray-200 bg-gray-50 rounded-xl p-4"
              >
                {activeTab === 'code' && codeResult.generated_code && (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-1">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Folder className="w-4 h-4" />
                        Project Files
                      </h4>
                      {renderFileTree(codeResult.generated_code)}
                    </div>
                    <div className="lg:col-span-3">
                      {selectedFile && codeResult.generated_code[selectedFile] && (
                        renderCodeViewer(codeResult.generated_code[selectedFile], selectedFile)
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'tests' && codeResult.test_files && (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-1">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <TestTube className="w-4 h-4" />
                        Test Files
                      </h4>
                      {renderFileTree(codeResult.test_files)}
                    </div>
                    <div className="lg:col-span-3">
                      {selectedFile && codeResult.test_files[selectedFile] && (
                        renderCodeViewer(codeResult.test_files[selectedFile], selectedFile)
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'docs' && codeResult.documentation && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Documentation
                    </h4>
                    <div className="prose max-w-none bg-white p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{codeResult.documentation}</pre>
                    </div>
                  </div>
                )}

                {activeTab === 'setup' && codeResult.setup_instructions && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Setup Instructions
                    </h4>
                    <div className="prose max-w-none bg-white p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{codeResult.setup_instructions}</pre>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Error Details */}
            {codeResult.status === 'error' && codeResult.error && (
              <motion.div 
                className="p-4 border-2 border-red-200 bg-red-50 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="font-semibold text-red-800 mb-2">Error Details</h4>
                <p className="text-sm text-red-600">{codeResult.error}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CodeGeneratorCard;