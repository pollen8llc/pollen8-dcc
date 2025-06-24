
import { useState, useEffect } from 'react';

interface DashboardData {
  stats: {
    totalRequests: number;
    activeProjects: number;
    completedProjects: number;
  };
  recentActivity: any[];
}

export const useLabr8Dashboard = () => {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalRequests: 0,
      activeProjects: 0,
      completedProjects: 0
    },
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Placeholder data loading
    setIsLoading(false);
  }, []);

  return { data, isLoading };
};
