import React, { useState } from 'react';
import { Sidebar }     from './components/Sidebar';
import { Header }      from './components/Header';
import { DemoBanner }  from './components/DemoBanner';
import { LeadsProvider, useLeadsContext } from './context/LeadsContext';
import { AuthProvider, useAuth }          from './context/AuthContext';
import { LoginView }   from './pages/LoginView';
import { ViewState }   from './types';

import { DashboardView }    from './pages/DashboardView';
import { LeadsView }        from './pages/LeadsView';
import { LeadDetailView }   from './pages/LeadDetailView';
import { CampaignsView }    from './pages/CampaignsView';
import { SubscriptionView } from './pages/SubscriptionView';
import { N8nConfigView }    from './pages/N8nConfigView';
import { SettingsView }     from './pages/SettingsView';
import { ReportsView }      from './pages/ReportsView';
import { TeamView }         from './pages/TeamView';

// ─── Loading ──────────────────────────────────────────────────────────────────
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/25 animate-pulse">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <p className="text-sm text-slate-400 font-medium">Carregando Bear Lead...</p>
    </div>
  </div>
);

// ─── App autenticado ──────────────────────────────────────────────────────────
const AppContent: React.FC = () => {
  const { currentView, loading } = useLeadsContext();
  const { isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) return <LoadingScreen />;

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:    return <DashboardView />;
      case ViewState.LEADS:        return <LeadsView />;
      case ViewState.LEAD_DETAIL:  return <LeadDetailView />;
      case ViewState.CAMPAIGNS:    return <CampaignsView />;
      case ViewState.SUBSCRIPTION: return isAdmin ? <SubscriptionView /> : <DashboardView />;
      case ViewState.N8N_CONFIG:   return isAdmin ? <N8nConfigView /> : <DashboardView />;
      case ViewState.SETTINGS:     return <SettingsView />;
      case ViewState.REPORTS:      return <ReportsView />;
      case ViewState.TEAM:         return isAdmin ? <TeamView /> : <DashboardView />;
      default:                     return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col md:ml-72 min-w-0">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <DemoBanner />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

// ─── Auth gate ────────────────────────────────────────────────────────────────
const AuthGate: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user)   return <LoginView />;
  return (
    <LeadsProvider>
      <AppContent />
    </LeadsProvider>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <AuthProvider>
    <AuthGate />
  </AuthProvider>
);

export default App;
