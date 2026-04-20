import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Lead, LeadStatus, LeadHistory } from '../types';
import { mockLeads } from '../context/mockData';

function dbRowToLead(row: any, history: LeadHistory[] = []): Lead {
  return {
    id:                row.id,
    responsibleName:   row.responsible_name ?? row.name ?? '',
    whatsapp:          row.whatsapp          ?? '',
    email:             row.email             ?? '',
    childName:         row.child_name        ?? '',
    program:           row.program           ?? '',
    status:            row.status            as LeadStatus,
    score:             row.score             ?? 'Frio',
    createdAt:         row.created_at,
    lastInteraction:   row.last_contact_at   ?? row.created_at,
    interactionsCount: row.interactions_count ?? 0,
    probability:       row.probability       ?? 0,
    engagement:        row.engagement        ?? 1,
    internalNotes:     row.internal_notes    ?? '',
    aiSummary:         row.ai_summary ?? row.summary ?? '',
    origin:            row.source            ?? 'Outros',
    gender:            row.gender            ?? 'Feminino',
    parentAgeRange:    row.parent_age_range  ?? '25-34',
    childAge:          row.child_age         ?? 1,
    unitId:            row.unit_id,
    nextAction:        row.next_action       ?? '',
    visitDate:         row.visit_date        ?? undefined,
    visitTime:         row.visit_time        ?? undefined,
    visitors:          row.owner             ?? undefined,
    history,
  };
}

function dbRowToHistory(row: any): LeadHistory {
  return {
    id:        row.id,
    leadId:    row.lead_id,
    type:      row.type      ?? 'system',
    content:   row.action    ?? row.detail ?? '',
    actor:     row.actor     ?? null,
    createdAt: row.created_at,
  };
}

export function useLeads() {
  const [leads,   setLeads]   = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [isDemo,  setIsDemo]  = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: rows, error: err } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      console.warn('[useLeads] Supabase indisponível, usando dados demo:', err.message);
      setLeads(mockLeads);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    if (!rows || rows.length === 0) {
      console.info('[useLeads] Banco vazio, usando dados demo.');
      setLeads(mockLeads);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    const leadIds = rows.map((r: any) => r.id);
    const { data: historyRows } = await supabase
      .from('lead_history')
      .select('*')
      .in('lead_id', leadIds)
      .order('created_at', { ascending: false });

    const historyByLead: Record<string, LeadHistory[]> = {};
    (historyRows ?? []).forEach((h: any) => {
      if (!historyByLead[h.lead_id]) historyByLead[h.lead_id] = [];
      historyByLead[h.lead_id].push(dbRowToHistory(h));
    });

    setLeads(rows.map((r: any) => dbRowToLead(r, historyByLead[r.id] ?? [])));
    setIsDemo(false);
    setLoading(false);
  }, []);

  const updateLeadStatus = useCallback(async (leadId: string, newStatus: LeadStatus, actor?: string) => {
    // Optimistic UI — reflete imediatamente
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (isDemo) return;

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus, last_contact_at: new Date().toISOString() })
      .eq('id', leadId);

    if (error) {
      console.error('[useLeads] Erro ao atualizar status:', error.message);
      fetchLeads();
      return;
    }

    // Registrar mudança de status na linha do tempo
    const statusLabels: Record<string, string> = {
      'Novo Lead':             'Lead movido para Início',
      'Em Atendimento':        'Lead em atendimento',
      'Agendado':              'Visita agendada',
      'Visitou':               'Visita realizada ✓',
      'Matriculado':           'Lead matriculado 🎉',
      'Follow-up Recuperação': 'Lead em recuperação',
      'Perdido':               'Lead desqualificado',
    };

    await supabase.from('lead_history').insert({
      lead_id: leadId,
      type:    'system',
      action:  statusLabels[newStatus] ?? `Status atualizado para ${newStatus}`,
      detail:  actor ? `Por: ${actor}` : null,
      actor:   actor ?? null,
    });
  }, [isDemo, fetchLeads]);

  const addNote = useCallback(async (leadId: string, content: string, type = 'note', actor?: string) => {
    const tempEntry: LeadHistory = {
      id:        `temp-${Date.now()}`,
      leadId,
      type:      type as any,
      content,
      actor:     actor ?? null,
      createdAt: new Date().toISOString(),
    };
    // Optimistic UI
    setLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, history: [tempEntry, ...l.history] } : l
    ));
    if (isDemo) return;

    const { error } = await supabase
      .from('lead_history')
      .insert({ lead_id: leadId, type, action: content, detail: content, actor: actor ?? null });

    if (error) console.error('[useLeads] Erro ao salvar nota:', error.message);
  }, [isDemo]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Realtime — novos leads e atualizações chegam em tempo real
  useEffect(() => {
    if (isDemo) return;

    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => setLeads(prev => [dbRowToLead(payload.new, []), ...prev])
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        (payload) => setLeads(prev =>
          prev.map(l => l.id === payload.new.id ? dbRowToLead(payload.new, l.history) : l)
        )
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isDemo]);

  return { leads, setLeads, loading, error, isDemo, updateLeadStatus, addNote, refetch: fetchLeads };
}
