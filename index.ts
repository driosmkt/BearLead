// ============================================================
// BEAR LEAD — Edge Function: receptor de webhooks do n8n
// ============================================================
//
// Deploy:
//   supabase functions deploy webhook-leads
//
// Variável de ambiente necessária no Supabase:
//   WEBHOOK_SECRET = <mesmo valor que n8nConfig.webhookSecret>
//
// URL gerada após deploy:
//   https://<project>.supabase.co/functions/v1/webhook-leads
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { n8nConfig } from '../../lib/n8nConfig.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

Deno.serve(async (req: Request) => {

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // ── 1. Validar token de segurança ──────────────────────────
  const authHeader = req.headers.get('Authorization') ?? '';
  const token      = authHeader.replace('Bearer ', '').trim();
  const secret     = Deno.env.get('WEBHOOK_SECRET') ?? '';

  if (!secret || token !== secret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── 2. Parse do payload ────────────────────────────────────
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── 3. Mapear campos do n8n para o schema do banco ─────────
  const fm = n8nConfig.fieldMap;
  const df = n8nConfig.defaults;

  const leadData = {
    name:           String(payload[fm.name]       ?? ''),
    phone:          String(payload[fm.phone]       ?? ''),
    whatsapp:       String(payload[fm.whatsapp]    ?? payload[fm.phone] ?? ''),
    email:          String(payload[fm.email]       ?? ''),
    child_name:     String(payload[fm.child_name]  ?? ''),
    child_age:      Number(payload[fm.child_age]   ?? 0),
    program:        String(payload[fm.program]     ?? df.program),
    source:         String(payload[fm.source]      ?? df.source),
    summary:        String(payload[fm.summary]     ?? ''),
    unit_id:        String(payload[fm.unit_id]     ?? df.unit_id),
    status:         df.status,
    score:          df.score,
    raw_payload:    payload,  // guarda o payload original para auditoria
    created_at:     new Date().toISOString(),
  };

  // ── 4. Validação mínima ────────────────────────────────────
  if (!leadData.name || !leadData.unit_id) {
    return new Response(
      JSON.stringify({ error: 'Campos obrigatórios: name, unit_id' }),
      { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // ── 5. Inserir no Supabase ─────────────────────────────────
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // service role bypassa RLS
  );

  const { data: lead, error: insertError } = await supabase
    .from('leads')
    .insert(leadData)
    .select()
    .single();

  // ── 6. Log do webhook ──────────────────────────────────────
  await supabase.from('webhook_log').insert({
    unit_id:   leadData.unit_id,
    source:    'n8n',
    payload,
    status:    insertError ? 'error' : 'processed',
    error_msg: insertError?.message ?? null,
  });

  if (insertError) {
    console.error('[webhook-leads] Insert falhou:', insertError.message);
    return new Response(
      JSON.stringify({ error: insertError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // ── 7. Inserir entrada na linha do tempo ───────────────────
  await supabase.from('lead_history').insert({
    lead_id: lead.id,
    action:  'Lead criado via n8n',
    actor:   'Sistema',
    type:    'system',
    detail:  `Origem: ${leadData.source}`,
  });

  return new Response(
    JSON.stringify({ success: true, lead_id: lead.id }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
