import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { InvitationCode } from '../interfaces/invitation-codes.interfaces';

@Injectable({
  providedIn: 'root'
})
export class InvitationCodesService {
  readonly apiUrl: string = environment.apiUrl;
  private _httpClient = inject(HttpClient);

  getInvitationCodes(): Observable<InvitationCode[]> {
    return this._httpClient.get<InvitationCode[]>(`${this.apiUrl}/invitation-code`);
  }

  deleteInvitationCode(code: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.apiUrl}/invitation-code/${code}`);
  }

  createInvitationCode(email: string): Observable<InvitationCode> {
    return this._httpClient.post<InvitationCode>(`${this.apiUrl}/invitation-code`, { email });
  }

  changeInvitationEmail(code: string, email: string): Observable<InvitationCode> {
    return this._httpClient.patch<InvitationCode>(`${this.apiUrl}/invitation-code/${code}`, { email });
  }
}
