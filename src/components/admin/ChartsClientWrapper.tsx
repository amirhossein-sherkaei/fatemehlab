'use client';

import dynamic from 'next/dynamic';

const DashboardCharts = dynamic(() => import('./DashboardCharts'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-3xl" />
});

export default function ChartsClientWrapper({ data }: { data: any[] }) {
  return <DashboardCharts data={data} />;
}