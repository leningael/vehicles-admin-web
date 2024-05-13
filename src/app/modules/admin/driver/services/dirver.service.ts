import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Driver } from '../interfaces/driver.interfaces';

@Injectable({
    providedIn: 'root'
})
export class DriverService {
    readonly apiUrl: string = environment.apiUrl;
    private _httpClient = inject(HttpClient);

    getDrivers(): Observable<Driver[]> {
        return this._httpClient.get<Driver[]>(`${this.apiUrl}/driver`);
    }

    createDriver(driver: Driver): Observable<Driver> {
        return this._httpClient.post<Driver>(`${this.apiUrl}/driver`, driver);
    }

    updateDriver(driver: Driver): Observable<Driver> {
        return this._httpClient.put<Driver>(`${this.apiUrl}/driver/`, driver);
    }

    deleteDriver(id: number): Observable<void> {
        return this._httpClient.delete<void>(`${this.apiUrl}/driver/${id}`);
    }
}