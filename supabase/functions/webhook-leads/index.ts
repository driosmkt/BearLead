// ============================================================
// Bear Lead — Edge Function: webhook-leads
// POST  → cria lead (Agente SDR)
// PATCH → atualiza lead (Agente Closer ou SDR em qualquer etapa)
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Schema POST — criação pelo Agente SDR ─────────────────────────────────────
const CreateSchema = z.object({
  responsible_name:  z.string().min(1).max(200),
  whatsapp:          z.string().min(8).max(20),
  email:             z.string().email().optional().nullable(),
  child_name:        z.string().min(1).max(200),
  child_birth_date:  z.string().optional().nullable(),  // "YYYY-MM-DD" — SDR coleta
  child_age:         z.coerce.number().int().min(0).max(12).optional().nullable(),
  program:           z.enum(['Bear Care','Toddler','Nursery','Junior Kindergarten','Senior Kindergarten','Elementary']).optional(),
  period:            z.enum(['Manhã','Tarde','Integral','Manha','manha','tarde','integral']).optional().nullable(),
  intended_start:    z.string().max(100).optional().nullable(), // "próximo semestre"
  source:            z.string().max(100).optional().default('Outros'),
  score:             z.enum(['Quente','Morno','Frio']).optional().default('Frio'),
  probability:       z.coerce.number().int().min(0).max(100).optional().default(0),
  ai_summary:        z.string().max(2000).optional().nullable(),
  next_action:       z.string().max(500).optional().nullable(),
  unit_id:           z.string().uuid().optional().nullable(),
  // Contexto do agente para a linha do tempo
  agent:             z.enum(['SDR','Closer','Sistema']).optional().default('SDR'),
});

// ── Schema PATCH — atualização progressiva ────────────────────────────────────
const UpdateSchema = z.object({
  lead_id:           z.string().uuid(),                 // obrigatório no PATCH
  // Campos que o Closer preenche
  email:             z.string().email().optional().nullable(),
  visit_date:        z.string().optional().nullable(),  // "YYYY-MM-DD"
  visit_time:        z.string().optional().nullable(),  // "HH:MM"
  visitors:          z.string().max(500).optional().nullable(), // quem vai na visita
  // Campos que qualquer agente pode atualizar
  status:            z.enum(['Novo Lead','Em Atendimento','Agendado','Visitou','Matriculado','Follow-up Recuperação','Perdido']).optional(),
  score:             z.enum(['Quente','Morno','Frio']).optional(),
  probability:       z.coerce.number().int().min(0).max(100).optional(),
  ai_summary:        z.string().max(2000).optional().nullable(),
  next_action:       z.string().max(500).optional().nullable(),
  period:            z.enum(['Manhã','Tarde','Integral','Manha','manha','tarde','integral']).optional().nullable(),
  intended_start:    z.string().max(100).optional().nullable(),
  // Evento para registrar na linha do tempo
  agent:             z.enum(['SDR','Closer','Sistema']).optional().default('Sistema'),
  event_description: z.string().max(500).optional().nullable(),
});

// ── Calcula programa pela idade ───────────────────────────────────────────────
function programByAge(age: number): string {
  if (age <= 1)  return 'Bear Care';
  if (age === 2) return 'Toddler';
  if (age === 3) return 'Nursery';
  if (age === 4) return 'Junior Kindergarten';
  if (age === 5) return 'Senior Kindergarten';
  return 'Elementary';
}

