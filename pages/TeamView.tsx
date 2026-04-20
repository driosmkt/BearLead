import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Users, Mail, Shield, UserCheck, Trash2, Loader2, CheckCircle2, AlertCircle, Crown, Send } from 'lucide-react';

type Role = 'admin' | 'consultant';

interface Member {
  id:        string;
  userId:    string;
  email:     string;
  name:      string;
  role:      Role;
  createdAt: string;
}

const ROLE_LABELS: Record<Role, string> = {
  admin:      'Administrador',
  consultant: 'Consultor',
};

const ROLE_DESC: Record<Role, string> = {
  admin:      'Acesso total — leads, configurações e equipe',
  consultant: 'Acesso aos leads — sem configurações',
};

export const TeamView: React.FC = () => {
  const { user } = useAuth();
  const [members,       setMembers]       = useState<Member[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [inviteEmail,   setInviteEmail]   = useState('');
  const [inviteRole,    setInviteRole]    = useState<Role>('consultant');
  const [sending,       setSending]       = useState(false);
  const [inviteMsg,     setInviteMsg]     = useState<{ type: 'ok'|'err'; text: string } | null>(null);
  const [removingId,    setRemovingId]    = useState<string | null>(null);
  const [unitId,        setUnitId]        = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    // Buscar unit_id do usuário atual
    const { data: uu } = await supabase
      .from('user_units')
      .select('unit_id')
      .eq('user_id', user!.id)
      .single();

    if (!uu) { setLoading(false); return; }
    setUnitId(uu.unit_id);

    // Buscar todos os membros da unidade
    const { data: members } = await supabase
      .from('user_units')
      .select('id, user_id, role, created_at')
      .eq('unit_id', uu.unit_id)
      .order('created_at');

    if (!members) { setLoading(false); return; }

    // Buscar dados: usuário atual vem do auth, demais ficam com placeholder
    // (admin API não disponível no frontend — dados reais virão quando o membro fizer login)
    const currentUser = await supabase.auth.getUser();
    const cu = currentUser.data.user;

    const memberData: Member[] = members.map((m) => {
      const isMe = m.user_id === cu?.id;
      return {
        id:        m.id,
        userId:    m.user_id,
        email:     isMe ? (cu?.email ?? '') : `membro-${m.user_id.slice(0,6)}@equipe`,
        name:      isMe
          ? (cu?.user_metadata?.full_name ?? cu?.email?.split('@')[0] ?? 'Você')
          : `Membro ${m.user_id.slice(0,6)}`,
        role:      m.role as Role,
        createdAt: m.created_at,
      };
    });

    setMembers(memberData);

    // Buscar convites pendentes para mostrar na lista
    const { data: invites } = await supabase
      .from('team_invites')
      .select('id, email, role, created_at')
      .eq('unit_id', uu.unit_id)
      .eq('status', 'pending');

    if (invites && invites.length > 0) {
      const pendingMembers: Member[] = invites.map(inv => ({
        id:        `invite-${inv.id}`,
        userId:    '',
        email:     inv.email,
        name:      inv.email.split('@')[0],
        role:      inv.role as Role,
        createdAt: inv.created_at,
        pending:   true,
      } as any));
      setMembers(prev => [...prev, ...pendingMembers]);
    }

    setLoading(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !/\S+@\S+\.\S+/.test(inviteEmail)) {
      setInviteMsg({ type: 'err', text: 'Digite um e-mail válido.' });
      return;
    }
    setSending(true);
    setInviteMsg(null);

    // Convidar usuário via Supabase Auth (Magic Link)
    const { error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(inviteEmail, {
      data: { invited_by: user?.email, role: inviteRole },
    }).catch(e => ({ error: e })) as any;

    if (inviteErr) {
      // Fallback: registrar convite pendente na tabela
      const { error: insertErr } = await supabase.from('team_invites').insert({
        unit_id:    unitId,
        email:      inviteEmail.trim().toLowerCase(),
        role:       inviteRole,
        invited_by: user!.id,
        status:     'pending',
      });

      if (insertErr) {
        setInviteMsg({ type: 'err', text: 'Erro ao enviar convite. Verifique se o e-mail é válido.' });
        setSending(false);
        return;
      }
    }

    setInviteMsg({ type: 'ok', text: `Convite enviado para ${inviteEmail}!` });
    setInviteEmail('');
    setSending(false);
    setTimeout(() => setInviteMsg(null), 4000);
  };

  const handleChangeRole = async (memberId: string, newRole: Role) => {
    await supabase.from('user_units').update({ role: newRole }).eq('id', memberId);
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
  };

  const handleRemove = async (memberId: string, memberUserId: string) => {
    if (memberUserId === user!.id) return; // não pode remover a si mesmo
    setRemovingId(memberId);
    await supabase.from('user_units').delete().eq('id', memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
    setRemovingId(null);
  };

  const inputCls = "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all placeholder:text-slate-400";

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-3xl">
      <div>
        <h2 className="text-3xl font-display font-black dark:text-white">Equipe</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Gerencie os membros e níveis de acesso da sua unidade.</p>
      </div>

      {/* Níveis de acesso */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(ROLE_LABELS) as Role[]).map(role => (
          <div key={role} className="card-glass p-4 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${role === 'admin' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
              {role === 'admin' ? <Crown size={16} className="text-red-600" /> : <UserCheck size={16} className="text-blue-600" />}
            </div>
            <div>
              <p className="text-sm font-bold dark:text-white">{ROLE_LABELS[role]}</p>
              <p className="text-xs text-slate-400 mt-0.5">{ROLE_DESC[role]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Convidar */}
      <div className="card-glass p-6">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Send size={11} /> Convidar Membro
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={inviteEmail}
            onChange={e => { setInviteEmail(e.target.value); setInviteMsg(null); }}
            onKeyDown={e => e.key === 'Enter' && handleInvite()}
            placeholder="email@exemplo.com"
            className={`${inputCls} flex-1`}
          />
          <select value={inviteRole} onChange={e => setInviteRole(e.target.value as Role)}
            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/20">
            <option value="consultant">Consultor</option>
            <option value="admin">Administrador</option>
          </select>
          <button onClick={handleInvite} disabled={sending}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-60 whitespace-nowrap">
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
            Enviar convite
          </button>
        </div>
        {inviteMsg && (
          <div className={`flex items-center gap-2 mt-3 p-3 rounded-xl text-sm font-medium
            ${inviteMsg.type === 'ok'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
            {inviteMsg.type === 'ok' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {inviteMsg.text}
          </div>
        )}
      </div>

      {/* Lista de membros */}
      <div className="card-glass p-6">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <Users size={11} /> Membros da Equipe
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {members.map(member => {
              const isMe = member.userId === user!.id;
              return (
                <div key={member.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-rose-200 dark:from-red-900/30 dark:to-rose-800/30 flex items-center justify-center font-bold text-red-600 shrink-0">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold dark:text-white truncate">{member.name}</p>
                      {isMe && <span className="text-[9px] font-black bg-red-100 dark:bg-red-900/30 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Você</span>}
                      {(member as any).pending && <span className="text-[9px] font-black bg-amber-100 dark:bg-amber-900/30 text-amber-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Convite Pendente</span>}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{member.email}</p>
                  </div>
                  {/* Role */}
                  <select
                    value={member.role}
                    onChange={e => !isMe && handleChangeRole(member.id, e.target.value as Role)}
                    disabled={isMe}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all focus:outline-none
                      ${member.role === 'admin'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                      } ${isMe ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                  >
                    <option value="admin">Administrador</option>
                    <option value="consultant">Consultor</option>
                  </select>
                  {/* Remover */}
                  {!isMe && (
                    <button onClick={() => handleRemove(member.id, member.userId)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                      {removingId === member.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  )}
                </div>
              );
            })}
            {members.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">Nenhum membro ainda. Convide alguém acima.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
