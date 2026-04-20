import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();
  const [show,      setShow]      = useState(false);
  const [exiting,   setExiting]   = useState(false);

  useEffect(() => {
    if (!user) return;

    // Verificar se tem 50 créditos e 0 usados
    const check = async () => {
      const { data: uu } = await supabase
        .from('user_units').select('unit_id').eq('user_id', user.id).single();
      if (!uu) return;

      const { data: cr } = await supabase
        .from('ai_credits').select('balance, total_used').eq('unit_id', uu.unit_id).single();

      if (cr && cr.balance === 50 && cr.total_used === 0) {
        // Verificar se já foi dispensado nesta sessão
        const dismissed = sessionStorage.getItem('welcome_banner_dismissed');
        if (!dismissed) setShow(true);
      }
    };
    check();
  }, [user]);

  // Auto-dismiss após 30 segundos
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => dismiss(), 30000);
    return () => clearTimeout(timer);
  }, [show]);

  const dismiss = () => {
    setExiting(true);
    sessionStorage.setItem('welcome_banner_dismissed', '1');
    setTimeout(() => setShow(false), 400);
  };

  if (!show) return null;

  return (
    <div className={`mx-4 md:mx-8 mt-4 transition-all duration-400 ${exiting ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">🎉 Bem-vindo ao Bear Lead!</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
            Sua conta foi ativada com <strong>50 créditos IA gratuitos</strong>. Acesse <strong>Créditos IA</strong> no menu para saber mais.
          </p>
        </div>
        <button onClick={dismiss}
          className="p-1.5 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-all shrink-0">
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
