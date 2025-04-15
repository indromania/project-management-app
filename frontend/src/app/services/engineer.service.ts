import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EngineerService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addEngineer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add-engineer/`, data, { headers: this.getHeaders() });
  }

  getTeam(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/team/`, { headers: this.getHeaders() });
  }

  deleteEngineer(email: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-engineer/?email=${encodeURIComponent(email)}`, { headers: this.getHeaders() });
  }
}
