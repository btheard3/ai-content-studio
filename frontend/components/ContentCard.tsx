import React, { useState } from "react";
import axios from "axios";
import { Sparkles, Loader2, AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";

interface WorkflowStage {
  agent_id: string;
  stage_name: string;
  status: string;
  output_keys?: string[];
  error?: string;
}

interface WorkflowResponse {
  success: boolean;
  data?: any;
  error?: string;
  stages_completed?: WorkflowStage[];
  workflow_type?: string;
}

const ContentGenerationForm = () => {
  const [input, setInput] = useState("");
  const [workflowResult, setWorkflowResult] = useState<WorkflowResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runWorkflow = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setWorkflowResult(null);

    try {
      const response = await axios.post("http://localhost:8000/run_workflow", {
        text: input,
        workflow_type: "content_generation"
      });

      setWorkflowResult(response.data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.response?.data?.error || "Network Error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
        <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
        AI Content Generation Workflow
      </h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content Brief
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          rows={4}
          placeholder="Describe your content needs... e.g., 'Create a comprehensive guide about AI in healthcare for business executives, focusing on practical implementation strategies and ROI considerations.'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <button
        onClick={runWorkflow}
        disabled={loading || !input.trim()}
        className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-6">
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
            Processing Workflow...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Content
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Workflow Progress */}
      {workflowResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center">
              {workflowResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              )}
              <span className="font-medium">
                Workflow {workflowResult.success ? "Completed Successfully" : "Failed"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {workflowResult.stages_completed?.length || 0} stages processed
            </span>
          </div>

          {/* Stages Progress */}
          {workflowResult.stages_completed && workflowResult.stages_completed.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Workflow Stages:</h4>
              <div className="space-y-2">
                {workflowResult.stages_completed.map((stage, index) => (
                  <div
                    key={stage.agent_id}
                    className={`p-3 border rounded-lg ${getStageColor(stage.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStageIcon(stage.status)}
                        <span className="ml-2 font-medium">{stage.stage_name}</span>
                        <span className="ml-2 text-sm text-gray-500">({stage.agent_id})</span>
                      </div>
                      {index < workflowResult.stages_completed!.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    {stage.error && (
                      <p className="mt-2 text-sm text-red-600">{stage.error}</p>
                    )}
                    {stage.output_keys && stage.output_keys.length > 0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        Generated: {stage.output_keys.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Output */}
          {workflowResult.success && workflowResult.data && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Generated Content:</h4>
              
              {/* Campaign Theme */}
              {workflowResult.data.campaign_theme && (
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Campaign Theme</h5>
                  <p className="text-blue-700">{workflowResult.data.campaign_theme}</p>
                </div>
              )}

              {/* Final Content */}
              {workflowResult.data.final_content && (
                <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2">Final Content</h5>
                  <div className="text-sm text-gray-700 whitespace-pre-line max-h-96 overflow-y-auto">
                    {workflowResult.data.final_content}
                  </div>
                </div>
              )}

              {/* Quality Score */}
              {workflowResult.data.quality_score && (
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">Quality Assessment</h5>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-green-700">
                      {workflowResult.data.quality_score}%
                    </span>
                    <span className="ml-2 text-green-600">Quality Score</span>
                  </div>
                </div>
              )}

              {/* Publishing Status */}
              {workflowResult.data.published_status && (
                <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800 mb-2">Publishing Status</h5>
                  <div className="text-sm text-purple-700 whitespace-pre-line">
                    {workflowResult.data.published_status}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentGenerationForm;