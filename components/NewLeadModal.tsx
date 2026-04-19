import React, { useState } from 'react';
import { X, Loader2, CheckCircle2, Baby, Phone, Mail, Calendar, User, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLeadsContext } from '../context/LeadsContext';
import { useAuth } from '../context/AuthContext';

interface Props { onClose: () => void; }

const PROGRAMS = ['Bear Care','Toddler','Nursery','Junior Kindergarten','Senior Kindergarten','Elementary'];
const SOURCES  = ['Facebook Ads','Google Ads','Instagram','Indicação','Site','Outros'];
const PERIODS  = ['Manhã','Tarde','Integral'];
const SCORES   = ['Quente','Morno','Frio'] as const;
const STARTS   = ['Imediatamente','Próximo mês','Próximo semestre','Ano que vem'];

function programByAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  if (age <= 1)  return 'Bear Care';
  if (age === 2) return 'Toddler';
  if (age === 3) return 'Nursery';
  if (age === 4) return 'Junior Kindergarten';
  if (age === 5) return 'Senior Kindergarten';
  return 'Elementary';
}

function ageFromBirth(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export const NewLeadModal: React.FC<Props> = ({ onClose }) => {
  const { refetch } = useLeadsContext() as any;
  const { user }    = useAuth();

  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [errors,  setErrors]    = useState<Record<string,string>>({});

  const [form, setForm] = useState({
    responsibleName: '',
    whatsapp:        '',
    email:           '',
    childName:       '',
    birthDate:       '',
    program:         '',
    period:          '',
    source:          'Indicação',
    score:           'Morno' as typeof SCORES[number],
    intendedStart:   '',
    notes:           '',
  });

  const set = (field: string, value: string) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      // Calcular programa automaticamente ao mudar data de nascimento
      if (field === 'birthDate' && value) {
        next.program = programByAge(value);
      }
      return next;
    });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.responsibleName.trim()) e.responsibleName = 'Nome obrigatório';
    if (!form.whatsapp.trim())        e.whatsapp        = 'WhatsApp obrigatório';
    if (!form.childName.trim())       e.childName       = 'Nome da criança obrigatório';
    if (!form.birthDate)              e.birthDate       = 'Data de nascimento obrigatória';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);

    // Buscar unit_id do usuário
    const { data: unitData } = await supabase
      .from('user_units')
      .select('unit_id')
      .eq('user_id', user!.id)
      .single();

    const unitId = unitData?.unit_id;

    const age     = form.birthDate ? ageFromBirth(form.birthDate) : null;
    const program = form.program || (form.birthDate ? programByAge(form.birthDate) : 'Toddler');

    const { error } = await supabase.from('leads').insert({
      unit_id:          unitId,
      responsible_name: form.responsibleName.trim(),
      whatsapp:         form.whatsapp.trim(),
      email:            form.email.trim() || null,
      child_name:       form.childName.trim(),
      child_age:        age,
      program,
      status:           'Novo Lead',
      score:            form.score,
      source:           form.source,
      best_time:        form.period || null,
      intended_start:   form.intendedStart || null,
      internal_notes:   form.notes.trim() || null,
      last_contact_at:  new Date().toISOString(),
    });

    if (error) {
      console.error('[NewLeadModal]', error);
      setErrors({ submit: 'Erro ao salvar. Tente novamente.' });
      setLoading(false);
      return;
    }

    // Registrar na linha do tempo
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('responsible_name', form.responsibleName.trim())
      .eq('whatsapp', form.whatsapp.trim())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lead) {
      await supabase.from('lead_history').insert({
        lead_id: lead.id,
        type:    'system',
        action:  'Lead cadastrado manualmente',
        detail:  `Origem: ${form.source} · Score: ${form.score} · Cadastrado por ${user?.email}`,
      });
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      refetch?.();
      onClose();
    }, 1500);
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = (err?: string) =>
    `w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
      err ? 'border-red-300 focus:ring-red-500/20' : 'border-slate-100 dark:border-slate-700 focus:ring-red-600/20'
    }`;

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <p className="font-display font-bold text-lg dark:text-white">Lead criado com sucesso!</p>
          <p className="text-sm text-slate-400">Aparecendo no Kanban agora...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="font-display font-bold text-lg dark:text-white">Novo Lead</h2>
            <p className="text-xs text-slate-400 mt-0.5">Cadastro manual — aparece em Novo Lead no Kanban</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Responsável */}
          <div className="flex items-center gap-2 mb-1">
            <User size={14} className="text-red-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Responsável</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nome completo *" error={errors.responsibleName}>
              <input value={form.responsibleName} onChange={e => set('responsibleName', e.target.value)}
                placeholder="Ex: Ana Souza" className={inputCls(errors.responsibleName)} />
            </Field>
            <Field label="WhatsApp *" error={errors.whatsapp}>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
                  placeholder="87999990000" className={`${inputCls(errors.whatsapp)} pl-8`} />
              </div>
            </Field>
            <Field label="E-mail" error={errors.email}>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="ana@email.com" className={`${inputCls(errors.email)} pl-8`} />
              </div>
            </Field>
          </div>

          {/* Criança */}
          <div className="flex items-center gap-2 pt-2 mb-1">
            <Baby size={14} className="text-red-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Criança</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nome da criança *" error={errors.childName}>
              <input value={form.childName} onChange={e => set('childName', e.target.value)}
                placeholder="Ex: Pedro" className={inputCls(errors.childName)} />
            </Field>
            <Field label="Data de nascimento *" error={errors.birthDate}>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="date" value={form.birthDate} onChange={e => set('birthDate', e.target.value)}
                  className={`${inputCls(errors.birthDate)} pl-8`} />
              </div>
            </Field>
            <Field label="Programa">
              <div className="flex items-center gap-2">
                <select value={form.program} onChange={e => set('program', e.target.value)}
                  className={`${inputCls()} flex-1`}>
                  <option value="">Selecionar...</option>
                  {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {form.birthDate && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg whitespace-nowrap">
                    Auto: {programByAge(form.birthDate)}
                  </span>
                )}
              </div>
            </Field>
            <Field label="Período">
              <select value={form.period} onChange={e => set('period', e.target.value)} className={inputCls()}>
                <option value="">Selecionar...</option>
                {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
          </div>

          {/* Contexto comercial */}
          <div className="flex items-center gap-2 pt-2 mb-1">
            <Zap size={14} className="text-red-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contexto Comercial</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Origem">
              <select value={form.source} onChange={e => set('source', e.target.value)} className={inputCls()}>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Score">
              <select value={form.score} onChange={e => set('score', e.target.value as any)} className={inputCls()}>
                {SCORES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Pretende iniciar">
              <select value={form.intendedStart} onChange={e => set('intendedStart', e.target.value)} className={inputCls()}>
                <option value="">Selecionar...</option>
                {STARTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Observação inicial">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Como este lead chegou até você? Algum detalhe importante..."
              rows={3} className={`${inputCls()} resize-none`} />
          </Field>

          {errors.submit && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{errors.submit}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : 'Criar Lead'}
          </button>
        </div>

      </div>
    </div>
  );
};
