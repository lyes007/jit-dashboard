// Type definitions for database query results

export interface KPISummary {
  total_machines: number;
  total_articles: number;
  total_operators: number;
  active_days: number;
  total_production: number;
  total_rejected: number;
  overall_quality_rate: number | null;
  overall_material_efficiency: number | null;
}

export interface ProductionTrend {
  full_date: Date;
  machine_code: string;
  daily_production: number;
  avg_quality: number | null;
  active_operators: number;
  events: number;
}

export interface MachinePerformance {
  machine_code: string;
  machine_name: string;
  machine_type: string;
  days_active: number;
  total_events: number;
  total_requested: number | null;
  total_good: number | null;
  total_rejected: number | null;
  avg_good_rate: number | null;
  avg_material_efficiency: number | null;
  unique_articles: number;
  unique_operators: number;
}

export interface OperatorPerformance {
  operator_name: string;
  machine_code: string;
  total_events: number;
  total_good_pieces: number | null;
  total_rejected_pieces: number | null;
  avg_good_rate: number | null;
  unique_articles: number;
}

export interface QualityMetrics {
  full_date: Date;
  machine_code: string;
  event_category: string;
  event_count: number;
  total_good: number | null;
  total_rejected: number | null;
  total_defects: number | null;
  avg_good_rate: number | null;
  reject_rate: number | null;
}

export interface MaterialEfficiency {
  machine_code: string;
  wire_code: string;
  usage_count: number;
  total_wire_used: number | null;
  total_wire_good: number | null;
  wire_efficiency: number | null;
  total_terminals: number | null;
  good_terminals: number | null;
  total_seals: number | null;
  good_seals: number | null;
}

