import React from 'react';
import { ActivityLog } from '../types';
import { Clock } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityLog[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  // Format the timestamp
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - activityTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex">
            <div className="mr-4 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">{activity.action}</p>
              {activity.details && (
                <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;