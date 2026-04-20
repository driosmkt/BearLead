import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Lock, Camera, CheckCircle2, AlertCircle, Loader2, Settings } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user } = useAuth();

  // Nome
  const [fullName,     setFullName]     = useState(user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? '');
  const [savingName,   setSavingName]   = useState(false);
  const [nameSaved,    setNameSaved]    = useState(false);

  // Senha
  const [currentPass,  setCurrentPass]  = useState('');
  const [newPass,      setNewPass]      = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [showPass,     setShowPass]     = useState(false);
  const [savingPass,   setSavingPass]   = useState(false);
  const [passMsg,      setPassMsg]      = useState<{ type: 'ok'|'err'; text: string } | null>(null);

  // Avatar
  const [avatarUrl,    setAvatarUrl]    = useState<string | null>(user?.user_metadata?.avatar_url ?? null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const initials = (fullName || user?.email || 'U').charAt(0).toUpperCase();

  const handleSaveName = async () => {
    setSavingName(true);
    await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSavingName(false);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2500);
  };

  const handleSavePassword = async () => {
    setPassMsg(null);
    if (!newPass || newPass.length < 6) { setPassMsg({ type: 'err', text: 'A senha precisa ter ao menos 6 caracteres.' }); return; }
    if (newPass !== confirmPass)         { setPassMsg({ type: 'err', text: 'As senhas não coincidem.' }); return; }
    setSavingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setSavingPass(false);
    if (error) { setPassMsg({ type: 'err', text: error.message }); return; }
    setPassMsg({ type: 'ok', text: 'Senha atualizada com sucesso!' });
    setCurrentPass(''); setNewPass(''); setConfirmPass('');
    setTimeout(() => setPassMsg(null), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const ext  = file.name.split('.').pop();
    const path = `avatars/${user!.id}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (!uploadErr) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
      setAvatarUrl(data.publicUrl);
    }
    setUploadingAvatar(false);
  };

  const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="card-glass p-6">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-1.5">
        {icon} {title}
      </h3>
      {children}
    </div>
  );

  const inputCls = "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all placeholder:text-slate-400";

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-2xl">
      <div>
        <h2 className="text-3xl font-display font-black dark:text-white">Configurações</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Gerencie suas informações pessoais e segurança.</p>
      </div>

      {/* Foto de Perfil */}
      <Section icon={<Camera size={12} />} title="Foto de Perfil">
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            {avatarUrl
              ? <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover" />
              : <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-rose-200 dark:from-red-900/30 dark:to-rose-800/30 flex items-center justify-center font-display font-black text-3xl text-red-600">{initials}</div>
            }
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-red-600/20 transition-all">
              {uploadingAvatar ? <Loader2 size={14} className="text-white animate-spin" /> : <Camera size={14} className="text-white" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <p className="text-sm font-semibold dark:text-white">{fullName || user?.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-1">JPG ou PNG · máx. 2MB</p>
          </div>
        </div>
      </Section>

      {/* Informações Pessoais */}
      <Section icon={<User size={12} />} title="Informações Pessoais">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nome completo</label>
            <input value={fullName} onChange={e => { setFullName(e.target.value); setNameSaved(false); }} className={inputCls} placeholder="Seu nome" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">E-mail</label>
            <input value={user?.email ?? ''} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
            <p className="text-xs text-slate-400 mt-1">Para alterar o e-mail, entre em contato com o suporte.</p>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSaveName} disabled={savingName}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-60">
              {savingName ? <Loader2 size={14} className="animate-spin" /> : nameSaved ? <CheckCircle2 size={14} /> : null}
              {nameSaved ? 'Salvo!' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </Section>

      {/* Senha */}
      <Section icon={<Lock size={12} />} title="Segurança — Alterar Senha">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nova senha</label>
            <input type={showPass ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)}
              className={inputCls} placeholder="Mínimo 6 caracteres" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confirmar nova senha</label>
            <input type={showPass ? 'text' : 'password'} value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
              className={inputCls} placeholder="Repita a nova senha"
              onKeyDown={e => e.key === 'Enter' && handleSavePassword()} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showpass" checked={showPass} onChange={e => setShowPass(e.target.checked)}
              className="rounded text-red-600" />
            <label htmlFor="showpass" className="text-xs text-slate-500 cursor-pointer">Mostrar senhas</label>
          </div>
          {passMsg && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium
              ${passMsg.type === 'ok'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
              {passMsg.type === 'ok' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {passMsg.text}
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={handleSavePassword} disabled={savingPass || !newPass || !confirmPass}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50">
              {savingPass && <Loader2 size={14} className="animate-spin" />}
              Atualizar senha
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
};