// ── Calcula idade pela data de nascimento ─────────────────────────────────────
function ageFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return new Response(JSON.stringify({ error: 'Método não permitido. Use POST ou PATCH.' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Verificar token ───────────────────────────────────────────────────────
  const token  = (req.headers.get('Authorization') ?? '').replace('Bearer ', '').trim();
  const secret = Deno.env.get('WEBHOOK_SECRET') ?? '';

  if (!secret || token !== secret) {
    return new Response(JSON.stringify({ error: 'Token inválido' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch {
    return new Response(JSON.stringify({ error: 'JSON inválido' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // ══════════════════════════════════════════════════════════════════════════
  // POST — Agente SDR cria o lead
  // ══════════════════════════════════════════════════════════════════════════
  if (req.method === 'POST') {
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({
        error: 'Payload inválido', issues: parsed.error.flatten().fieldErrors,
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const d = parsed.data;

    // Resolve unit_id
    let unitId = d.unit_id;
    if (!unitId) {
      const { data: unit } = await supabase.from('units').select('id').limit(1).single();
      unitId = unit?.id ?? null;
    }
    if (!unitId) {
      return new Response(JSON.stringify({ error: 'Unidade não encontrada' }), {
        status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calcula idade e programa se vier data de nascimento
    let childAge  = d.child_age;
    let program   = d.program;
    if (d.child_birth_date && !childAge) {
      childAge = ageFromBirthDate(d.child_birth_date);
    }
    if (!program && childAge !== undefined && childAge !== null) {
      program = programByAge(childAge) as any;
    }

    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert({
        unit_id:          unitId,
        responsible_name: d.responsible_name,
        whatsapp:         d.whatsapp,
        email:            d.email          ?? null,
        child_name:       d.child_name,
        child_age:        childAge         ?? null,
        program:          program          ?? 'Toddler',
        status:           'Novo Lead',
        score:            d.score,
        probability:      d.probability,
        source:           d.source,
        ai_summary:       d.ai_summary     ?? null,
        next_action:      d.next_action    ?? null,
        last_contact_at:  new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertError || !lead) {
      console.error('[webhook-leads] Erro ao inserir:', insertError);
      return new Response(JSON.stringify({ error: 'Erro ao salvar lead' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Webhook log
    await supabase.from('webhook_log').insert({
      unit_id: unitId, source: d.source, payload: body, status: 'processed',
    });

    // Linha do tempo — entrada inicial
    await supabase.from('lead_history').insert({
      lead_id: lead.id,
      type:    'ai',
      action:  `Lead recebido pelo Agente ${d.agent}`,
      detail:  `Origem: ${d.source} · Score: ${d.score} · Programa: ${program ?? 'A definir'}`,
    });

    return new Response(JSON.stringify({
      success: true, lead_id: lead.id, message: 'Lead criado com sucesso',
    }), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PATCH — Agente Closer (ou SDR) atualiza o lead
  // ══════════════════════════════════════════════════════════════════════════
  if (req.method === 'PATCH') {
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({
        error: 'Payload inválido', issues: parsed.error.flatten().fieldErrors,
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const d = parsed.data;

    // Monta apenas os campos que vieram no payload
    const updates: Record<string, any> = { last_contact_at: new Date().toISOString() };
    if (d.email        !== undefined) updates.email         = d.email;
    if (d.status       !== undefined) updates.status        = d.status;
    if (d.score        !== undefined) updates.score         = d.score;
    if (d.probability  !== undefined) updates.probability   = d.probability;
    if (d.ai_summary   !== undefined) updates.ai_summary    = d.ai_summary;
    if (d.next_action  !== undefined) updates.next_action   = d.next_action;
    if (d.period       !== undefined) updates.best_time     = d.period;
    if (d.visit_date   !== undefined) updates.visit_date    = d.visit_date;
    if (d.visit_time   !== undefined) updates.visit_time    = d.visit_time;
    if (d.visitors     !== undefined) updates.owner         = d.visitors;

    const { error: updateError } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', d.lead_id);

    if (updateError) {
      console.error('[webhook-leads] Erro ao atualizar:', updateError);
      return new Response(JSON.stringify({ error: 'Erro ao atualizar lead' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Evento na linha do tempo
    const eventDesc = d.event_description
      ?? (d.status === 'Agendado'    ? `Visita agendada para ${d.visit_date} às ${d.visit_time}` :
          d.status === 'Matriculado' ? 'Lead matriculado pelo agente' :
          `Atualização pelo Agente ${d.agent}`);

    await supabase.from('lead_history').insert({
      lead_id: d.lead_id,
      type:    'ai',
      action:  `Agente ${d.agent} atualizou o lead`,
      detail:  eventDesc,
    });

    return new Response(JSON.stringify({
      success: true, lead_id: d.lead_id, message: 'Lead atualizado com sucesso',
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
