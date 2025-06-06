import React, { useState } from "react";
import { motion } from "framer-motion";
import { PiFunnelSimpleFill } from "react-icons/pi";

import ContentCard from "../components/ContentCard";
import WorkflowVisualizer from "../components/WorkflowVisualizer";
import { useAgents } from "../context/AgentContext";
import { WorkflowStage, ContentItem } from "../types";

const ContentWorkflow: React.FC = () => {
  const { contentItems } = useAgents();

  const [filterStage, setFilterStage] = useState<WorkflowStage | "all">("all");
  const [filterType, setFilterType] = useState<string | "all">("all");

  // Filter content
  const filteredContent = contentItems.filter((item) => {
    const matchStage = filterStage === "all" || item.stage === filterStage;
    const matchType = filterType === "all" || item.contentType === filterType;
    return matchStage && matchType;
  });

  // Group content by stage
  const groupedContent = filteredContent.reduce((acc, item) => {
    if (!acc[item.stage]) {
      acc[item.stage] = [];
    }
    acc[item.stage].push(item);
    return acc;
  }, {} as Record<WorkflowStage, ContentItem[]>);

  const contentTypes: { value: string; label: string }[] = [
    { value: "all", label: "All Types" },
    { value: "blog", label: "Blog Posts" },
    { value: "social", label: "Social Media" },
    { value: "email", label: "Email" },
    { value: "video", label: "Video" },
    { value: "whitepaper", label: "Whitepapers" },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <PiFunnelSimpleFill
          {...({ className: "text-gray-500 text-xl" } as React.ComponentProps<"svg">)}
        />
        <select
          className="border rounded px-2 py-1"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {contentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <WorkflowVisualizer activeStage={filterStage} onStageClick={setFilterStage} />

      {Object.entries(groupedContent as Record<string, ContentItem[]>).map(
        ([stage, items]: [string, ContentItem[]]) => (
          <div key={stage} className="mb-8">
            <h2 className="text-primary-600 font-medium mb-2">
              {stage} – {items.length} item{items.length !== 1 ? "s" : ""}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          </div>
        )
      )}

      {filteredContent.length === 0 && (
        <div className="col-span-full py-8 card bg-gray-50">
          <p className="text-center py-2 text-gray-500 text-sm">
            No content items match your filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentWorkflow;

