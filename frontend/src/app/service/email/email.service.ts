import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export interface DownloadRequestPayload {
  userEmail: string;
  productInfo: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  sendDownloadRequest(payload: DownloadRequestPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.API_URL}/email/download-request`,
      payload,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
