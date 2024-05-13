import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { DashboardMetrics } from '../interfaces/dashboard.interfaces';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    readonly apiUrl: string = environment.apiUrl;
    private _httpClient = inject(HttpClient);

    getDashboardMetrics(): Observable<DashboardMetrics> {
        return this._httpClient.get<DashboardMetrics>(`${this.apiUrl}/management/metrics`);
    }
}
