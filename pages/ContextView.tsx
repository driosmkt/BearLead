import React from 'react';
import { CheckCircle2, AlertCircle, Globe, Instagram, MapPin } from 'lucide-react';
import { InfoCard } from '../components/InfoCard';
import { config } from '../config';

export const ContextView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Situação Atual: Potência de Marca vs. Fricção Digital</h2>
        <p className="text-2xl text-slate-600 max-w-4xl">
          A {config.company.name} tem autoridade, tecnologia e equipe. O desafio não é o produto, é o caminho digital até ele.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-100 p-8 rounded-2xl border border-emerald-200">
          <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={32} />
            Fortalezas (O que manter)
          </h3>
          <ul className="space-y-4 text-xl text-emerald-800">
            <li className="flex items-start gap-3">
              <span className="font-bold">•</span> Site institucional moderno e visualmente impactante.
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold">•</span> Conteúdo técnico de qualidade nas redes.
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold">•</span> Identidade forte que transmite confiança.
            </li>
          </ul>
        </div>

        <div className="bg-orange-50 p-8 rounded-2xl border border-orange-200">
          <h3 className="text-2xl font-bold text-orange-900 mb-6 flex items-center gap-3">
            <AlertCircle className="text-orange-600" size={32} />
            Pontos de Atrito (Onde perdemos)
          </h3>
          <ul className="space-y-4 text-xl text-orange-800">
            <li className="flex items-start gap-3">
              <span className="font-bold">•</span> Bio do Instagram leva para Linktree genérico.
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold">•</span> Site exige muitos cliques até o contato.
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold">•</span> Telefone fixo na bio (dificulta contato imediato).
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <InfoCard title="Google Meu Negócio" icon={<MapPin size={32} />}>
          Ficha básica. Pouco explorada para conversão local. Foco informativo, não comercial.
        </InfoCard>
        <InfoCard title="Instagram" icon={<Instagram size={32} />}>
          Visual excelente. Falha na conversão: Linktree + telefone fixo ({config.company.phone}) dificultam o clique direto para falar com a {config.company.name}.
        </InfoCard>
        <InfoCard title="Site Institucional" icon={<Globe size={32} />}>
          Linda vitrine, mas navegação lenta para quem tem pressa. Muitos cliques até iniciar uma conversa comercial.
        </InfoCard>
      </div>
    </div>
  );
};