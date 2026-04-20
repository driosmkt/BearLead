// ============================================================
// Bear Lead — Google Calendar Integration
// Ativado quando GOOGLE_CALENDAR_ENABLED=true nos secrets
//
// Para ativar:
// 1. Criar projeto no Google Cloud Console
// 2. Ativar Google Calendar API
// 3. Criar Service Account e baixar o JSON de credenciais
// 4. Compartilhar a agenda com o e-mail da Service Account
// 5. Configurar os secrets abaixo via:
//    supabase secrets set GOOGLE_CALENDAR_ENABLED=true
//    supabase secrets set GOOGLE_CALENDAR_ID=sua-agenda@group.calendar.google.com
//    supabase secrets set GOOGLE_SERVICE_ACCOUNT_EMAIL=...
//    supabase secrets set GOOGLE_SERVICE_ACCOUNT_KEY=...  (chave privada em base64)
// ============================================================

interface CalendarEvent {
  responsibleName: string;
  childName:       string;
  program:         string;
  visitDate:       string; // YYYY-MM-DD
  visitTime:       string; // HH:MM
  visitors:        string;
  email?:          string;
  whatsapp?:       string;
}

export async function createCalendarEvent(event: CalendarEvent): Promise<string | null> {
  const enabled = Deno.env.get('GOOGLE_CALENDAR_ENABLED');
  if (enabled !== 'true') {
    console.info('[GoogleCalendar] Integração desativada. Configure GOOGLE_CALENDAR_ENABLED=true para ativar.');
    return null;
  }

  const calendarId    = Deno.env.get('GOOGLE_CALENDAR_ID');
  const serviceEmail  = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  const serviceKeyB64 = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');

  if (!calendarId || !serviceEmail || !serviceKeyB64) {
    console.warn('[GoogleCalendar] Credenciais incompletas. Verifique os secrets.');
    return null;
  }

  try {
    // Montar data/hora do evento (1 hora de duração padrão)
    const startDateTime = `${event.visitDate}T${event.visitTime}:00-03:00`;
    const [h, m] = event.visitTime.split(':').map(Number);
    const endH   = String(h + 1).padStart(2, '0');
    const endDateTime = `${event.visitDate}T${endH}:${String(m).padStart(2, '0')}:00-03:00`;

    // Attendees — responsável + equipe interna
    const attendees: { email: string; displayName?: string }[] = [];
    if (event.email) {
      attendees.push({ email: event.email, displayName: event.responsibleName });
    }

    const eventBody = {
      summary:     `Visita — ${event.responsibleName} (${event.childName} · ${event.program})`,
      description: [
        `Responsável: ${event.responsibleName}`,
        `Criança: ${event.childName} — ${event.program}`,
        `WhatsApp: ${event.whatsapp ?? 'N/A'}`,
        `Visitantes: ${event.visitors}`,
        `Agendado via Bear Lead`,
      ].join('\n'),
      location:  'Av. João Pernambuco, SN – Pedra do Bode, Petrolina – PE (ao lado do PRIME)',
      start:     { dateTime: startDateTime, timeZone: 'America/Recife' },
      end:       { dateTime: endDateTime,   timeZone: 'America/Recife' },
      attendees,
      reminders: {
        useDefault: false,
        overrides:  [
          { method: 'email',  minutes: 1440 }, // 24h antes
          { method: 'popup',  minutes: 60   }, // 1h antes
        ],
      },
    };

    // TODO: Implementar JWT para Service Account e chamar a API
    // Por ora, loga o evento que seria criado
    console.info('[GoogleCalendar] Evento preparado (integração pendente de ativação):', JSON.stringify(eventBody));

    // Quando ativado, o retorno será o eventId do Google Calendar
    return null;

  } catch (err) {
    console.error('[GoogleCalendar] Erro ao criar evento:', err);
    return null;
  }
}
