import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {
    DriverAssignment,
    DriverAssignmentRequest,
    DriverAssignmentUpdate,
} from '../interfaces/driver-assignments.interfaces';
import { Driver } from '../interfaces/drivers.interfaces';
import { Vehicle } from '../interfaces/vehicles.interfaces';

@Injectable({
    providedIn: 'root',
})
export class DriverAssignmentsService {
    readonly apiUrl: string = environment.apiUrl;
    private _httpClient = inject(HttpClient);

    getActiveDriverAssignments(): Observable<DriverAssignment[]> {
        return this._httpClient.get<DriverAssignment[]>(
            `${this.apiUrl}/driver-assignment/active`
        );
    }

    // TODO: Move this to drivers service
    getDrivers(): Observable<Driver[]> {
        return this._httpClient.get<Driver[]>(`${this.apiUrl}/driver`);
    }

    // TODO: Move this to drivers service
    getVehicles(): Observable<Vehicle[]> {
        return this._httpClient.get<Vehicle[]>(`${this.apiUrl}/vehicles`);
    }

    createDriverAssignment(
        assignment: DriverAssignmentRequest
    ): Observable<DriverAssignment> {
        return this._httpClient.post<DriverAssignment>(
            `${this.apiUrl}/driver-assignment`,
            assignment
        );
    }

    updateDriverAssignment(
        driver_id: number,
        vehicle_id: number,
        travel_date: string,
        assignment: DriverAssignmentUpdate
    ): Observable<DriverAssignment> {
        return this._httpClient.put<DriverAssignment>(
            `${this.apiUrl}/driver-assignment/${driver_id}/${vehicle_id}/${travel_date}`,
            assignment
        );
    }

    deactivateDriverAssignment({
        driver_id,
        vehicle_id,
        travel_date,
    }: DriverAssignment): Observable<void> {
        return this._httpClient.delete<void>(
            `${this.apiUrl}/driver-assignment/${driver_id}/${vehicle_id}/${travel_date}`
        );
    }
}
