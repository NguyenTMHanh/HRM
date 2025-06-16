import React from 'react';
import KPICardsSection from './KPICardsSection';
import CircularProgressSection from './CircularProgressSection';
import AgingChart from './AgingChart';
import WorkingCapitalChart from './WorkingCapitalChart';
import ProfitLossChart from './ProfitLossChart';

const styles = {
  collapseWrapper: {
    width: '100%',
    height: '100vh',
    backgroundColor: '#f5f7fa',
  },
  scrollContainer: {
    height: 'calc(100vh - 105px)',
    overflowY: 'auto',
    padding: '20px',
    margin: '15px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: 'calc(100% - 30px)',
  },
};

const Dashboard = () => (
  <div style={styles.collapseWrapper}>
    <div style={styles.scrollContainer}>
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Left - KPI Cards */}
          <div>
            <KPICardsSection />
          </div>
          {/* Top Right - Aging Chart */}
          <div>
            <AgingChart />
          </div>
          {/* Bottom Left - Circular Progress */}
          <div>
            <CircularProgressSection />
          </div>
          {/* Bottom Right - Working Capital and Profit Loss */}
          <div className="grid grid-cols-1 gap-6">
            <WorkingCapitalChart />
            <ProfitLossChart />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;