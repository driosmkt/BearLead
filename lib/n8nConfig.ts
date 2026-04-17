// ============================================================
// BEAR LEAD — Configuração de Integração com n8n
// ============================================================
//
// Este arquivo centraliza TUDO relacionado ao n8n:
//   - URL do webhook
//   - Mapeamento dos campos recebidos
//   - Valores padrão quando campo não vem preenchido
//
// Quando seu sócio finalizar o fluxo n8n, preencha aqui.
// Não é necessário mexer em nenhum outro arquivo.
// ============================================================

export const n8nConfig = {

  // ----------------------------------------------------------
  // URL do Webhook
  // Gerado automaticamente pelo n8n ao criar o nó "Webhook"
  // Exemplo: https://n8n.seudominio.com/webhook/bear-lead
  // ----------------------------------------------------------
  webhookUrl: '',  // ← preencher depois

  // ----------------------------------------------------------
  // Token de segurança (Bearer Token)
  // Configurado no nó "Webhook" do n8n como Header Auth
  // Deve ser o mesmo valor em WEBHOOK_SECRET na Edge Function
  // ----------------------------------------------------------
  webhookSecret: '',  // ← preencher depois

  // ----------------------------------------------------------
  // Mapeamento de campos
  //
  // Chave   = nome do campo no Bear Lead (banco Supabase)
  // Valor   = nome do campo como vem no payload do n8n
  //
  // Se o n8n enviar { "nome_completo": "João" } e o Bear Lead
  // espera { "name": "João" }, defina: name: 'nome_completo'
  // ----------------------------------------------------------
  fieldMap: {
    name:          'name',           // Nome do responsável
    phone:         'phone',          // Telefone principal
    whatsapp:      'whatsapp',       // WhatsApp (pode ser igual ao phone)
    email:         'email',          // E-mail do responsável
    child_name:    'child_name',     // Nome da criança
    child_age:     'child_age',      // Idade da criança (número)
    program:       'program',        // Programa: Bear Care | Toddler | Kindergarten
    source:        'source',         // Origem: Facebook Ads | Instagram | Google Ads...
    summary:       'summary',        // Resumo gerado pela IA (pode vir do n8n)
    unit_id:       'unit_id',        // ID da unidade franqueada (UUID)
  } as Record<string, string>,

  // ----------------------------------------------------------
  // Valores padrão
  // Usados quando o campo não vem no payload do n8n
  // ----------------------------------------------------------
  defaults: {
    status:     'Novo Lead',
    score:      'Morno',
    program:    'A definir',
    source:     'Outros',
    unit_id:    '',   // ← preencher após rodar schema.sql e copiar o UUID da tabela units
  },

};

// ----------------------------------------------------------
// Fontes de lead reconhecidas pelo sistema
// ----------------------------------------------------------
export const LEAD_SOURCES = [
  'Facebook Ads',
  'Instagram',
  'Google Ads',
  'Google Meu Negócio',
  'Indicação',
  'Outros',
] as const;

// ----------------------------------------------------------
// Programas disponíveis
// ----------------------------------------------------------
export const PROGRAMS = [
  'Bear Care',
  'Toddler',
  'Kindergarten',
  'A definir',
] as const;
