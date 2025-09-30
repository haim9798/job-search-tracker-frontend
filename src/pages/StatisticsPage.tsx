import React from 'react';
import { StatisticsOverview } from '../components/statistics';
import { AuthGuard } from '../components/auth/AuthGuard';

export const StatisticsPage: React.FC = () => {
  return (
    <AuthGuard>
      <StatisticsOverview />
    </AuthGuard>
  );
};