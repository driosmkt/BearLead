import React, { createContext, useContext, useState, useMemo } from 'react';
import { Lead, LeadStatus, ViewState } from '../types';
import { useLeads } from '../hooks/useLeads';

interface LeadsContextType {
  // Dados
  leads:            Lead[];
  setLeads:         React.Dispatch<React.SetStateAction<Lead[]>>;
  loading:          boolean;
  isDemo:           boolean;
  // Navegação
  currentView:      ViewState;
  setCurrentView:   (view: ViewState) => void;
  selectedLeadId:   string | null;
  setSelectedLeadId:(id: string | null) => void;
  // Ações
  updateLeadStatus: (leadId: string, newStatus: LeadStatus, actor?: string) => void;
  addNote:          (leadId: string, content: string, type?: string, actor?: string) => void;
  refetch:          () => void;
  // Métricas
  metrics: {
    totalLeads:     number;
    scheduled:      number;
    enrolled:       number;
    conversionRate: number;
  };
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { leads, setLeads, loading, isDemo, updateLeadStatus, addNote, refetch } = useLeads();
  const [currentView,    setCurrentView]    = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const total     = leads.length;
    const scheduled = leads.filter(l => l.status === 'Agendado').length;
    const enrolled  = leads.filter(l => l.status === 'Matriculado').length;
    return {
      totalLeads:     total,
      scheduled,
      enrolled,
      conversionRate: total > 0 ? (enrolled / total) * 100 : 0,
    };
  }, [leads]);

  return (
    <LeadsContext.Provider value={{
      leads, setLeads, loading, isDemo,
      currentView, setCurrentView,
      selectedLeadId, setSelectedLeadId,
      updateLeadStatus, addNote, refetch,
      metrics,
    }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeadsContext = () => {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeadsContext deve ser usado dentro de <LeadsProvider>');
  return ctx;
};
