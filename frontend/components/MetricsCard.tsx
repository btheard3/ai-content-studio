import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PerformanceMetric } from '../types';

interface MetricsCardProps {
  metric: PerformanceMetric;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ metric }) => {
  const isPositive = metric.change > 0;
  const percentComplete = (metric.value / metric.target) * 100;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-600 font-medium">{metric.name}</h3>
        <div
          className={`flex items-center text-sm ${
            isPositive ? 'text-success-600' : 'text-error-600'
          }`}
        >
          <span>{`${isPositive ? '+' : ''}${metric.change}%`}</span>
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 ml-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 ml-1" />
          )}
        </div>
      </div>
      <div className="flex items-end justify-between mb-2">
        <div className="text-3xl font-semibold">{metric.value}</div>
        <div className="text-sm text-gray-500">Target: {metric.target}</div>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            percentComplete >= 90
              ? 'bg-success-500'
              : percentComplete >= 60
              ? 'bg-warning-500'
              : 'bg-primary-500'
          }`}
          style={{ width: `${percentComplete}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MetricsCard;