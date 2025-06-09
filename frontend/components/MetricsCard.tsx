import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { PerformanceMetric } from "../types";

interface MetricsCardProps {
  metric: PerformanceMetric;
  index?: number;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ metric, index = 0 }) => {
  const isPositive = metric.change > 0;
  const percentComplete = Math.min((metric.value / metric.target) * 100, 100);

  return (
    <motion.div 
      className="card group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isPositive 
          ? 'from-emerald-50 to-teal-50' 
          : 'from-red-50 to-orange-50'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              isPositive ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={`w-4 h-4 ${
                isPositive ? 'text-emerald-600' : 'text-red-600'
              }`} />
            </div>
            <h3 className="text-gray-700 font-semibold text-sm">{metric.name}</h3>
          </div>
          
          <motion.div
            className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
              isPositive 
                ? "text-emerald-700 bg-emerald-100" 
                : "text-red-700 bg-red-100"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
          >
            <span>
              {isPositive ? "+" : ""}
              {metric.change}%
            </span>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 ml-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 ml-1" />
            )}
          </motion.div>
        </div>

        {/* Value Display */}
        <div className="flex items-end justify-between mb-4">
          <motion.div 
            className="text-3xl font-bold text-gray-800"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
          >
            {metric.value}
          </motion.div>
          <div className="text-sm text-gray-500">
            Target: <span className="font-medium">{metric.target}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{percentComplete.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                percentComplete >= 100 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : percentComplete >= 75
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  : percentComplete >= 50
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${percentComplete}%` }}
              transition={{ 
                delay: 0.5 + index * 0.1, 
                duration: 1,
                ease: "easeOut"
              }}
            />
          </div>
        </div>

        {/* Status Indicator */}
        <motion.div 
          className="mt-3 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 + index * 0.1 }}
        >
          <div className={`w-2 h-2 rounded-full ${
            percentComplete >= 100 
              ? 'bg-emerald-500' 
              : percentComplete >= 75
              ? 'bg-blue-500'
              : percentComplete >= 50
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`} />
          <span className="text-xs text-gray-500">
            {percentComplete >= 100 
              ? 'Target achieved' 
              : percentComplete >= 75
              ? 'On track'
              : percentComplete >= 50
              ? 'Needs attention'
              : 'Below target'
            }
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MetricsCard;