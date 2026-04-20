// ============================================================
// Bear Lead — Google Calendar Integration
//
// Para ativar, configure os seguintes secrets via CLI:
//   supabase secrets set GOOGLE_CALENDAR_ENABLED=true
//   supabase secrets set GOOGLE_CALENDAR_ID=seu-calendar-id@group.calendar.google.com
//   supabase secrets set GOOGLE_SERVICE_ACCOUNT_EMAIL=bear-lead@seu-projeto.iam.gserviceaccount.com
//   supabase secrets set GOOGLE_SERVICE_ACCOUNT_KEY=<chave-privada-em-base64>
//
// Como gerar a chave em base64:
//   cat chave-privada.json | base64 | tr -d '\n'
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

async function getAccessToken(serviceEmail: string, privateKeyB64: string): Promise<string> {
  const now   = Math.floor(Date.now() / 1000);
  const scope = 'https://www.googleapis.com/auth/calendar';

  const header  = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceEmail,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const signingInput = `${encode(header)}.${encode(payload)}`;

  // Decodificar chave privada de base64
  const keyJson   = JSON.parse(atob(privateKeyB64));
  const pemKey    = keyJson.private_key ?? keyJson;

  // Importar chave RSA
  const keyData = pemKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error(`Token error: ${JSON.stringify(tokenData)}`);
  return tokenData.access_token;
}

export async function createCalendarEvent(event: CalendarEvent): Promise<string | null> {
  const enabled = Deno.env.get('GOOGLE_CALENDAR_ENABLED');
  if (enabled !== 'true') {
    console.info('[GoogleCalendar] Desativado. Configure GOOGLE_CALENDAR_ENABLED=true para ativar.');
    return null;
  }

  const calendarId    = Deno.env.get('GOOGLE_CALENDAR_ID');
  const serviceEmail  = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  const serviceKeyB64 = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');

  if (!calendarId || !serviceEmail || !serviceKeyB64) {
    console.warn('[GoogleCalendar] Credenciais incompletas.');
    return null;
  }

  try {
    const accessToken = await getAccessToken(serviceEmail, serviceKeyB64);

    const [h, m]       = event.visitTime.split(':').map(Number);
    const startDateTime = `${event.visitDate}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00-03:00`;
    const endDateTime   = `${event.visitDate}T${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}:00-03:00`;

    const attendees = event.email ? [{ email: event.email, displayName: event.responsibleName }] : [];

    const eventBody = {
      summary:     `Visita — ${event.responsibleName} (${event.childName} · ${event.program})`,
      description: `Responsável: ${event.responsibleName}\nCriança: ${event.childName} — ${event.program}\nWhatsApp: ${event.whatsapp ?? 'N/A'}\nVisitantes: ${event.visitors}\nAgendado via Bear Lead`,
      location:    'Av. João Pernambuco, SN – Pedra do Bode, Petrolina – PE (ao lado do PRIME)',
      start:       { dateTime: startDateTime, timeZone: 'America/Recife' },
      end:         { dateTime: endDateTime,   timeZone: 'America/Recife' },
      attendees,
      reminders: {
        useDefault: false,
        overrides:  [
          { method: 'email', minutes: 1440 },
          { method: 'popup', minutes: 60   },
        ],
      },
    };

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all`,
      {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify(eventBody),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));

    console.info(`[GoogleCalendar] Evento criado: ${data.id}`);
    return data.id;

  } catch (err) {
    console.error('[GoogleCalendar] Erro:', err);
    return null;
  }
}
