import React, { useState, useEffect } from 'react';
import { Sidebar }         from './components/Sidebar';
import { Header }          from './components/Header';
import { DashboardView }   from './pages/DashboardView';
import { LeadsView }       from './pages/LeadsView';
import { SubscriptionView} from './pages/SubscriptionView';
import { CampaignsView }   from './pages/CampaignsView';
import { LeadDetailView }  from './pages/LeadDetailView';
import { N8nConfigView }   from './pages/N8nConfigView';
import { ViewState, Lead } from './types';
import { Construction }    from 'lucide-react';

const App: React.FC = () => {
  const [currentView,    setCurrentView]    = useState<ViewState>(ViewState.DASHBOARD);
  const [isDarkMode,     setIsDarkMode]     = useState(false);
  const [selectedLead,   setSelectedLead]   = useState<Lead | null>(null);
  const [isSidebarOpen,  setIsSidebarOpen]  = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    setSelectedLead(null);
    setIsSidebarOpen(false);
  };

  const renderView = () => {
    if (selectedLead) {
      return <LeadDetailView lead={selectedLead} onBack={() => setSelectedLead(null)} />;
    }

    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardView />;
      case ViewState.LEADS:
        return <LeadsView onSelectLead={setSelectedLead} />;
      case ViewState.CAMPAIGNS:
        return <CampaignsView />;
      case ViewState.SUBSCRIPTION:
        return <SubscriptionView />;
      case ViewState.N8N_CONFIG:
        return <N8nConfigView />;
      case ViewState.REPORTS:
        return (
          <div className="flex items-center justify-center h-[50vh] flex-col text-slate-400 dark:text-slate-500 gap-4">
            <Construction size={48} strokeWidth={1.5} />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">Em Desenvolvimento</h2>
              <p className="text-sm mt-1">A seção Relatórios estará disponível em breve.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentView={currentView}
        onChangeView={handleViewChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Header
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 mt-20 p-4 lg:p-8 overflow-y-auto h-[calc(100vh-80px)] w-full">
          <div className="max-w-[1600px] mx-auto h-full">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
