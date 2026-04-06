import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from '../../shared/models';
import { CategoryReportItem, MonthlyReportItem, SlaReportItem } from './analytics.models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);

  getCategoryReport(): Observable<CategoryReportItem[]> {
    return this.http.get<CategoryReportItem[]>('/api/reports/categories');
  }

  getMonthlyReport(): Observable<MonthlyReportItem[]> {
    return this.http.get<MonthlyReportItem[]>('/api/reports/monthly');
  }

  getSlaReport(): Observable<SlaReportItem[]> {
    return this.http.get<SlaReportItem[]>('/api/reports/sla');
  }

  getComplaints(assignedOfficerId?: number): Observable<Complaint[]> {
    const params = assignedOfficerId ? { assignedOfficerId: String(assignedOfficerId) } : undefined;
    return this.http.get<Complaint[]>('/api/complaints', { params });
  }
}
