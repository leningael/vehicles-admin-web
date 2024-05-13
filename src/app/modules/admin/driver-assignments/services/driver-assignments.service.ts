import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { DriverAssignment } from '../interfaces/driver-assignments.interfaces';

@Injectable({
    providedIn: 'root',
})
export class DriverAssignmentsService {
    readonly apiUrl: string = environment.apiUrl;
    private _httpClient = inject(HttpClient);

    getActiveDriverAssignments(): Observable<DriverAssignment[]> {
        return this._httpClient.get<DriverAssignment[]>(`${this.apiUrl}/driver-assignment/active`);
    }
}
