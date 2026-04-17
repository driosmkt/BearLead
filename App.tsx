import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LeadsProvider, useLeadsContext } from './context/LeadsContext';
import { ViewState } from './types';

// Views
import { DashboardView } from './pages/DashboardView';
import { LeadsView } from './pages/LeadsView';
import { LeadDetailView } from './pages/LeadDetailView';
import { CampaignsView } from './pages/CampaignsView';
import { SubscriptionView } from './pages/SubscriptionView';
import { N8nConfigView } from './pages/N8nConfigView';

const AppContent: React.FC = () => {
  const { currentView, selectedLeadId } = useLeadsContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return <DashboardView />;
      case ViewState.LEADS: return <LeadsView />;
      case ViewState.LEAD_DETAIL: return <LeadDetailView />;
      case ViewState.CAMPAIGNS: return <CampaignsView />;
      case ViewState.SUBSCRIPTION: return <SubscriptionView />;
      case ViewState.N8N_CONFIG: return <N8nConfigView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:ml-72 min-w-0">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LeadsProvider>
      <AppContent />
    </LeadsProvider>
  );
};

export default App;
