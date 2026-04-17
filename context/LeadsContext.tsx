import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Lead, LeadStatus, ViewState } from '../types';
import { mockLeads } from './mockData';

interface LeadsContextType {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  addNote: (leadId: string, content: string) => void;
  metrics: {
    totalLeads: number;
    scheduled: number;
    enrolled: number;
    conversionRate: number;
  };
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
    
    // Add to history
    addNote(leadId, `Status alterado para: ${newStatus}`, 'system');
  };

  const addNote = (leadId: string, content: string, type: any = 'note') => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          history: [
            {
              id: Math.random().toString(36).substr(2, 9),
              leadId,
              type,
              content,
              createdAt: new Date().toISOString()
            },
            ...lead.history
          ]
        };
      }
      return lead;
    }));
  };

  const metrics = useMemo(() => {
    const total = leads.length;
    const scheduled = leads.filter(l => l.status === 'Agendado').length;
    const enrolled = leads.filter(l => l.status === 'Matriculado').length;
    const conversionRate = total > 0 ? (enrolled / total) * 100 : 0;

    return {
      totalLeads: total,
      scheduled,
      enrolled,
      conversionRate
    };
  }, [leads]);

  return (
    <LeadsContext.Provider value={{
      leads,
      setLeads,
      currentView,
      setCurrentView,
      selectedLeadId,
      setSelectedLeadId,
      updateLeadStatus,
      addNote,
      metrics
    }}>
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeadsContext = () => {
  const context = useContext(LeadsContext);
  if (!context) throw new Error('useLeadsContext must be used within LeadsProvider');
  return context;
};
