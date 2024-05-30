import { Injectable, inject } from '@angular/core';
import { Vehicle, VehicleRequest } from '../interfaces/vehicles.interfaces';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  readonly apiUrl: string = environment.apiUrl;
  private _httpClient = inject(HttpClient);

  getVehicles(): Observable<Vehicle[]> {
      return this._httpClient.get<Vehicle[]>(`${this.apiUrl}/vehicles`);
  }

  createVehicle(vehicle: VehicleRequest): Observable<Vehicle> {
      return this._httpClient.post<Vehicle>(`${this.apiUrl}/vehicles`, vehicle);
  }

  updateVehicle(vehicle_id: number, vehicle: VehicleRequest): Observable<Vehicle> {
      return this._httpClient.put<Vehicle>(`${this.apiUrl}/vehicles/${vehicle_id}`, vehicle);
  }

  deleteVehicle(vehicle_id: number): Observable<void> {
      return this._httpClient.delete<void>(`${this.apiUrl}/vehicles/${vehicle_id}`);
  }

  downloadPicture(vin: string): Observable<Blob> {
    return this._httpClient.get(`${this.apiUrl}/vehicles/${vin}/picture`, {responseType: 'blob'})
  }

}
