import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const COST_PER_CALL = 1; // 1 crédito por chamada

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { lead, unit_id, user_id } = await req.json();

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY não configurada');

    // ── Verificar e debitar créditos ──────────────────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: credits } = await supabase
      .from('ai_credits')
      .select('balance')
      .eq('unit_id', unit_id)
      .single();

    if (!credits || credits.balance < COST_PER_CALL) {
      return new Response(JSON.stringify({
        error: 'credits_insuficientes',
        message: 'Créditos IA insuficientes. Contate o administrador para recarregar.',
        balance: credits?.balance ?? 0,
      }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Debitar crédito antes de chamar a API
    await supabase
      .from('ai_credits')
      .update({
        balance:    credits.balance - COST_PER_CALL,
        total_used: (credits.balance - COST_PER_CALL), // será recalculado
        updated_at: new Date().toISOString(),
      })
      .eq('unit_id', unit_id);

    // ── Extrair objeção ───────────────────────────────────────────────────
    const objecoes = (lead.history ?? [])
      .filter((h: any) => h.content?.startsWith('Objeção registrada:'))
      .map((h: any) => h.content.replace('Objeção registrada:', '').trim());

    const ultimaObjecao = objecoes[0] ?? '';
    if (!ultimaObjecao) {
      // Devolver crédito se não há objeção
      await supabase.from('ai_credits').update({ balance: credits.balance }).eq('unit_id', unit_id);
      return new Response(JSON.stringify({ error: 'Nenhuma objeção registrada' }), {
        status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── Chamar Claude ─────────────────────────────────────────────────────
    const prompt = `Você é especialista em vendas da escola bilíngue Maple Bear. Retorne SOMENTE o JSON abaixo preenchido, sem nenhum texto adicional:
[{"canal":"WhatsApp","mensagem":"sua mensagem aqui","argumento":"seu argumento aqui"},{"canal":"E-mail","mensagem":"sua mensagem aqui","argumento":"seu argumento aqui"},{"canal":"Ligação","mensagem":"seu roteiro aqui","argumento":"seu argumento aqui"}]

Objeção do lead ${lead.responsibleName} (criança ${lead.childName}, ${lead.program}): "${ultimaObjecao}"`;

    const res     = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-opus-4-5',
        max_tokens: 800,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    const rawText = await res.text();

    if (!res.ok) {
      // Devolver crédito se a API falhou
      await supabase.from('ai_credits').update({ balance: credits.balance }).eq('unit_id', unit_id);

      // Erro de saldo na conta Anthropic — mensagem amigável
      if (rawText.includes('credit balance is too low')) {
        return new Response(JSON.stringify({
          error: 'servico_indisponivel',
          message: 'Serviço de IA temporariamente indisponível. Entre em contato com o suporte.',
        }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      throw new Error(`Claude API erro ${res.status}`);
    }

    const envelope  = JSON.parse(rawText);
    const text      = envelope.content?.[0]?.text ?? '';
    const match     = text.match(/\[[\s\S]*?\]/);
    if (!match) throw new Error('Resposta inválida da IA');

    const sugestoes = JSON.parse(match[0]);

    // ── Registrar uso ─────────────────────────────────────────────────────
    await supabase.from('ai_usage_log').insert({
      unit_id, user_id,
      feature: 'objecao_ia',
      cost:    COST_PER_CALL,
      lead_id: lead.id,
    });

    return new Response(JSON.stringify({
      sugestoes,
      balance_remaining: credits.balance - COST_PER_CALL,
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[ai-objecao]', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
