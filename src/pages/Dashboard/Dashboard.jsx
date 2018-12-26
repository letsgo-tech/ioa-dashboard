import React, { Component, Suspense } from 'react';
import PageLoading from '../../components/PageLoading';

const SystemInfoOverview = React.lazy(() => import('./components/SystemInfoOverview'));
const OverviewChart = React.lazy(() => import('./components/OverviewChart'));
const FlowLineChart = React.lazy(() => import('./components/FlowLineChart'));
const ErrorTypeData = React.lazy(() => import('./components/ErrorTypeData'));

export default class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard-page">
        <Suspense fallback={<PageLoading />}>
            <SystemInfoOverview />
        </Suspense>
        <Suspense fallback={null}>
          <OverviewChart />
        </Suspense>
        <Suspense fallback={null}>
          <FlowLineChart />
        </Suspense>
        <Suspense fallback={null}>
          <ErrorTypeData />
        </Suspense>
      </div>
    );
  }
}
