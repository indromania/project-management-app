import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://127.0.0.1:8000/api/login/';

  constructor(private http: HttpClient) {}

  // 🔐 Login call to backend
  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password });
  }

  // 💾 Save token to local storage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // 📥 Retrieve token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🔓 Clear token from local storage
  logout(): void {
    localStorage.removeItem('token');
  }
}
