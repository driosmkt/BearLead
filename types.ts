export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LEADS = 'LEADS',
  LEAD_DETAIL = 'LEAD_DETAIL',
  CAMPAIGNS = 'CAMPAIGNS',
  SUBSCRIPTION = 'SUBSCRIPTION',
  REPORTS = 'REPORTS',
  N8N_CONFIG = 'N8N_CONFIG'
}

export type LeadStatus = 
  | 'Novo Lead' 
  | 'Em Atendimento' 
  | 'Agendado' 
  | 'Visitou' 
  | 'Matriculado' 
  | 'Follow-up Recuperação'
  | 'Perdido';

export type LeadScore = 'Quente' | 'Morno' | 'Frio';

export interface LeadHistory {
  id: string;
  leadId: string;
  type: 'system' | 'ai' | 'lead' | 'consultant' | 'note';
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  responsibleName: string;
  whatsapp: string;
  email: string;
  childName: string;
  program: string;
  status: LeadStatus;
  score: LeadScore;
  createdAt: string;
  lastInteraction: string;
  firstResponseTime?: string;
  interactionsCount: number;
  probability: number;
  engagement: number; // 1 to 3 fires
  internalNotes: string;
  aiSummary: string;
  history: LeadHistory[];
  origin: string;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  parentAgeRange: string;
  childAge: number;
  unitId: string;
  nextAction?: string;
}

export interface Unit {
  id: string;
  name: string;
  slug: string;
}

export interface N8nConfig {
  webhookUrl: string;
  bearerToken: string;
  unitId: string;
  fieldMap: Record<string, string>;
}
