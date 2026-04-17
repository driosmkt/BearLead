import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Lead, LeadStatus } from '../types';

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface UseLeadsReturn {
  leads:       Lead[];
  loading:     boolean;
  error:       string | null;
  updateStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  refetch:     () => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Mapeia a linha do banco para o tipo Lead do frontend */
function dbRowToLead(row: Record<string, unknown>): Lead {
  return {
    id:              String(row.id),
    name:            String(row.name ?? ''),
    childName:       String(row.child_name ?? ''),
    childAge:        Number(row.child_age ?? 0),
    program:         String(row.program ?? ''),
    status:          (row.status as LeadStatus) ?? 'Novo Lead',
    score:           (row.score as Lead['score']) ?? undefined,
    owner:           String(row.owner ?? ''),
    bestTime:        String(row.best_time ?? ''),
    nextAction:      String(row.next_action ?? ''),
    probability:     row.probability ? String(row.probability) + '%' : undefined,
    interactionsCount: 0,
    phone:           String(row.phone ?? ''),
    whatsapp:        String(row.whatsapp ?? row.phone ?? ''),
    createdAt:       String(row.created_at ?? ''),
    lastContactAt:   String(row.last_contact_at ?? row.created_at ?? ''),
    source:          (row.source as Lead['source']) ?? 'Outros',
    summary:         String(row.summary ?? ''),
    history:         [],
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLeads(): UseLeadsReturn {
  const [leads,   setLeads]   = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: dbError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      setError(dbError.message);
    } else {
      setLeads((data ?? []).map(dbRowToLead));
    }

    setLoading(false);
  }, []);

  // Carregamento inicial
  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Realtime: novos leads chegam automaticamente (vindos do n8n via webhook)
  useEffect(() => {
    const channel = supabase
      .channel('leads-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          const newLead = dbRowToLead(payload.new as Record<string, unknown>);
          setLeads(prev => [newLead, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        (payload) => {
          const updated = dbRowToLead(payload.new as Record<string, unknown>);
          setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Atualização de status com optimistic UI
  const updateStatus = useCallback(async (leadId: string, status: LeadStatus) => {
    // 1. Atualiza local imediatamente
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));

    // 2. Persiste no banco
    const { error: dbError } = await supabase
      .from('leads')
      .update({ status, last_contact_at: new Date().toISOString() })
      .eq('id', leadId);

    // 3. Se falhar, reverte
    if (dbError) {
      console.error('[useLeads] updateStatus falhou:', dbError.message);
      await fetchLeads(); // refetch para garantir consistência
    }
  }, [fetchLeads]);

  return { leads, loading, error, updateStatus, refetch: fetchLeads };
}
