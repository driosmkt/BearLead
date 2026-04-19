import React from 'react';
import { FlaskConical, X } from 'lucide-react';
import { useLeadsContext } from '../context/LeadsContext';

export const DemoBanner: React.FC = () => {
  const { isDemo } = useLeadsContext();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isDemo || dismissed) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <FlaskConical size={15} />
        Modo demonstração — dados simulados. Conecte o n8n para ver leads reais.
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-amber-600 rounded transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
};
