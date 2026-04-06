export interface CategoryReportItem {
  category: string;
  count: number;
}

export interface MonthlyReportItem {
  month: string;
  count: number;
}

export interface SlaReportItem {
  id: number;
  days: number;
}

export interface ZoneHeatmapItem {
  zone: string;
  count: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AnalyticsFilter {
  from: Date | null;
  to: Date | null;
  category: string;
  zone: string;
}
