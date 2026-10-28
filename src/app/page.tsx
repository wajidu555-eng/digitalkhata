import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardHeader from './components/DashboardHeader';
import MetricsBentoGrid from './components/MetricsBentoGrid';
import FlowChartCard from './components/FlowChartCard';
import ExposureChartCard from './components/ExposureChartCard';
import RecentLedgerTable from './components/RecentLedgerTable';
import TopDebtors from './components/TopDebtors';
import ActivityFeed from './components/ActivityFeed';

export default function BusinessDashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <MetricsBentoGrid />
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <FlowChartCard />
          </div>
          <ExposureChartCard />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentLedgerTable />
          </div>
          <div className="space-y-4">
            <TopDebtors />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}