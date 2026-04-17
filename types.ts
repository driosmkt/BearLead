import React from 'react';

export enum ViewState {
  DASHBOARD    = 'dashboard',
  LEADS        = 'leads',
  CAMPAIGNS    = 'campaigns',
  REPORTS      = 'reports',
  SUBSCRIPTION = 'subscription',
  N8N_CONFIG   = 'n8n_config',
}

export type LeadStatus =
  | 'Novo Lead'
  | 'Em atendimento'
  | 'Agendado'
  | 'Visitou'
  | 'Matriculado'
  | 'Follow-up Recuperação'
  | 'Perdido';

export type LeadScore = 'Quente' | 'Morno' | 'Frio';

export interface LeadHistory {
  date:    string;
  action:  string;
  user:    string;
  type?:   'message' | 'call' | 'system' | 'ai' | 'note';
  detail?: string;
}

export interface Sibling {
  name:   string;
  age:    number;
  status: string;
}

export interface Lead {
  id:                 string;
  name:               string;
  childName:          string;
  childAge:           number;
  program:            string;
  status:             LeadStatus;
  score?:             LeadScore;
  owner?:             string;
  bestTime?:          string;
  nextAction?:        string;
  probability?:       string;
  interactionsCount?: number;
  phone?:             string;
  whatsapp?:          string;
  email?:             string;
  createdAt:          string;
  lastContactAt:      string;
  source: 'Facebook Ads' | 'Google Ads' | 'Instagram' | 'Google Meu Negócio' | 'Indicação' | 'Outros';
  summary?:           string;
  history?:           LeadHistory[];
  siblings?:          Sibling[];
}

export interface MetricCardProps {
  title:          string;
  value:          string | number;
  trendValue:     string;
  trendDirection: 'up' | 'down' | 'neutral';
  statusLabel:    string;
  statusColor:    'red' | 'yellow' | 'green';
  icon:           React.ReactNode;
  iconBgColor?:   string;
  iconColor?:     string;
}
